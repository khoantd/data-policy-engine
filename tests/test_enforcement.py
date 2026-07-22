"""Unit tests for grace-aware enforcement decisions and runner."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from drpe.adapters.action_dispatchers import LoggingActionDispatcher
from drpe.adapters.memory_audit import InMemoryAuditStore
from drpe.adapters.memory_jobs import InMemoryEnforcementJobStore
from drpe.adapters.memory_records import InMemoryRecordSource
from drpe.adapters.memory_store import InMemoryPolicyStore
from drpe.core.enforcement import EnforcementRunner, decide_enforcement_outcome
from drpe.core.evaluator import PolicyEvaluatorEngine
from drpe.models.audit import AuditEventType
from drpe.models.enforcement import JobTrigger, RecordRef
from drpe.models.enums import Action, DataClassification, Operator, PolicyStatus
from drpe.models.policy import (
    ConditionGroup,
    EvaluationResponse,
    EvaluationResultDetail,
    FieldCondition,
    Policy,
    PolicyRule,
    PolicyScope,
)


def _eval(
    *,
    action: Action = Action.DELETE,
    grace_period_ends: str | None = None,
    notify_at: str | None = None,
) -> EvaluationResponse:
    return EvaluationResponse(
        record_id="r1",
        evaluation_id="eval_1",
        result=EvaluationResultDetail(
            action=action,
            matched_policy="pol_1",
            matched_rule="rule_1",
            policy_version=1,
            grace_period_ends=grace_period_ends,
            notify_at=notify_at,
            confidence="definitive",
        ),
        evaluated_at="2026-07-22T00:00:00Z",
    )


def test_decide_retain() -> None:
    outcome, action = decide_enforcement_outcome(_eval(action=Action.RETAIN))
    assert outcome == "retain"
    assert action is None


def test_decide_pending_grace() -> None:
    now = datetime(2026, 7, 22, tzinfo=timezone.utc)
    future = (now + timedelta(days=10)).isoformat().replace("+00:00", "Z")
    outcome, action = decide_enforcement_outcome(
        _eval(grace_period_ends=future), now=now
    )
    assert outcome == "pending_grace"
    assert action is None


def test_decide_notify_during_grace() -> None:
    now = datetime(2026, 7, 22, tzinfo=timezone.utc)
    grace = (now + timedelta(days=3)).isoformat().replace("+00:00", "Z")
    notify = (now - timedelta(days=1)).isoformat().replace("+00:00", "Z")
    outcome, action = decide_enforcement_outcome(
        _eval(grace_period_ends=grace, notify_at=notify), now=now
    )
    assert outcome == "notify"
    assert action == Action.NOTIFY


def test_decide_dispatch_after_grace() -> None:
    now = datetime(2026, 7, 22, tzinfo=timezone.utc)
    past = (now - timedelta(days=1)).isoformat().replace("+00:00", "Z")
    outcome, action = decide_enforcement_outcome(
        _eval(grace_period_ends=past), now=now
    )
    assert outcome == "dispatch"
    assert action == Action.DELETE


def _policy_with_grace() -> Policy:
    return Policy(
        id="pol_grace",
        name="Grace Policy",
        version=1,
        status=PolicyStatus.ACTIVE,
        jurisdiction="EU_GDPR",
        data_classification=DataClassification.PII,
        scope=PolicyScope(data_types=["customer_profile"]),
        rules=[
            PolicyRule(
                id="rule_del",
                priority=100,
                condition=ConditionGroup(
                    all=[
                        FieldCondition(
                            field="status", operator=Operator.EQ, value="inactive"
                        )
                    ]
                ),
                action=Action.DELETE,
                grace_period="30d",
                notify_before="7d",
            )
        ],
    )


def test_runner_pending_grace_and_audit() -> None:
    policy = _policy_with_grace()
    store = InMemoryPolicyStore([policy])
    engine = PolicyEvaluatorEngine([policy])
    jobs = InMemoryEnforcementJobStore()
    audit = InMemoryAuditStore()
    dispatcher = LoggingActionDispatcher()
    records = InMemoryRecordSource(
        [
            RecordRef(
                record_id="cust_1",
                data_type="customer_profile",
                metadata={"status": "inactive"},
            )
        ]
    )
    runner = EnforcementRunner(
        policy_store=store,
        engine=engine,
        job_store=jobs,
        audit_store=audit,
        dispatcher=dispatcher,
        record_source=records,
    )
    job = jobs.create(policy_id=policy.id, trigger=JobTrigger.API)
    now = datetime(2026, 7, 22, tzinfo=timezone.utc)
    result = runner.run_job(job.id, now=now)

    assert result.status.value == "succeeded"
    assert result.progress.scanned == 1
    assert result.progress.pending_grace == 1
    assert result.progress.dispatched == 0
    assert dispatcher.dispatched == []

    events = [e.event_type for e in audit.list_logs(job_id=job.id)]
    assert AuditEventType.EVALUATION in events
    assert AuditEventType.PENDING_GRACE in events


def test_runner_dispatches_when_no_grace() -> None:
    policy = Policy(
        id="pol_now",
        name="Immediate",
        version=1,
        status=PolicyStatus.ACTIVE,
        jurisdiction="EU_GDPR",
        data_classification=DataClassification.PII,
        scope=PolicyScope(data_types=["customer_profile"]),
        rules=[
            PolicyRule(
                id="rule_del",
                priority=100,
                condition=ConditionGroup(
                    all=[
                        FieldCondition(
                            field="status", operator=Operator.EQ, value="inactive"
                        )
                    ]
                ),
                action=Action.DELETE,
            )
        ],
    )
    store = InMemoryPolicyStore([policy])
    engine = PolicyEvaluatorEngine([policy])
    jobs = InMemoryEnforcementJobStore()
    audit = InMemoryAuditStore()
    dispatcher = LoggingActionDispatcher()
    runner = EnforcementRunner(
        policy_store=store,
        engine=engine,
        job_store=jobs,
        audit_store=audit,
        dispatcher=dispatcher,
        record_source=InMemoryRecordSource(),
    )
    job = jobs.create(
        policy_id=policy.id,
        trigger=JobTrigger.API,
        inline_records=[
            RecordRef(
                record_id="cust_2",
                data_type="customer_profile",
                metadata={"status": "inactive"},
            )
        ],
    )
    result = runner.run_job(job.id)
    assert result.status.value == "succeeded"
    assert result.progress.dispatched == 1
    assert dispatcher.dispatched[0][0] == Action.DELETE
    assert any(
        e.event_type == AuditEventType.ACTION for e in audit.list_logs(job_id=job.id)
    )
