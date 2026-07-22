"""Unit tests for DSAR collect / access / erasure workflow."""

from __future__ import annotations

import pytest

from drpe.adapters.action_dispatchers import LoggingActionDispatcher
from drpe.adapters.memory_audit import InMemoryAuditStore
from drpe.adapters.memory_dsar import InMemoryDsarStore
from drpe.adapters.memory_records import InMemoryRecordSource
from drpe.adapters.memory_store import InMemoryPolicyStore
from drpe.core.dsar import DsarRightsError, DsarService, matches_subject, collect_records
from drpe.models.audit import AuditEventType
from drpe.models.dsar import DsarRequestStatus, DsarRequestType
from drpe.models.enforcement import RecordRef
from drpe.models.enums import Action, DataClassification, Operator, PolicyStatus
from drpe.models.policy import (
    ConditionGroup,
    DsarConfig,
    FieldCondition,
    Policy,
    PolicyRule,
    PolicyScope,
)


def _policy(
    *,
    right_to_access: bool = True,
    right_to_erasure: bool = True,
    erasure_exceptions: list[str] | None = None,
    response_deadline: str | None = "30d",
    data_types: list[str] | None = None,
) -> Policy:
    return Policy(
        id="pol_gdpr_customer",
        name="GDPR Customer",
        version=1,
        status=PolicyStatus.ACTIVE,
        jurisdiction="EU_GDPR",
        data_classification=DataClassification.PII,
        scope=PolicyScope(data_types=data_types or ["customer_profile"]),
        rules=[
            PolicyRule(
                id="rule_1",
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
        dsar=DsarConfig(
            right_to_access=right_to_access,
            right_to_erasure=right_to_erasure,
            erasure_exceptions=erasure_exceptions
            or ["legal_obligation", "public_interest"],
            response_deadline=response_deadline,
        ),
    )


def _service(
    policy: Policy | None = None,
    records: list[RecordRef] | None = None,
) -> tuple[DsarService, LoggingActionDispatcher, InMemoryAuditStore]:
    store = InMemoryPolicyStore()
    p = policy or _policy()
    store.upsert(p)
    dispatcher = LoggingActionDispatcher()
    audit = InMemoryAuditStore()
    source = InMemoryRecordSource(records or [])
    svc = DsarService(
        policy_store=store,
        dsar_store=InMemoryDsarStore(),
        audit_store=audit,
        dispatcher=dispatcher,
        record_source=source,
    )
    return svc, dispatcher, audit


def test_matches_subject_by_record_id() -> None:
    rec = RecordRef(record_id="subj_1", data_type="customer_profile")
    assert matches_subject(rec, "subj_1")
    assert not matches_subject(rec, "other")


def test_matches_subject_by_metadata() -> None:
    rec = RecordRef(
        record_id="r1",
        data_type="customer_profile",
        metadata={"subject_id": "subj_1"},
    )
    assert matches_subject(rec, "subj_1")


def test_collect_records_inline_and_source() -> None:
    inline = [
        RecordRef(record_id="subj_1", data_type="customer_profile", metadata={}),
        RecordRef(record_id="other", data_type="customer_profile", metadata={}),
    ]
    source = InMemoryRecordSource(
        [
            RecordRef(
                record_id="r2",
                data_type="customer_profile",
                metadata={"subject_id": "subj_1"},
            )
        ]
    )
    collected = collect_records(
        subject_id="subj_1",
        inline=inline,
        record_source=source,
        data_types=["customer_profile"],
    )
    ids = {r.record_id for r in collected}
    assert ids == {"subj_1", "r2"}


def test_access_collects_records_and_audits() -> None:
    svc, _, audit = _service(
        records=[
            RecordRef(
                record_id="r1",
                data_type="customer_profile",
                metadata={"subject_id": "subj_1", "email": "a@b.c"},
            )
        ]
    )
    req = svc.submit_access(subject_id="subj_1", policy_id="pol_gdpr_customer")
    assert req.type == DsarRequestType.ACCESS
    assert req.status == DsarRequestStatus.COMPLETED
    assert len(req.result.records) == 1
    assert req.result.records[0].record_id == "r1"
    assert req.due_at is not None
    assert req.completed_at is not None
    logs = audit.list_logs(event_type=AuditEventType.DSAR_ACCESS)
    assert len(logs) == 1


def test_access_denied_when_right_disabled() -> None:
    svc, _, _ = _service(policy=_policy(right_to_access=False))
    with pytest.raises(DsarRightsError, match="right_to_access"):
        svc.submit_access(subject_id="subj_1", policy_id="pol_gdpr_customer")


def test_erasure_dispatches_delete() -> None:
    svc, dispatcher, audit = _service()
    inline = [
        RecordRef(
            record_id="subj_1",
            data_type="customer_profile",
            metadata={"status": "inactive"},
        )
    ]
    req = svc.submit_erasure(
        subject_id="subj_1",
        policy_id="pol_gdpr_customer",
        records=inline,
    )
    assert req.status == DsarRequestStatus.COMPLETED
    assert req.result.erased == ["subj_1"]
    assert dispatcher.dispatched[0][0] == Action.DELETE
    assert any(e.event_type == AuditEventType.DSAR_ERASURE for e in audit.list_logs())
    assert any(e.event_type == AuditEventType.ACTION for e in audit.list_logs())


def test_erasure_denied_by_exception() -> None:
    svc, dispatcher, _ = _service()
    inline = [
        RecordRef(
            record_id="subj_1",
            data_type="customer_profile",
            metadata={"legal_basis": "legal_obligation"},
        )
    ]
    req = svc.submit_erasure(
        subject_id="subj_1",
        policy_id="pol_gdpr_customer",
        records=inline,
    )
    assert req.status == DsarRequestStatus.DENIED
    assert len(req.result.denied) == 1
    assert req.result.denied[0].reason == "legal_obligation"
    assert dispatcher.dispatched == []


def test_erasure_partial_mix() -> None:
    svc, dispatcher, _ = _service()
    inline = [
        RecordRef(
            record_id="r_ok",
            data_type="customer_profile",
            metadata={"subject_id": "subj_1"},
        ),
        RecordRef(
            record_id="r_hold",
            data_type="customer_profile",
            metadata={"subject_id": "subj_1", "erasure_exception": "public_interest"},
        ),
    ]
    req = svc.submit_erasure(
        subject_id="subj_1",
        policy_id="pol_gdpr_customer",
        records=inline,
    )
    assert req.status == DsarRequestStatus.PARTIAL
    assert "r_ok" in req.result.erased
    assert any(d.record_id == "r_hold" for d in req.result.denied)
    assert len(dispatcher.dispatched) == 1


def test_erasure_rights_disabled() -> None:
    svc, _, _ = _service(policy=_policy(right_to_erasure=False))
    with pytest.raises(DsarRightsError, match="right_to_erasure"):
        svc.submit_erasure(subject_id="subj_1", policy_id="pol_gdpr_customer")


def test_unknown_policy() -> None:
    svc, _, _ = _service()
    with pytest.raises(KeyError, match="policy not found"):
        svc.submit_access(subject_id="subj_1", policy_id="missing")
