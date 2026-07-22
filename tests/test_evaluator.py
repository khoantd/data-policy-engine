"""Tests for the policy evaluator engine."""

from datetime import datetime, timezone
from pathlib import Path

from drpe.core.evaluator import evaluate
from drpe.dsl import parse_file
from drpe.models.enums import Action
from drpe.models.policy import EvaluationRequest

CONFIG = Path(__file__).resolve().parents[1] / "config" / "gdpr_customer.yaml"
NOW = datetime(2026, 7, 22, 10, 30, 0, tzinfo=timezone.utc)


def _policy():
    return parse_file(CONFIG)


def test_inactive_delete_after_730d() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="customer_profile",
            source="crm_system",
            record_id="cust_123",
            metadata={
                "status": "inactive",
                "last_activity_at": "2023-01-01T00:00:00Z",
                "legal_hold": False,
            },
            jurisdiction="EU_GDPR",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.should_delete
    assert result.result.matched_rule == "rule_inactive_delete"
    assert result.result.grace_period_ends == "2026-08-21T10:30:00Z"
    assert result.result.notify_at == "2026-08-14T10:30:00Z"
    assert result.result.confidence == "definitive"


def test_legal_hold_overrides_delete() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="customer_profile",
            source="crm_system",
            record_id="cust_hold",
            metadata={
                "status": "inactive",
                "last_activity_at": "2023-01-01T00:00:00Z",
                "legal_hold": True,
            },
            jurisdiction="EU_GDPR",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.is_retained
    assert result.result.matched_rule == "rule_legal_hold"
    assert result.result.retain_until == "legal_hold_released"
    # delete also matched → appears as conflict
    assert any(c.rule_id == "rule_inactive_delete" for c in result.conflicting_policies)


def test_litigation_tag_triggers_retain() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="customer_profile",
            source="crm_system",
            record_id="cust_lit",
            metadata={
                "status": "inactive",
                "last_activity_at": "2023-01-01T00:00:00Z",
                "tags": ["litigation"],
            },
            jurisdiction="EU_GDPR",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.is_retained
    assert result.result.matched_rule == "rule_legal_hold"


def test_jurisdiction_mismatch_skips_policy() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="customer_profile",
            source="crm_system",
            record_id="cust_vn",
            metadata={
                "status": "inactive",
                "last_activity_at": "2023-01-01T00:00:00Z",
            },
            jurisdiction="VN_PDPD",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.is_retained
    assert result.result.matched_policy is None
    assert result.result.confidence == "none"


def test_out_of_scope_data_type_defaults_to_retain() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="invoice",
            record_id="inv_1",
            metadata={"status": "inactive", "last_activity_at": "2023-01-01T00:00:00Z"},
            jurisdiction="EU_GDPR",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.is_retained
    assert result.result.matched_policy is None


def test_excluded_data_type_skipped() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="anonymized_analytics",
            source="crm_system",
            record_id="a1",
            metadata={"status": "inactive", "last_activity_at": "2023-01-01T00:00:00Z"},
            jurisdiction="EU_GDPR",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.result.matched_policy is None


def test_active_archive_rule() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="customer_profile",
            source="crm_system",
            record_id="cust_old",
            metadata={
                "status": "active",
                "created_at": "2018-01-01T00:00:00Z",
            },
            jurisdiction="EU_GDPR",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.should_archive
    assert result.result.matched_rule == "rule_active_archive"
    assert result.result.archive_target == "cold_storage"


def test_recent_inactive_does_not_match_delete() -> None:
    result = evaluate(
        EvaluationRequest(
            data_type="customer_profile",
            source="crm_system",
            record_id="cust_recent",
            metadata={
                "status": "inactive",
                "last_activity_at": "2026-01-01T00:00:00Z",
            },
            jurisdiction="EU_GDPR",
        ),
        [_policy()],
        now=NOW,
    )
    assert result.is_retained
    assert result.result.matched_policy is None
    assert result.result.action == Action.RETAIN
