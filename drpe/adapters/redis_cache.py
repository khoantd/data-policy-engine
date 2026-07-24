"""Redis cache-aside helpers for PolicyStore."""

from __future__ import annotations

import json
import logging
from typing import Any, Protocol

from drpe.models.enums import PolicyStatus
from drpe.models.policy_version import PolicyVersionInfo
from drpe.models.serialization import cache_json_to_stored_policy, stored_policy_to_cache_json
from drpe.models.stored_policy import StoredPolicy

logger = logging.getLogger(__name__)


class RedisClient(Protocol):
    def get(self, name: str) -> str | bytes | None: ...

    def set(self, name: str, value: str, ex: int | None = None) -> Any: ...

    def delete(self, *names: str) -> Any: ...

    def mget(self, keys: list[str], *args: Any) -> list[Any]: ...

    def incr(self, name: str, amount: int = 1) -> int: ...

    def ping(self) -> Any: ...


def create_redis_client(
    url: str,
    *,
    max_connections: int = 20,
    socket_connect_timeout: float = 5,
    socket_timeout: float = 5,
    health_check_interval: int = 30,
) -> Any:
    """Create a sync Redis client from a URL with a capped connection pool.

    ``max_connections`` limits sockets per process so API workers + Celery
    cannot exhaust Redis ``maxclients`` under load.
    """
    import redis

    return redis.Redis.from_url(
        url,
        decode_responses=True,
        max_connections=max_connections,
        socket_connect_timeout=socket_connect_timeout,
        socket_timeout=socket_timeout,
        health_check_interval=health_check_interval,
    )


class RedisPolicyCache:
    """Low-level Redis key helpers for policy caching."""

    def __init__(
        self,
        client: RedisClient,
        *,
        ttl_seconds: int = 300,
        key_prefix: str = "drpe",
    ) -> None:
        self._client = client
        self._ttl = ttl_seconds
        self._prefix = key_prefix.rstrip(":")

    def policy_key(self, policy_id: str) -> str:
        return f"{self._prefix}:policy:{policy_id}"

    def ids_key(self) -> str:
        return f"{self._prefix}:policies:ids"

    def gen_key(self) -> str:
        return f"{self._prefix}:policies:gen"

    def check_connection(self) -> None:
        self._client.ping()

    def get_generation(self) -> int:
        try:
            raw = self._client.get(self.gen_key())
            if raw is None:
                return 0
            return int(raw)
        except Exception:
            logger.warning("redis get_generation failed", exc_info=True)
            return 0

    def bump_generation(self) -> int | None:
        try:
            return int(self._client.incr(self.gen_key()))
        except Exception:
            logger.warning("redis bump_generation failed", exc_info=True)
            return None

    def get_policy(self, policy_id: str) -> StoredPolicy | None:
        try:
            raw = self._client.get(self.policy_key(policy_id))
            if raw is None:
                return None
            return cache_json_to_stored_policy(json.loads(raw))
        except Exception:
            logger.warning("redis get_policy failed", exc_info=True)
            return None

    def set_policy(self, policy: StoredPolicy) -> None:
        try:
            self._client.set(
                self.policy_key(policy.id),
                json.dumps(stored_policy_to_cache_json(policy)),
                ex=self._ttl,
            )
        except Exception:
            logger.warning("redis set_policy failed", exc_info=True)

    def get_policy_ids(self) -> list[str] | None:
        try:
            raw = self._client.get(self.ids_key())
            if raw is None:
                return None
            data = json.loads(raw)
            if not isinstance(data, list):
                return None
            return [str(x) for x in data]
        except Exception:
            logger.warning("redis get_policy_ids failed", exc_info=True)
            return None

    def set_policy_ids(self, ids: list[str]) -> None:
        try:
            self._client.set(self.ids_key(), json.dumps(ids), ex=self._ttl)
        except Exception:
            logger.warning("redis set_policy_ids failed", exc_info=True)

    def invalidate_policy(self, policy_id: str) -> None:
        try:
            self._client.delete(self.policy_key(policy_id), self.ids_key())
        except Exception:
            logger.warning("redis invalidate_policy failed", exc_info=True)

    def mget_policies(self, ids: list[str]) -> list[StoredPolicy | None]:
        if not ids:
            return []
        try:
            keys = [self.policy_key(i) for i in ids]
            raws = self._client.mget(keys)
            result: list[StoredPolicy | None] = []
            for raw in raws:
                if raw is None:
                    result.append(None)
                else:
                    result.append(cache_json_to_stored_policy(json.loads(raw)))
            return result
        except Exception:
            logger.warning("redis mget_policies failed", exc_info=True)
            return [None] * len(ids)


class CachingPolicyStore:
    """Cache-aside PolicyStore wrapper backed by Redis."""

    def __init__(self, inner: Any, cache: RedisPolicyCache) -> None:
        self.inner = inner
        self.cache = cache

    def list_policies(self, *, status: str | None = None) -> list[StoredPolicy]:
        if status is not None:
            policies = self.inner.list_policies(status=status)
            for policy in policies:
                self.cache.set_policy(policy)
            return policies

        ids = self.cache.get_policy_ids()
        if ids is not None:
            cached = self.cache.mget_policies(ids)
            if all(p is not None for p in cached):
                return sorted(cached, key=lambda p: p.id)  # type: ignore[union-attr]

        policies = self.inner.list_policies()
        for policy in policies:
            self.cache.set_policy(policy)
        self.cache.set_policy_ids([p.id for p in policies])
        return policies

    def get(self, policy_id: str) -> StoredPolicy | None:
        cached = self.cache.get_policy(policy_id)
        if cached is not None:
            return cached
        policy = self.inner.get(policy_id)
        if policy is not None:
            self.cache.set_policy(policy)
        return policy

    def upsert(self, policy: StoredPolicy) -> StoredPolicy:
        stored = self.inner.upsert(policy)
        self.cache.invalidate_policy(stored.id)
        self.cache.bump_generation()
        return stored

    def deprecate(self, policy_id: str) -> StoredPolicy | None:
        result = self.inner.deprecate(policy_id)
        if result is not None:
            self.cache.invalidate_policy(policy_id)
            self.cache.bump_generation()
        return result

    def set_status(self, policy_id: str, status: PolicyStatus) -> StoredPolicy | None:
        result = self.inner.set_status(policy_id, status)
        if result is not None:
            self.cache.invalidate_policy(policy_id)
            self.cache.bump_generation()
        return result

    def load_many(self, policies: list[StoredPolicy]) -> None:
        if hasattr(self.inner, "load_many"):
            self.inner.load_many(policies)
        else:
            for policy in policies:
                self.inner.upsert(policy)
        for policy in policies:
            self.cache.invalidate_policy(policy.id)
        self.cache.bump_generation()

    def list_versions(self, policy_id: str) -> list[PolicyVersionInfo]:
        return self.inner.list_versions(policy_id)

    def get_version(self, policy_id: str, version: int) -> StoredPolicy | None:
        return self.inner.get_version(policy_id, version)

    def activate_version(self, policy_id: str, version: int) -> StoredPolicy | None:
        result = self.inner.activate_version(policy_id, version)
        if result is not None:
            self.cache.invalidate_policy(policy_id)
            self.cache.bump_generation()
        return result

    def list_retention_policies(self, *, status: str | None = None) -> list[Any]:
        return self.inner.list_retention_policies(status=status)

    def list_classification_policies(self, *, status: str | None = None) -> list[Any]:
        return self.inner.list_classification_policies(status=status)
