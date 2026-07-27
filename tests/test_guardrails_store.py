"""Guardrail policy store adapter tests."""

from __future__ import annotations

import pytest

from drpe.adapters.memory_guardrails import InMemoryGuardrailPolicyStore
from drpe.api.routes_guardrails import seed_default_guardrail_policy


def test_memory_store_crud() -> None:
    store = InMemoryGuardrailPolicyStore()
    created = store.create(name="a", policy={"version": "0.1"})
    assert created.id.startswith("ogr_")
    assert store.get(created.id) is not None

    updated = store.update(created.id, name="b")
    assert updated.name == "b"

    listed = store.list_policies()
    assert len(listed) == 1

    assert store.delete(created.id) is True
    assert store.get(created.id) is None


def test_memory_store_update_missing_raises() -> None:
    store = InMemoryGuardrailPolicyStore()
    with pytest.raises(KeyError):
        store.update("missing", name="x")


def test_seed_default_when_empty() -> None:
    store = InMemoryGuardrailPolicyStore()
    seeded = seed_default_guardrail_policy(
        store, "config/guardrails/default.policy.json"
    )
    assert seeded is not None
    assert seeded.name == "default"
    assert "config_rules" in seeded.policy

    # Second seed is a no-op
    again = seed_default_guardrail_policy(
        store, "config/guardrails/default.policy.json"
    )
    assert again is None
    assert len(store.list_policies()) == 1
