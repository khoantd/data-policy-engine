"""DSAR workflow service — access collection and erasure with exceptions."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from drpe.core.duration import parse_duration
from drpe.models.audit import AuditEntryCreate, AuditEventType
from drpe.models.dsar import (
    DsarDeniedRecord,
    DsarError,
    DsarRequest,
    DsarRequestStatus,
    DsarRequestType,
    DsarResult,
)
from drpe.models.enforcement import RecordRef
from drpe.models.enums import Action
from drpe.models.policy import (
    DsarConfig,
    EvaluationResponse,
    EvaluationResultDetail,
    Policy,
)
from drpe.ports.action_dispatcher import ActionDispatcher
from drpe.ports.audit_store import AuditStore
from drpe.ports.dsar_store import DsarRequestStore
from drpe.ports.policy_store import PolicyStore
from drpe.ports.record_source import RecordSource

DSAR_REQUESTER = "dsar_workflow"

class DsarRightsError(PermissionError):
    """Raised when policy DSAR rights disallow the requested operation."""


def matches_subject(record: RecordRef, subject_id: str) -> bool:
    if record.record_id == subject_id:
        return True
    return record.metadata.get("subject_id") == subject_id


def collect_records(
    *,
    subject_id: str,
    inline: list[RecordRef] | None,
    record_source: RecordSource | None,
    data_types: list[str],
) -> list[RecordRef]:
    """Collect unique matching records from inline payload and RecordSource."""
    by_id: dict[str, RecordRef] = {}

    for rec in inline or []:
        if matches_subject(rec, subject_id):
            by_id[rec.record_id] = rec

    if record_source is not None:
        for data_type in data_types:
            for rec in record_source.iter_records(data_type):
                if matches_subject(rec, subject_id):
                    by_id.setdefault(rec.record_id, rec)

    return list(by_id.values())


def _erasure_exception_reason(
    record: RecordRef, exceptions: list[str]
) -> str | None:
    if not exceptions:
        return None
    exception_set = set(exceptions)
    for key in ("erasure_exception", "legal_basis"):
        value = record.metadata.get(key)
        if isinstance(value, str) and value in exception_set:
            return value
    return None


def _synthetic_evaluation(
    *,
    record: RecordRef,
    policy: Policy,
    request_id: str,
) -> EvaluationResponse:
    return EvaluationResponse(
        record_id=record.record_id,
        evaluation_id=f"dsar_eval_{uuid.uuid4().hex[:12]}",
        result=EvaluationResultDetail(
            action=Action.DELETE,
            matched_policy=policy.id,
            matched_rule=None,
            policy_version=policy.version,
            confidence="definitive",
        ),
        evaluated_at=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        audit_ref=request_id,
    )


def _due_at(dsar: DsarConfig | None, requested_at: datetime) -> datetime | None:
    if dsar is None or not dsar.response_deadline:
        return None
    return requested_at + parse_duration(dsar.response_deadline)


def _resolve_data_types(policy: Policy, inline: list[RecordRef] | None) -> list[str]:
    types = list(policy.scope.data_types) if policy.scope.data_types else []
    if not types and inline:
        seen: set[str] = set()
        for rec in inline:
            if rec.data_type not in seen:
                seen.add(rec.data_type)
                types.append(rec.data_type)
    return types


class DsarService:
    def __init__(
        self,
        *,
        policy_store: PolicyStore,
        dsar_store: DsarRequestStore,
        audit_store: AuditStore,
        dispatcher: ActionDispatcher,
        record_source: RecordSource | None = None,
    ) -> None:
        self._policies = policy_store
        self._dsar = dsar_store
        self._audit = audit_store
        self._dispatcher = dispatcher
        self._records = record_source

    def submit_access(
        self,
        *,
        subject_id: str,
        policy_id: str,
        identity: dict[str, Any] | None = None,
        records: list[RecordRef] | None = None,
    ) -> DsarRequest:
        policy = self._require_policy(policy_id)
        dsar = policy.dsar or DsarConfig()
        if not dsar.right_to_access:
            raise DsarRightsError("policy does not grant right_to_access")

        now = datetime.now(timezone.utc)
        request = self._dsar.create(
            type=DsarRequestType.ACCESS,
            subject_id=subject_id,
            policy_id=policy_id,
            identity=identity,
            inline_records=records,
            due_at=_due_at(dsar, now),
            status=DsarRequestStatus.IN_PROGRESS,
        )

        data_types = _resolve_data_types(policy, records)
        collected = collect_records(
            subject_id=subject_id,
            inline=records,
            record_source=self._records,
            data_types=data_types,
        )
        request.result = DsarResult(records=collected)
        request.status = DsarRequestStatus.COMPLETED
        request.completed_at = datetime.now(timezone.utc)
        request = self._dsar.update(request)

        self._audit.append(
            AuditEntryCreate(
                event_type=AuditEventType.DSAR_ACCESS,
                policy_id=policy_id,
                record_id=subject_id,
                requester=DSAR_REQUESTER,
                payload={
                    "request_id": request.id,
                    "subject_id": subject_id,
                    "record_count": len(collected),
                },
            )
        )
        return request

    def submit_erasure(
        self,
        *,
        subject_id: str,
        policy_id: str,
        identity: dict[str, Any] | None = None,
        records: list[RecordRef] | None = None,
    ) -> DsarRequest:
        policy = self._require_policy(policy_id)
        dsar = policy.dsar or DsarConfig()
        if not dsar.right_to_erasure:
            raise DsarRightsError("policy does not grant right_to_erasure")

        now = datetime.now(timezone.utc)
        request = self._dsar.create(
            type=DsarRequestType.ERASURE,
            subject_id=subject_id,
            policy_id=policy_id,
            identity=identity,
            inline_records=records,
            due_at=_due_at(dsar, now),
            status=DsarRequestStatus.IN_PROGRESS,
        )

        data_types = _resolve_data_types(policy, records)
        collected = collect_records(
            subject_id=subject_id,
            inline=records,
            record_source=self._records,
            data_types=data_types,
        )

        erased: list[str] = []
        denied: list[DsarDeniedRecord] = []
        errors: list[DsarError] = []

        for rec in collected:
            reason = _erasure_exception_reason(rec, dsar.erasure_exceptions)
            if reason is not None:
                denied.append(DsarDeniedRecord(record_id=rec.record_id, reason=reason))
                continue

            evaluation = _synthetic_evaluation(
                record=rec, policy=policy, request_id=request.id
            )
            result = self._dispatcher.dispatch(Action.DELETE, rec, evaluation)
            if result.ok:
                erased.append(rec.record_id)
                self._audit.append(
                    AuditEntryCreate(
                        event_type=AuditEventType.ACTION,
                        policy_id=policy_id,
                        record_id=rec.record_id,
                        action=Action.DELETE.value,
                        evaluation_id=evaluation.evaluation_id,
                        requester=DSAR_REQUESTER,
                        payload={
                            "request_id": request.id,
                            "source": "dsar_erasure",
                        },
                    )
                )
            else:
                errors.append(
                    DsarError(
                        record_id=rec.record_id,
                        detail=result.detail or "dispatch failed",
                    )
                )

        request.result = DsarResult(
            records=collected,
            erased=erased,
            denied=denied,
            errors=errors,
        )
        request.status = self._erasure_status(erased, denied, errors, collected)
        request.completed_at = datetime.now(timezone.utc)
        if request.status == DsarRequestStatus.FAILED and errors:
            request.error = errors[0].detail
        request = self._dsar.update(request)

        self._audit.append(
            AuditEntryCreate(
                event_type=AuditEventType.DSAR_ERASURE,
                policy_id=policy_id,
                record_id=subject_id,
                action=Action.DELETE.value,
                requester=DSAR_REQUESTER,
                payload={
                    "request_id": request.id,
                    "subject_id": subject_id,
                    "erased": erased,
                    "denied": [d.model_dump() for d in denied],
                    "errors": [e.model_dump() for e in errors],
                    "status": request.status.value,
                },
            )
        )
        return request

    def _require_policy(self, policy_id: str) -> Policy:
        policy = self._policies.get(policy_id)
        if policy is None:
            raise KeyError(f"policy not found: {policy_id}")
        return policy

    @staticmethod
    def _erasure_status(
        erased: list[str],
        denied: list[DsarDeniedRecord],
        errors: list[DsarError],
        collected: list[RecordRef],
    ) -> DsarRequestStatus:
        if not collected:
            return DsarRequestStatus.COMPLETED
        if erased and not denied and not errors:
            return DsarRequestStatus.COMPLETED
        if denied and not erased and not errors:
            return DsarRequestStatus.DENIED
        if errors and not erased:
            return DsarRequestStatus.FAILED
        if erased and (denied or errors):
            return DsarRequestStatus.PARTIAL
        if erased:
            return DsarRequestStatus.COMPLETED
        return DsarRequestStatus.FAILED
