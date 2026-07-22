"""In-memory policy store adapter."""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any

from drpe.models.classification_policy import ClassificationPolicy
from drpe.models.enums import PolicyStatus
from drpe.models.policy import Policy
from drpe.models.policy_version import PolicyVersionInfo
from drpe.models.stored_policy import StoredPolicy, as_retention


class InMemoryPolicyStore:
    """Thread-unsafe in-memory store suitable for v1 / tests."""

    def __init__(self, policies: list[StoredPolicy] | None = None) -> None:
        self._policies: dict[str, StoredPolicy] = {}
        self._versions: dict[str, dict[int, tuple[StoredPolicy, datetime]]] = {}
        for policy in policies or []:
            stored = deepcopy(policy)
            self._policies[policy.id] = stored
            self._record_version(stored)

    def list_policies(self, *, status: str | None = None) -> list[StoredPolicy]:
        items = list(self._policies.values())
        if status is not None:
            items = [p for p in items if p.status.value == status]
        return sorted(items, key=lambda p: p.id)

    def get(self, policy_id: str) -> StoredPolicy | None:
        policy = self._policies.get(policy_id)
        return deepcopy(policy) if policy else None

    def upsert(self, policy: StoredPolicy) -> StoredPolicy:
        existing = self._policies.get(policy.id)
        stored = deepcopy(policy)
        if existing is not None and policy.version == existing.version:
            stored = stored.model_copy(update={"version": existing.version + 1})
        previous_version = existing.version if existing is not None else None
        self._policies[policy.id] = stored
        if previous_version != stored.version:
            self._record_version(stored)
        return deepcopy(stored)

    def deprecate(self, policy_id: str) -> StoredPolicy | None:
        return self.set_status(policy_id, PolicyStatus.DEPRECATED)

    def set_status(self, policy_id: str, status: PolicyStatus) -> StoredPolicy | None:
        policy = self._policies.get(policy_id)
        if policy is None:
            return None
        if policy.status == status:
            return deepcopy(policy)
        updated = policy.model_copy(
            update={"status": status, "version": policy.version},
        )
        return self.upsert(updated)

    def load_many(self, policies: list[StoredPolicy]) -> None:
        for policy in policies:
            self.upsert(policy)

    def list_versions(self, policy_id: str) -> list[PolicyVersionInfo]:
        history = self._versions.get(policy_id, {})
        infos: list[PolicyVersionInfo] = []
        for version in sorted(history):
            snap, created_at = history[version]
            infos.append(
                PolicyVersionInfo(
                    policy_id=policy_id,
                    version=version,
                    created_at=created_at,
                    name=snap.name,
                    status=snap.status.value
                    if hasattr(snap.status, "value")
                    else str(snap.status),
                )
            )
        return infos

    def get_version(self, policy_id: str, version: int) -> StoredPolicy | None:
        history = self._versions.get(policy_id)
        if history is None or version not in history:
            return None
        return deepcopy(history[version][0])

    def activate_version(self, policy_id: str, version: int) -> StoredPolicy | None:
        current = self._policies.get(policy_id)
        snapshot = self.get_version(policy_id, version)
        if current is None or snapshot is None:
            return None
        restored = snapshot.model_copy(update={"version": current.version})
        return self.upsert(restored)

    def list_retention_policies(self, *, status: str | None = None) -> list[Policy]:
        result: list[Policy] = []
        for item in self.list_policies(status=status):
            retention = as_retention(item)
            if retention is not None:
                result.append(retention)
        return result

    def list_classification_policies(
        self, *, status: str | None = None
    ) -> list[ClassificationPolicy]:
        return [
            item
            for item in self.list_policies(status=status)
            if isinstance(item, ClassificationPolicy)
        ]

    def _record_version(self, policy: StoredPolicy) -> None:
        bucket = self._versions.setdefault(policy.id, {})
        if policy.version in bucket:
            return
        bucket[policy.version] = (deepcopy(policy), datetime.now(timezone.utc))
