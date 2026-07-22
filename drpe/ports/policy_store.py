"""Policy store port (hexagonal interface)."""

from __future__ import annotations

from typing import Protocol

from drpe.models.classification_policy import ClassificationPolicy
from drpe.models.enums import PolicyStatus
from drpe.models.policy import Policy
from drpe.models.policy_version import PolicyVersionInfo
from drpe.models.stored_policy import StoredPolicy


class PolicyStore(Protocol):
    def list_policies(self, *, status: str | None = None) -> list[StoredPolicy]: ...

    def get(self, policy_id: str) -> StoredPolicy | None: ...

    def upsert(self, policy: StoredPolicy) -> StoredPolicy: ...

    def deprecate(self, policy_id: str) -> StoredPolicy | None: ...

    def set_status(self, policy_id: str, status: PolicyStatus) -> StoredPolicy | None: ...

    def list_versions(self, policy_id: str) -> list[PolicyVersionInfo]: ...

    def get_version(self, policy_id: str, version: int) -> StoredPolicy | None: ...

    def activate_version(self, policy_id: str, version: int) -> StoredPolicy | None: ...

    def list_retention_policies(self, *, status: str | None = None) -> list[Policy]: ...

    def list_classification_policies(
        self, *, status: str | None = None
    ) -> list[ClassificationPolicy]: ...
