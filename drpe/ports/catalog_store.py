"""Systems / processes catalog store port."""

from __future__ import annotations

from typing import Protocol

from drpe.models.process import ProcessRecord
from drpe.models.system import CatalogStatus, SystemRecord


class CatalogStore(Protocol):
    # --- Systems ---

    def create_system(
        self,
        *,
        name: str,
        description: str | None = None,
        owner: str | None = None,
        status: CatalogStatus = CatalogStatus.ACTIVE,
        source_key: str | None = None,
        tags: list[str] | None = None,
    ) -> SystemRecord: ...

    def get_system(self, system_id: str) -> SystemRecord | None: ...

    def update_system(
        self,
        system_id: str,
        *,
        name: str | None = None,
        description: str | None = None,
        owner: str | None = None,
        status: CatalogStatus | None = None,
        source_key: str | None = None,
        tags: list[str] | None = None,
    ) -> SystemRecord: ...

    def delete_system(self, system_id: str) -> bool: ...

    def list_systems(
        self,
        *,
        status: CatalogStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[SystemRecord]: ...

    # --- Processes ---

    def create_process(
        self,
        *,
        name: str,
        description: str | None = None,
        owner: str | None = None,
        status: CatalogStatus = CatalogStatus.ACTIVE,
        tags: list[str] | None = None,
    ) -> ProcessRecord: ...

    def get_process(self, process_id: str) -> ProcessRecord | None: ...

    def update_process(
        self,
        process_id: str,
        *,
        name: str | None = None,
        description: str | None = None,
        owner: str | None = None,
        status: CatalogStatus | None = None,
        tags: list[str] | None = None,
    ) -> ProcessRecord: ...

    def delete_process(self, process_id: str) -> bool: ...

    def list_processes(
        self,
        *,
        status: CatalogStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[ProcessRecord]: ...

    # --- Links ---

    def list_systems_for_policy(self, policy_id: str) -> list[SystemRecord]: ...

    def list_processes_for_policy(self, policy_id: str) -> list[ProcessRecord]: ...

    def list_policy_ids_for_system(self, system_id: str) -> list[str]: ...

    def list_policy_ids_for_process(self, process_id: str) -> list[str]: ...

    def set_policy_systems(self, policy_id: str, system_ids: list[str]) -> list[SystemRecord]: ...

    def set_policy_processes(
        self, policy_id: str, process_ids: list[str]
    ) -> list[ProcessRecord]: ...

    def set_system_policies(self, system_id: str, policy_ids: list[str]) -> list[str]: ...

    def set_process_policies(self, process_id: str, policy_ids: list[str]) -> list[str]: ...

    def clear_links_for_policy(self, policy_id: str) -> None: ...
