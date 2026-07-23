"""Enforcement runner — evaluate records and dispatch/audit with grace awareness."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from drpe.core.evaluator import PolicyEvaluatorEngine
from drpe.models.audit import AuditEntryCreate, AuditEventType, normalize_requester
from drpe.models.enforcement import (
    EnforcementJob,
    JobProgress,
    JobStatus,
    RecordRef,
)
from drpe.models.enums import Action, PolicyStatus
from drpe.models.policy import EvaluationRequest, EvaluationResponse, Policy
from drpe.models.stored_policy import as_retention
from drpe.ports.action_dispatcher import ActionDispatcher
from drpe.ports.audit_store import AuditStore
from drpe.ports.job_store import EnforcementJobStore
from drpe.ports.policy_store import PolicyStore
from drpe.ports.record_source import RecordSource

logger = logging.getLogger(__name__)

DESTRUCTIVE_ACTIONS = frozenset(
    {
        Action.DELETE,
        Action.ARCHIVE,
        Action.ANONYMIZE,
        Action.PSEUDONYMIZE,
    }
)


def _parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    text = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(text)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def decide_enforcement_outcome(
    evaluation: EvaluationResponse,
    *,
    now: datetime | None = None,
) -> tuple[str, Action | None]:
    """Return (outcome, action_to_dispatch).

    Outcomes: ``retain``, ``flag``, ``notify``, ``pending_grace``, ``dispatch``.
    """
    now = now or datetime.now(timezone.utc)
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)

    action = evaluation.result.action
    grace_ends = _parse_iso(evaluation.result.grace_period_ends)
    notify_at = _parse_iso(evaluation.result.notify_at)

    if action == Action.RETAIN:
        return "retain", None

    if action == Action.FLAG:
        return "flag", Action.FLAG

    if action == Action.NOTIFY:
        return "notify", Action.NOTIFY

    if action in DESTRUCTIVE_ACTIONS:
        if grace_ends is not None and now < grace_ends:
            if notify_at is not None and now >= notify_at:
                return "notify", Action.NOTIFY
            return "pending_grace", None
        return "dispatch", action

    # Unknown / future actions: treat as dispatch
    return "dispatch", action


class EnforcementRunner:
    def __init__(
        self,
        *,
        policy_store: PolicyStore,
        engine: PolicyEvaluatorEngine,
        job_store: EnforcementJobStore,
        audit_store: AuditStore,
        dispatcher: ActionDispatcher,
        record_source: RecordSource | None = None,
    ) -> None:
        self._policies = policy_store
        self._engine = engine
        self._jobs = job_store
        self._audit = audit_store
        self._dispatcher = dispatcher
        self._records = record_source

    def run_job(self, job_id: str, *, now: datetime | None = None) -> EnforcementJob:
        job = self._jobs.get(job_id)
        if job is None:
            raise KeyError(f"job not found: {job_id}")

        now = now or datetime.now(timezone.utc)
        job.status = JobStatus.RUNNING
        job.started_at = now
        job.progress = JobProgress()
        self._jobs.update(job)

        try:
            policies = self._resolve_policies(job.policy_id)
            for policy in policies:
                self._process_policy(job, policy, now=now)
            job.status = JobStatus.SUCCEEDED
            job.finished_at = datetime.now(timezone.utc)
            self._jobs.update(job)
        except Exception as exc:  # noqa: BLE001
            logger.exception("enforcement job %s failed", job_id)
            job.status = JobStatus.FAILED
            job.error = str(exc)
            job.finished_at = datetime.now(timezone.utc)
            self._jobs.update(job)
        return job

    def _resolve_policies(self, policy_id: str | None) -> list[Policy]:
        if policy_id:
            policy = self._policies.get(policy_id)
            if policy is None:
                raise ValueError(f"policy not found: {policy_id}")
            retention = as_retention(policy)
            if retention is None:
                raise ValueError(f"policy '{policy_id}' is not a retention policy")
            return [retention]
        return [
            retention
            for retention in (
                as_retention(p)
                for p in self._policies.list_policies(status=PolicyStatus.ACTIVE.value)
            )
            if retention is not None and retention.status == PolicyStatus.ACTIVE
        ]

    def _process_policy(
        self,
        job: EnforcementJob,
        policy: Policy,
        *,
        now: datetime,
    ) -> None:
        data_types = policy.scope.data_types or []
        if not data_types:
            return

        for data_type in data_types:
            records = list(self._iter_records(job, data_type, policy))
            for record in records:
                try:
                    self._process_record(job, policy, record, now=now)
                except Exception as exc:  # noqa: BLE001
                    logger.exception(
                        "record %s failed in job %s", record.record_id, job.id
                    )
                    job.progress.errors += 1
                    self._jobs.update(job)
                    self._audit.append(
                        AuditEntryCreate(
                            event_type=AuditEventType.EVALUATION,
                            policy_id=policy.id,
                            record_id=record.record_id,
                            job_id=job.id,
                            requester="enforcement_runner",
                            payload={"error": str(exc)},
                        )
                    )

    def _iter_records(
        self,
        job: EnforcementJob,
        data_type: str,
        policy: Policy,
    ) -> list[RecordRef]:
        if job.inline_records is not None:
            return [r for r in job.inline_records if r.data_type == data_type]

        if self._records is None:
            return []

        sources = policy.scope.sources or [None]
        seen: set[str] = set()
        out: list[RecordRef] = []
        for source in sources:
            for rec in self._records.iter_records(data_type, source=source):
                if rec.record_id in seen:
                    continue
                seen.add(rec.record_id)
                out.append(rec)
        return out

    def _process_record(
        self,
        job: EnforcementJob,
        policy: Policy,
        record: RecordRef,
        *,
        now: datetime,
    ) -> None:
        request = EvaluationRequest(
            data_type=record.data_type,
            record_id=record.record_id,
            metadata=record.metadata,
            source=record.source,
            jurisdiction=record.jurisdiction or policy.jurisdiction,
            context={"requester": "enforcement_runner", "job_id": job.id},
        )
        requester = normalize_requester(request.context.get("requester"))
        # Prefer engine policies; ensure current policy is considered via store list
        evaluation = self._engine.evaluate(request, now=now)
        job.progress.scanned += 1

        log_evaluations = True
        if policy.audit is not None:
            log_evaluations = policy.audit.log_evaluations
        if log_evaluations:
            self._audit.append(
                AuditEntryCreate(
                    event_type=AuditEventType.EVALUATION,
                    policy_id=evaluation.result.matched_policy or policy.id,
                    rule_id=evaluation.result.matched_rule,
                    record_id=record.record_id,
                    action=evaluation.result.action.value,
                    payload={"evaluation": evaluation.model_dump(mode="json")},
                    job_id=job.id,
                    evaluation_id=evaluation.evaluation_id,
                    requester=requester,
                )
            )

        outcome, action = decide_enforcement_outcome(evaluation, now=now)
        self._apply_outcome(
            job, record, evaluation, outcome, action, policy, requester=requester
        )
        self._jobs.update(job)

    def _apply_outcome(
        self,
        job: EnforcementJob,
        record: RecordRef,
        evaluation: EvaluationResponse,
        outcome: str,
        action: Action | None,
        policy: Policy,
        *,
        requester: str | None = None,
    ) -> None:
        log_actions = True
        if policy.audit is not None:
            log_actions = policy.audit.log_actions

        if outcome == "retain":
            return

        if outcome == "pending_grace":
            job.progress.pending_grace += 1
            if log_actions:
                self._audit.append(
                    AuditEntryCreate(
                        event_type=AuditEventType.PENDING_GRACE,
                        policy_id=evaluation.result.matched_policy,
                        rule_id=evaluation.result.matched_rule,
                        record_id=record.record_id,
                        action=evaluation.result.action.value,
                        payload={
                            "grace_period_ends": evaluation.result.grace_period_ends,
                            "notify_at": evaluation.result.notify_at,
                        },
                        job_id=job.id,
                        evaluation_id=evaluation.evaluation_id,
                        requester=requester,
                    )
                )
            return

        if outcome == "notify" and action is not None:
            result = self._dispatcher.dispatch(action, record, evaluation)
            job.progress.notified += 1
            if result.ok:
                job.progress.dispatched += 1
            else:
                job.progress.errors += 1
            if log_actions:
                self._audit.append(
                    AuditEntryCreate(
                        event_type=AuditEventType.NOTIFY,
                        policy_id=evaluation.result.matched_policy,
                        rule_id=evaluation.result.matched_rule,
                        record_id=record.record_id,
                        action=Action.NOTIFY.value,
                        payload={"dispatch": result.model_dump(mode="json")},
                        job_id=job.id,
                        evaluation_id=evaluation.evaluation_id,
                        requester=requester,
                    )
                )
            return

        if outcome in ("dispatch", "flag") and action is not None:
            result = self._dispatcher.dispatch(action, record, evaluation)
            if result.ok:
                job.progress.dispatched += 1
            else:
                job.progress.errors += 1
            if log_actions:
                event = (
                    AuditEventType.FLAG
                    if action == Action.FLAG
                    else AuditEventType.ACTION
                )
                self._audit.append(
                    AuditEntryCreate(
                        event_type=event,
                        policy_id=evaluation.result.matched_policy,
                        rule_id=evaluation.result.matched_rule,
                        record_id=record.record_id,
                        action=action.value,
                        payload={"dispatch": result.model_dump(mode="json")},
                        job_id=job.id,
                        evaluation_id=evaluation.evaluation_id,
                        requester=requester,
                    )
                )
            return
