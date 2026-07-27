"""In-memory GuardrailPolicyStore adapter."""

from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone
from typing import Any

from drpe.models.guardrail_policy import GuardrailPolicy


class InMemoryGuardrailPolicyStore:
    def __init__(self) -> None:
        self._policies: dict[str, GuardrailPolicy] = {}
        self._lock = threading.Lock()

    def create(self, *, name: str, policy: dict[str, Any]) -> GuardrailPolicy:
        now = datetime.now(timezone.utc)
        doc = GuardrailPolicy(
            id=f"ogr_{uuid.uuid4().hex[:16]}",
            name=name,
            policy=dict(policy),
            created_at=now,
            updated_at=now,
        )
        with self._lock:
            self._policies[doc.id] = doc
        return doc.model_copy(deep=True)

    def get(self, policy_id: str) -> GuardrailPolicy | None:
        with self._lock:
            doc = self._policies.get(policy_id)
            return doc.model_copy(deep=True) if doc else None

    def update(
        self,
        policy_id: str,
        *,
        name: str | None = None,
        policy: dict[str, Any] | None = None,
    ) -> GuardrailPolicy:
        with self._lock:
            existing = self._policies.get(policy_id)
            if existing is None:
                raise KeyError(f"guardrail policy not found: {policy_id}")
            updated = existing.model_copy(deep=True)
            if name is not None:
                updated.name = name
            if policy is not None:
                updated.policy = dict(policy)
            updated.updated_at = datetime.now(timezone.utc)
            self._policies[policy_id] = updated
            return updated.model_copy(deep=True)

    def delete(self, policy_id: str) -> bool:
        with self._lock:
            return self._policies.pop(policy_id, None) is not None

    def list_policies(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
    ) -> list[GuardrailPolicy]:
        with self._lock:
            items = list(self._policies.values())
        items.sort(key=lambda p: p.created_at, reverse=True)
        return [p.model_copy(deep=True) for p in items[offset : offset + limit]]
