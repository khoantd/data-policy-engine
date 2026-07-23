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
from drpe.models.grace_hold import (
    GraceHold,
    GraceHoldCreate,
    GraceHoldStatus,
)
from drpe.models.policy import EvaluationRequest, EvaluationResponse, Policy
from drpe.models.stored_policy import as_retention
from drpe.ports.action_dispatcher import ActionDispatcher
from drpe.ports.audit_store import AuditStore
from drpe.ports.grace_hold_store import GraceHoldStore
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


def _with_schedule(
    evaluation: EvaluationResponse,
    *,
    grace_period_ends: str | None,
    notify_at: str | None,
) -> EvaluationResponse:
    detail = evaluation.result.model_copy(
        update={
            "grace_period_ends": grace_period_ends,
            "notify_at": notify_at,
        }
    )
    return evaluation.model_copy(update={"result": detail})


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
        grace_hold_store: GraceHoldStore | None = None,
    ) -> None:
        self._policies = policy_store
        self._engine = engine
        self._jobs = job_store
        self._audit = audit_store
        self._dispatcher = dispatcher
        self._records = record_source
        self._grace_holds = grace_hold_store

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

    def force_dispatch_hold(
        self,
        hold_id: str,
        *,
        requester: str | None = None,
        now: datetime | None = None,
    ) -> GraceHold:
        """Skip remaining grace and dispatch the hold's action immediately."""
        if self._grace_holds is None:
            raise RuntimeError("grace hold store is not configured")

        hold = self._grace_holds.get(hold_id)
        if hold is None:
            raise KeyError(f"grace hold not found: {hold_id}")
        if hold.status != GraceHoldStatus.ACTIVE:
            raise ValueError(f"grace hold is not active: {hold.status.value}")

        record = self._find_record(hold.record_id, hold.data_type)
        if record is None:
            raise LookupError(
                f"record '{hold.record_id}' (data_type={hold.data_type}) "
                "not available to the record source"
            )

        now = now or datetime.now(timezone.utc)
        policy = self._policies.get(hold.policy_id)
        retention = as_retention(policy) if policy is not None else None
        if retention is None:
            raise ValueError(f"policy not found or not retention: {hold.policy_id}")

        request = EvaluationRequest(
            data_type=record.data_type,
            record_id=record.record_id,
            metadata=record.metadata,
            source=record.source,
            jurisdiction=record.jurisdiction or retention.jurisdiction,
            context={"requester": requester or "force_dispatch"},
        )
        evaluation = self._engine.evaluate(request, now=now)
        if (
            evaluation.result.matched_policy != hold.policy_id
            or evaluation.result.matched_rule != hold.rule_id
            or evaluation.result.action not in DESTRUCTIVE_ACTIONS
        ):
            # Still force the hold action even if re-eval drifted; use hold action.
            evaluation = _with_schedule(
                evaluation.model_copy(
                    update={
                        "result": evaluation.result.model_copy(
                            update={
                                "action": Action(hold.action),
                                "matched_policy": hold.policy_id,
                                "matched_rule": hold.rule_id,
                                "grace_period_ends": None,
                                "notify_at": None,
                            }
                        )
                    }
                ),
                grace_period_ends=None,
                notify_at=None,
            )
        else:
            evaluation = _with_schedule(
                evaluation, grace_period_ends=None, notify_at=None
            )

        action = Action(hold.action)
        result = self._dispatcher.dispatch(action, record, evaluation)
        req = normalize_requester(requester or "force_dispatch")
        self._audit.append(
            AuditEntryCreate(
                event_type=AuditEventType.ACTION,
                policy_id=hold.policy_id,
                rule_id=hold.rule_id,
                record_id=hold.record_id,
                action=action.value,
                payload={
                    "dispatch": result.model_dump(mode="json"),
                    "forced": True,
                    "hold_id": hold.id,
                },
                evaluation_id=evaluation.evaluation_id,
                requester=req,
            )
        )
        if not result.ok:
            raise RuntimeError(result.detail or "force dispatch failed")

        hold.status = GraceHoldStatus.FORCED
        hold.closed_at = datetime.now(timezone.utc)
        hold.requester = req
        return self._grace_holds.update(hold)

    def cancel_hold(
        self,
        hold_id: str,
        *,
        requester: str | None = None,
    ) -> GraceHold:
        """Abort this grace cycle without dispatching."""
        if self._grace_holds is None:
            raise RuntimeError("grace hold store is not configured")

        hold = self._grace_holds.get(hold_id)
        if hold is None:
            raise KeyError(f"grace hold not found: {hold_id}")
        if hold.status != GraceHoldStatus.ACTIVE:
            raise ValueError(f"grace hold is not active: {hold.status.value}")

        req = normalize_requester(requester or "cancel_grace")
        hold.status = GraceHoldStatus.CANCELLED
        hold.closed_at = datetime.now(timezone.utc)
        hold.requester = req
        updated = self._grace_holds.update(hold)
        self._audit.append(
            AuditEntryCreate(
                event_type=AuditEventType.GRACE_CANCELLED,
                policy_id=hold.policy_id,
                rule_id=hold.rule_id,
                record_id=hold.record_id,
                action=hold.action,
                payload={
                    "hold_id": hold.id,
                    "grace_period_ends": hold.grace_period_ends,
                    "notify_at": hold.notify_at,
                },
                requester=req,
            )
        )
        return updated

    def _find_record(self, record_id: str, data_type: str) -> RecordRef | None:
        if self._records is None:
            return None
        for rec in self._records.iter_records(data_type):
            if rec.record_id == record_id:
                return rec
        return None

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

        evaluation, skip = self._apply_grace_hold(
            job, policy, record, evaluation, now=now, requester=requester
        )
        if skip:
            self._jobs.update(job)
            return

        outcome, action = decide_enforcement_outcome(evaluation, now=now)
        self._apply_outcome(
            job,
            record,
            evaluation,
            outcome,
            action,
            policy,
            requester=requester,
        )
        self._jobs.update(job)

    def _apply_grace_hold(
        self,
        job: EnforcementJob,
        policy: Policy,
        record: RecordRef,
        evaluation: EvaluationResponse,
        *,
        now: datetime,
        requester: str | None,
    ) -> tuple[EvaluationResponse, bool]:
        """Return (evaluation_with_sticky_schedule, skip_further_processing)."""
        if self._grace_holds is None:
            return evaluation, False

        matched_policy = evaluation.result.matched_policy
        matched_rule = evaluation.result.matched_rule
        action = evaluation.result.action

        # No destructive match — drop cancelled hold if present for any prior key
        if (
            matched_policy is None
            or matched_rule is None
            or action not in DESTRUCTIVE_ACTIONS
            or not evaluation.result.grace_period_ends
        ):
            return evaluation, False

        hold = self._grace_holds.get_by_key(
            policy_id=matched_policy,
            rule_id=matched_rule,
            record_id=record.record_id,
        )

        if hold is None:
            hold = self._grace_holds.create(
                GraceHoldCreate(
                    policy_id=matched_policy,
                    rule_id=matched_rule,
                    record_id=record.record_id,
                    data_type=record.data_type,
                    action=action.value,
                    grace_period_ends=evaluation.result.grace_period_ends,
                    notify_at=evaluation.result.notify_at,
                    requester=requester,
                    source_job_id=job.id,
                    evaluation_id=evaluation.evaluation_id,
                )
            )
            evaluation = _with_schedule(
                evaluation,
                grace_period_ends=hold.grace_period_ends,
                notify_at=hold.notify_at,
            )
            return evaluation, False

        if hold.status == GraceHoldStatus.CANCELLED:
            # Still matches → skip; when it stops matching, drop hold (checked below)
            return evaluation, True

        if hold.status in (GraceHoldStatus.DISPATCHED, GraceHoldStatus.FORCED):
            # Rematch after close → fresh hold cycle
            self._grace_holds.delete(hold.id)
            hold = self._grace_holds.create(
                GraceHoldCreate(
                    policy_id=matched_policy,
                    rule_id=matched_rule,
                    record_id=record.record_id,
                    data_type=record.data_type,
                    action=action.value,
                    grace_period_ends=evaluation.result.grace_period_ends,
                    notify_at=evaluation.result.notify_at,
                    requester=requester,
                    source_job_id=job.id,
                    evaluation_id=evaluation.evaluation_id,
                )
            )
            evaluation = _with_schedule(
                evaluation,
                grace_period_ends=hold.grace_period_ends,
                notify_at=hold.notify_at,
            )
            return evaluation, False

        # Active hold — sticky schedule
        evaluation = _with_schedule(
            evaluation,
            grace_period_ends=hold.grace_period_ends,
            notify_at=hold.notify_at,
        )
        return evaluation, False

    def _close_hold_if_dispatched(
        self,
        evaluation: EvaluationResponse,
        record: RecordRef,
        *,
        status: GraceHoldStatus,
    ) -> None:
        if self._grace_holds is None:
            return
        policy_id = evaluation.result.matched_policy
        rule_id = evaluation.result.matched_rule
        if not policy_id or not rule_id:
            return
        hold = self._grace_holds.get_by_key(
            policy_id=policy_id, rule_id=rule_id, record_id=record.record_id
        )
        if hold is None or hold.status != GraceHoldStatus.ACTIVE:
            return
        hold.status = status
        hold.closed_at = datetime.now(timezone.utc)
        self._grace_holds.update(hold)

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
            # Rule no longer matches destructive+grace — drop cancelled holds for cleanup
            self._drop_cancelled_if_unmatched(evaluation, record)
            return

        if outcome == "pending_grace":
            job.progress.pending_grace += 1
            hold_id = None
            if self._grace_holds is not None and evaluation.result.matched_policy:
                hold = self._grace_holds.get_by_key(
                    policy_id=evaluation.result.matched_policy,
                    rule_id=evaluation.result.matched_rule or "",
                    record_id=record.record_id,
                )
                hold_id = hold.id if hold else None
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
                            "hold_id": hold_id,
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
                if outcome == "dispatch" and action in DESTRUCTIVE_ACTIONS:
                    self._close_hold_if_dispatched(
                        evaluation, record, status=GraceHoldStatus.DISPATCHED
                    )
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

    def _drop_cancelled_if_unmatched(
        self,
        evaluation: EvaluationResponse,
        record: RecordRef,
    ) -> None:
        """When record no longer matches, drop cancelled holds so rematch can restart."""
        if self._grace_holds is None:
            return
        # Scan holds for this record that are cancelled and delete them
        for hold in self._grace_holds.list_holds(
            record_id=record.record_id,
            status=GraceHoldStatus.CANCELLED,
            limit=100,
        ):
            self._grace_holds.delete(hold.id)
