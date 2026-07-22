"""Tests for InMemoryPolicyStore version history."""

from __future__ import annotations

from typing import Any

from drpe.adapters.memory_store import InMemoryPolicyStore
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


def test_upsert_records_versions() -> None:
    store = InMemoryPolicyStore()
    store.upsert(_make_policy(version=1, name="Original"))
    store.upsert(_make_policy(version=1, name="Updated"))

    versions = store.list_versions("pol_test")
    assert [v.version for v in versions] == [1, 2]
    assert versions[0].name == "Original"
    assert versions[1].name == "Updated"


def test_get_version_and_activate_creates_new_head() -> None:
    store = InMemoryPolicyStore()
    store.upsert(_make_policy(version=1, name="Original"))
    store.upsert(_make_policy(version=1, name="Updated"))

    restored = store.activate_version("pol_test", 1)
    assert restored is not None
    assert restored.name == "Original"
    assert restored.version == 3

    assert [v.version for v in store.list_versions("pol_test")] == [1, 2, 3]
    assert store.get_version("pol_test", 1) is not None
    assert store.get_version("pol_test", 2) is not None
    assert store.activate_version("missing", 1) is None
    assert store.activate_version("pol_test", 99) is None


def test_set_status_bumps_version_and_records_history() -> None:
    store = InMemoryPolicyStore()
    store.upsert(_make_policy(version=1, status=PolicyStatus.DRAFT))

    published = store.set_status("pol_test", PolicyStatus.ACTIVE)
    assert published is not None
    assert published.status == PolicyStatus.ACTIVE
    assert published.version == 2

    versions = store.list_versions("pol_test")
    assert [v.version for v in versions] == [1, 2]
    assert versions[1].status == "active"


def test_set_status_noop_when_unchanged() -> None:
    store = InMemoryPolicyStore()
    store.upsert(_make_policy(version=1, status=PolicyStatus.ACTIVE))

    same = store.set_status("pol_test", PolicyStatus.ACTIVE)
    assert same is not None
    assert same.version == 1
    assert len(store.list_versions("pol_test")) == 1


def test_set_status_missing_policy() -> None:
    store = InMemoryPolicyStore()
    assert store.set_status("missing", PolicyStatus.ACTIVE) is None
