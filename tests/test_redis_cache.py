"""Tests for CachingPolicyStore (fakeredis)."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import fakeredis
import pytest

from drpe.adapters.memory_store import InMemoryPolicyStore
from drpe.adapters.redis_cache import CachingPolicyStore, RedisPolicyCache
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


@pytest.fixture
def redis_client() -> fakeredis.FakeRedis:
    return fakeredis.FakeRedis(decode_responses=True)


@pytest.fixture
def cache(redis_client: fakeredis.FakeRedis) -> RedisPolicyCache:
    return RedisPolicyCache(redis_client, ttl_seconds=300, key_prefix="drpe")


@pytest.fixture
def cached_store(
    redis_client: fakeredis.FakeRedis, cache: RedisPolicyCache
) -> CachingPolicyStore:
    inner = InMemoryPolicyStore()
    return CachingPolicyStore(inner, cache)


def test_get_miss_then_hit(cached_store: CachingPolicyStore, cache: RedisPolicyCache) -> None:
    policy = _make_policy()
    cached_store.inner.upsert(policy)

    assert cache.get_policy("pol_test") is None
    fetched = cached_store.get("pol_test")
    assert fetched is not None
    assert fetched.name == "Test Policy"
    assert cache.get_policy("pol_test") is not None

    # Second get should hit Redis (bypass inner by clearing it)
    cached_store.inner._policies.clear()
    cached = cached_store.get("pol_test")
    assert cached is not None
    assert cached.id == "pol_test"


def test_list_populates_and_hits_cache(
    cached_store: CachingPolicyStore, cache: RedisPolicyCache
) -> None:
    p1 = _make_policy(id="pol_a", name="A")
    p2 = _make_policy(id="pol_b", name="B")
    cached_store.inner.upsert(p1)
    cached_store.inner.upsert(p2)

    listed = cached_store.list_policies()
    assert [p.id for p in listed] == ["pol_a", "pol_b"]
    assert cache.get_policy_ids() == ["pol_a", "pol_b"]

    cached_store.inner._policies.clear()
    listed_again = cached_store.list_policies()
    assert [p.id for p in listed_again] == ["pol_a", "pol_b"]


def test_list_with_status_hits_inner(
    cached_store: CachingPolicyStore, cache: RedisPolicyCache
) -> None:
    active = _make_policy(id="pol_active", status=PolicyStatus.ACTIVE)
    draft = _make_policy(id="pol_draft", status=PolicyStatus.DRAFT)
    cached_store.upsert(active)
    cached_store.upsert(draft)

    drafts = cached_store.list_policies(status="draft")
    assert len(drafts) == 1
    assert drafts[0].id == "pol_draft"
    # Status filter does not rely on the full id-list cache path as source of truth
    assert all(p.status == PolicyStatus.DRAFT for p in drafts)


def test_upsert_invalidates_and_bumps_gen(
    cached_store: CachingPolicyStore, cache: RedisPolicyCache
) -> None:
    policy = _make_policy()
    cached_store.upsert(policy)
    assert cache.get_generation() == 1
    assert cache.get_policy("pol_test") is None  # invalidated after write
    assert cache.get_policy_ids() is None

    # Warm cache
    cached_store.get("pol_test")
    assert cache.get_policy("pol_test") is not None

    updated = _make_policy(name="Updated", version=1)
    stored = cached_store.upsert(updated)
    assert stored.version == 2
    assert cache.get_generation() == 2
    assert cache.get_policy("pol_test") is None


def test_deprecate_invalidates_and_bumps_gen(
    cached_store: CachingPolicyStore, cache: RedisPolicyCache
) -> None:
    cached_store.upsert(_make_policy())
    cached_store.get("pol_test")
    gen_before = cache.get_generation()

    result = cached_store.deprecate("pol_test")
    assert result is not None
    assert result.status == PolicyStatus.DEPRECATED
    assert cache.get_generation() == gen_before + 1
    assert cache.get_policy("pol_test") is None


def test_get_degrades_when_redis_fails() -> None:
    inner = InMemoryPolicyStore([_make_policy()])
    bad_redis = MagicMock()
    bad_redis.get.side_effect = ConnectionError("down")
    bad_redis.set.side_effect = ConnectionError("down")
    cache = RedisPolicyCache(bad_redis, ttl_seconds=60, key_prefix="drpe")
    store = CachingPolicyStore(inner, cache)

    fetched = store.get("pol_test")
    assert fetched is not None
    assert fetched.id == "pol_test"


def test_upsert_succeeds_when_invalidate_fails() -> None:
    inner = InMemoryPolicyStore()
    bad_redis = MagicMock()
    bad_redis.delete.side_effect = ConnectionError("down")
    bad_redis.incr.side_effect = ConnectionError("down")
    cache = RedisPolicyCache(bad_redis, ttl_seconds=60, key_prefix="drpe")
    store = CachingPolicyStore(inner, cache)

    stored = store.upsert(_make_policy())
    assert stored.id == "pol_test"
    assert inner.get("pol_test") is not None


def test_check_connection_ok(cache: RedisPolicyCache) -> None:
    cache.check_connection()


def test_engine_reload_on_generation_change(
    cached_store: CachingPolicyStore, cache: RedisPolicyCache
) -> None:
    from drpe.core.evaluator import PolicyEvaluatorEngine
    from drpe.models.policy import EvaluationRequest

    cached_store.upsert(_make_policy(status=PolicyStatus.ACTIVE))
    engine = PolicyEvaluatorEngine()

    seen: list[int] = []

    def sync() -> None:
        gen = cache.get_generation()
        if gen != engine._cache_gen:  # type: ignore[attr-defined]
            engine.policies = cached_store.list_policies()
            engine._cache_gen = gen  # type: ignore[attr-defined]
            seen.append(gen)

    engine._cache_gen = None  # type: ignore[attr-defined]
    engine.on_before_evaluate = sync

    req = EvaluationRequest(
        data_type="customer_profile",
        record_id="r1",
        metadata={"status": "inactive"},
        jurisdiction="EU_GDPR",
    )
    engine.evaluate(req)
    assert len(engine.policies) == 1
    assert seen == [1]

    # Simulate another worker writing
    cached_store.upsert(_make_policy(name="v2", version=1))
    engine.evaluate(req)
    assert engine.policies[0].name == "v2"
    assert seen == [1, 2]
