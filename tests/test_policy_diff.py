"""Unit tests for structural policy diff."""

from __future__ import annotations

from typing import Any

from drpe.core.policy_diff import diff_policies
from drpe.models.enums import Action, DataClassification, Operator, PolicyStatus
from drpe.models.policy import ConditionGroup, FieldCondition, Policy, PolicyRule, PolicyScope


def _make_policy(**overrides: object) -> Policy:
    base: dict[str, Any] = {
        "id": "pol_test",
        "name": "Test Policy",
        "version": 1,
        "status": PolicyStatus.ACTIVE,
        "jurisdiction": "EU_GDPR",
        "data_classification": DataClassification.PII,
        "scope": PolicyScope(data_types=["customer_profile"]),
        "rules": [
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
    }
    base.update(overrides)
    return Policy.model_validate(base)


def test_diff_replace_nested_rule_field() -> None:
    a = _make_policy()
    b = _make_policy(version=2)
    b = b.model_copy(
        update={
            "rules": [
                a.rules[0].model_copy(update={"action": Action.ARCHIVE}),
            ]
        }
    )
    changes = diff_policies(a, b)
    by_path = {c.path: c for c in changes}
    assert by_path["rules.0.action"].op == "replace"
    assert by_path["rules.0.action"].old == "delete"
    assert by_path["rules.0.action"].new == "archive"
    assert by_path["version"].op == "replace"


def test_diff_add_and_remove() -> None:
    a = {"name": "A", "tags": ["x"], "owner": "alice"}
    b = {"name": "A", "tags": ["x", "y"], "extra": 1}
    changes = {c.path: c for c in diff_policies(a, b)}
    assert changes["tags.1"].op == "add"
    assert changes["tags.1"].new == "y"
    assert changes["owner"].op == "remove"
    assert changes["owner"].old == "alice"
    assert changes["extra"].op == "add"
    assert changes["extra"].new == 1


def test_diff_identical_empty() -> None:
    p = _make_policy()
    assert diff_policies(p, p) == []
