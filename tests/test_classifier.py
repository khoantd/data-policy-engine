"""Tests for hybrid classification engine."""

from __future__ import annotations

from drpe.core.classifier import classify, detect_entities
from drpe.models.classification_policy import (
    ClassificationEntity,
    ClassificationPolicy,
    ClassificationRequest,
    ClassificationRule,
    EntityDetection,
)
from drpe.models.enums import (
    ClassificationAction,
    DataClassification,
    Operator,
    PolicyStatus,
    Sensitivity,
)
from drpe.models.policy import ConditionGroup, FieldCondition, PolicyScope


def _sample_policy() -> ClassificationPolicy:
    return ClassificationPolicy(
        id="pol_cls_gdpr",
        name="GDPR PII Detection",
        version=1,
        status=PolicyStatus.ACTIVE,
        jurisdiction="EU_GDPR",
        scope=PolicyScope(data_types=["customer_profile"]),
        entities=[
            ClassificationEntity(
                id="ent_email",
                label="Email address",
                classification=DataClassification.PII,
                sensitivity=Sensitivity.MEDIUM,
                detection=EntityDetection(field_names=["email"]),
            ),
            ClassificationEntity(
                id="ent_ssn",
                label="National ID",
                classification=DataClassification.SPII,
                sensitivity=Sensitivity.CRITICAL,
                detection=EntityDetection(field_names=["ssn"]),
            ),
        ],
        rules=[
            ClassificationRule(
                id="rule_spii_flag",
                priority=10,
                condition=ConditionGroup(
                    all=[
                        FieldCondition(
                            field="_max_classification",
                            operator=Operator.EQ,
                            value="SPII",
                        )
                    ]
                ),
                action=ClassificationAction.FLAG,
                handling="require_encryption",
            ),
            ClassificationRule(
                id="rule_pii_review",
                priority=20,
                condition=ConditionGroup(
                    all=[
                        FieldCondition(
                            field="_has_pii",
                            operator=Operator.EQ,
                            value=True,
                        )
                    ]
                ),
                action=ClassificationAction.REVIEW,
            ),
        ],
    )


def _vn_policy() -> ClassificationPolicy:
    return ClassificationPolicy(
        id="pol_cls_vn",
        name="VN Sensitive Data Detection",
        version=2,
        status=PolicyStatus.ACTIVE,
        jurisdiction="VN_PDPD",
        scope=PolicyScope(data_types=["customer_profile", "support_ticket"]),
        entities=[
            ClassificationEntity(
                id="ent_national_id",
                label="National ID",
                classification=DataClassification.SPII,
                sensitivity=Sensitivity.CRITICAL,
                detection=EntityDetection(field_names=["cmnd", "cccd", "national_id"]),
            )
        ],
        rules=[
            ClassificationRule(
                id="rule_national_id_detection",
                priority=1,
                condition=ConditionGroup(
                    all=[
                        FieldCondition(
                            field="_has_spii",
                            operator=Operator.EQ,
                            value=True,
                        )
                    ]
                ),
                action=ClassificationAction.FLAG,
                handling="require_encryption",
            )
        ],
    )


def test_detect_entities_by_field_name() -> None:
    policy = _sample_policy()
    hits = detect_entities(
        policy,
        {"email": "user@example.com", "name": "Ada"},
    )
    assert len(hits) == 1
    assert hits[0].entity_id == "ent_email"
    assert hits[0].detector == "field_name"


def test_detect_entities_regex() -> None:
    policy = ClassificationPolicy(
        id="pol_regex",
        name="Regex",
        status=PolicyStatus.ACTIVE,
        jurisdiction="GLOBAL",
        scope=PolicyScope(data_types=["note"]),
        entities=[
            ClassificationEntity(
                id="ent_email",
                label="Email",
                classification=DataClassification.PII,
                detection=EntityDetection(
                    regex=r"[^@\s]+@[^@\s]+\.[^@\s]+",
                ),
            )
        ],
        rules=[
            ClassificationRule(
                id="rule_flag",
                priority=1,
                condition=ConditionGroup(
                    all=[
                        FieldCondition(
                            field="_entity_count",
                            operator=Operator.GT,
                            value=0,
                        )
                    ]
                ),
                action=ClassificationAction.FLAG,
            )
        ],
    )
    hits = detect_entities(policy, {"note": "Contact me at ada@example.com"})
    assert len(hits) == 1
    assert hits[0].detector == "regex"


def test_classify_spii_flags_with_handling() -> None:
    policy = _sample_policy()
    response = classify(
        ClassificationRequest(
            data_type="customer_profile",
            record_id="cust_1",
            metadata={"email": "a@b.com", "ssn": "123-45-6789"},
            jurisdiction="EU_GDPR",
        ),
        [policy],
        dry_run=True,
    )
    assert len(response.detected_entities) == 2
    assert response.result.action == ClassificationAction.FLAG
    assert response.result.handling == "require_encryption"
    assert response.result.max_classification == DataClassification.SPII


def test_classify_jurisdiction_filter() -> None:
    policy = _sample_policy()
    response = classify(
        ClassificationRequest(
            data_type="customer_profile",
            record_id="cust_2",
            metadata={"email": "a@b.com"},
            jurisdiction="VN_PDPD",
        ),
        [policy],
        dry_run=True,
    )
    assert response.detected_entities == []
    assert response.result.action == ClassificationAction.ALLOW
    assert response.diagnostics.applicable_policy_count == 0
    assert response.diagnostics.out_of_scope_reason == "none"


def test_classify_scope_excludes_data_type() -> None:
    policy = _sample_policy()
    response = classify(
        ClassificationRequest(
            data_type="billing_invoice",
            record_id="inv_1",
            metadata={"email": "a@b.com"},
            jurisdiction="EU_GDPR",
        ),
        [policy],
        dry_run=True,
    )
    assert response.detected_entities == []
    assert response.result.action == ClassificationAction.ALLOW
    assert response.diagnostics.applicable_policy_count == 0
    assert response.diagnostics.out_of_scope_reason == "none"


def test_classify_selected_policy_reports_data_type_scope_mismatch() -> None:
    policy = _vn_policy()
    response = classify(
        ClassificationRequest(
            data_type="employee_record",
            record_id="emp_1",
            metadata={"cmnd": "001234567890"},
            jurisdiction="VN_PDPD",
            policy_id="pol_cls_vn",
        ),
        [policy],
        dry_run=True,
    )
    assert response.detected_entities == []
    assert response.result.action == ClassificationAction.ALLOW
    assert response.diagnostics.applicable_policy_count == 0
    assert response.diagnostics.selected_policy_applied is False
    assert response.diagnostics.out_of_scope_reason == "data_type"
    assert response.diagnostics.policy_scope_summary is not None
    assert response.diagnostics.policy_scope_summary.data_types == [
        "customer_profile",
        "support_ticket",
    ]


def test_classify_selected_policy_detects_cmnd_when_in_scope() -> None:
    policy = _vn_policy()
    response = classify(
        ClassificationRequest(
            data_type="customer_profile",
            record_id="cust_vn_1",
            metadata={"cmnd": "001234567890"},
            jurisdiction="VN_PDPD",
            policy_id="pol_cls_vn",
        ),
        [policy],
        dry_run=True,
    )
    assert len(response.detected_entities) == 1
    assert response.detected_entities[0].field == "cmnd"
    assert response.result.action == ClassificationAction.FLAG
    assert response.result.handling == "require_encryption"
    assert response.diagnostics.applicable_policy_count == 1
    assert response.diagnostics.selected_policy_applied is True
    assert response.diagnostics.out_of_scope_reason == "none"
