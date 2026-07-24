"""In-memory CatalogStore adapter."""

from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone

from drpe.models.process import ProcessRecord
from drpe.models.system import CatalogStatus, SystemRecord


class InMemoryCatalogStore:
    def __init__(self) -> None:
        self._systems: dict[str, SystemRecord] = {}
        self._processes: dict[str, ProcessRecord] = {}
        self._policy_systems: dict[str, set[str]] = {}
        self._policy_processes: dict[str, set[str]] = {}
        self._lock = threading.Lock()

    def create_system(
        self,
        *,
        name: str,
        description: str | None = None,
        owner: str | None = None,
        status: CatalogStatus = CatalogStatus.ACTIVE,
        source_key: str | None = None,
        tags: list[str] | None = None,
    ) -> SystemRecord:
        now = datetime.now(timezone.utc)
        record = SystemRecord(
            id=f"sys_{uuid.uuid4().hex[:16]}",
            name=name,
            description=description,
            owner=owner,
            status=status,
            source_key=source_key,
            tags=list(tags or []),
            created_at=now,
            updated_at=now,
        )
        with self._lock:
            self._systems[record.id] = record
        return record.model_copy(deep=True)

    def get_system(self, system_id: str) -> SystemRecord | None:
        with self._lock:
            row = self._systems.get(system_id)
            return row.model_copy(deep=True) if row else None

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
    ) -> SystemRecord:
        with self._lock:
            existing = self._systems.get(system_id)
            if existing is None:
                raise KeyError(f"system not found: {system_id}")
            updated = existing.model_copy(deep=True)
            if name is not None:
                updated.name = name
            if description is not None:
                updated.description = description
            if owner is not None:
                updated.owner = owner
            if status is not None:
                updated.status = status
            if source_key is not None:
                updated.source_key = source_key
            if tags is not None:
                updated.tags = list(tags)
            updated.updated_at = datetime.now(timezone.utc)
            self._systems[system_id] = updated
            return updated.model_copy(deep=True)

    def delete_system(self, system_id: str) -> bool:
        with self._lock:
            if system_id not in self._systems:
                return False
            del self._systems[system_id]
            for policy_id, ids in list(self._policy_systems.items()):
                ids.discard(system_id)
                if not ids:
                    del self._policy_systems[policy_id]
            return True

    def list_systems(
        self,
        *,
        status: CatalogStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[SystemRecord]:
        with self._lock:
            items = list(self._systems.values())
        if status is not None:
            items = [s for s in items if s.status == status]
        items.sort(key=lambda s: s.created_at, reverse=True)
        return [s.model_copy(deep=True) for s in items[offset : offset + limit]]

    def create_process(
        self,
        *,
        name: str,
        description: str | None = None,
        owner: str | None = None,
        status: CatalogStatus = CatalogStatus.ACTIVE,
        tags: list[str] | None = None,
    ) -> ProcessRecord:
        now = datetime.now(timezone.utc)
        record = ProcessRecord(
            id=f"proc_{uuid.uuid4().hex[:16]}",
            name=name,
            description=description,
            owner=owner,
            status=status,
            tags=list(tags or []),
            created_at=now,
            updated_at=now,
        )
        with self._lock:
            self._processes[record.id] = record
        return record.model_copy(deep=True)

    def get_process(self, process_id: str) -> ProcessRecord | None:
        with self._lock:
            row = self._processes.get(process_id)
            return row.model_copy(deep=True) if row else None

    def update_process(
        self,
        process_id: str,
        *,
        name: str | None = None,
        description: str | None = None,
        owner: str | None = None,
        status: CatalogStatus | None = None,
        tags: list[str] | None = None,
    ) -> ProcessRecord:
        with self._lock:
            existing = self._processes.get(process_id)
            if existing is None:
                raise KeyError(f"process not found: {process_id}")
            updated = existing.model_copy(deep=True)
            if name is not None:
                updated.name = name
            if description is not None:
                updated.description = description
            if owner is not None:
                updated.owner = owner
            if status is not None:
                updated.status = status
            if tags is not None:
                updated.tags = list(tags)
            updated.updated_at = datetime.now(timezone.utc)
            self._processes[process_id] = updated
            return updated.model_copy(deep=True)

    def delete_process(self, process_id: str) -> bool:
        with self._lock:
            if process_id not in self._processes:
                return False
            del self._processes[process_id]
            for policy_id, ids in list(self._policy_processes.items()):
                ids.discard(process_id)
                if not ids:
                    del self._policy_processes[policy_id]
            return True

    def list_processes(
        self,
        *,
        status: CatalogStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[ProcessRecord]:
        with self._lock:
            items = list(self._processes.values())
        if status is not None:
            items = [p for p in items if p.status == status]
        items.sort(key=lambda p: p.created_at, reverse=True)
        return [p.model_copy(deep=True) for p in items[offset : offset + limit]]

    def list_systems_for_policy(self, policy_id: str) -> list[SystemRecord]:
        with self._lock:
            ids = self._policy_systems.get(policy_id, set())
            return [
                self._systems[sid].model_copy(deep=True)
                for sid in sorted(ids)
                if sid in self._systems
            ]

    def list_processes_for_policy(self, policy_id: str) -> list[ProcessRecord]:
        with self._lock:
            ids = self._policy_processes.get(policy_id, set())
            return [
                self._processes[pid].model_copy(deep=True)
                for pid in sorted(ids)
                if pid in self._processes
            ]

    def list_policy_ids_for_system(self, system_id: str) -> list[str]:
        with self._lock:
            return sorted(
                pid for pid, ids in self._policy_systems.items() if system_id in ids
            )

    def list_policy_ids_for_process(self, process_id: str) -> list[str]:
        with self._lock:
            return sorted(
                pid for pid, ids in self._policy_processes.items() if process_id in ids
            )

    def set_policy_systems(
        self, policy_id: str, system_ids: list[str]
    ) -> list[SystemRecord]:
        with self._lock:
            missing = [sid for sid in system_ids if sid not in self._systems]
            if missing:
                raise KeyError(f"system not found: {missing[0]}")
            unique = list(dict.fromkeys(system_ids))
            if unique:
                self._policy_systems[policy_id] = set(unique)
            else:
                self._policy_systems.pop(policy_id, None)
            return [
                self._systems[sid].model_copy(deep=True) for sid in sorted(unique)
            ]

    def set_policy_processes(
        self, policy_id: str, process_ids: list[str]
    ) -> list[ProcessRecord]:
        with self._lock:
            missing = [pid for pid in process_ids if pid not in self._processes]
            if missing:
                raise KeyError(f"process not found: {missing[0]}")
            unique = list(dict.fromkeys(process_ids))
            if unique:
                self._policy_processes[policy_id] = set(unique)
            else:
                self._policy_processes.pop(policy_id, None)
            return [
                self._processes[pid].model_copy(deep=True) for pid in sorted(unique)
            ]

    def set_system_policies(self, system_id: str, policy_ids: list[str]) -> list[str]:
        with self._lock:
            if system_id not in self._systems:
                raise KeyError(f"system not found: {system_id}")
            unique = list(dict.fromkeys(policy_ids))
            for pid, ids in list(self._policy_systems.items()):
                ids.discard(system_id)
                if not ids:
                    del self._policy_systems[pid]
            for pid in unique:
                self._policy_systems.setdefault(pid, set()).add(system_id)
            return sorted(unique)

    def set_process_policies(self, process_id: str, policy_ids: list[str]) -> list[str]:
        with self._lock:
            if process_id not in self._processes:
                raise KeyError(f"process not found: {process_id}")
            unique = list(dict.fromkeys(policy_ids))
            for pid, ids in list(self._policy_processes.items()):
                ids.discard(process_id)
                if not ids:
                    del self._policy_processes[pid]
            for pid in unique:
                self._policy_processes.setdefault(pid, set()).add(process_id)
            return sorted(unique)

    def clear_links_for_policy(self, policy_id: str) -> None:
        with self._lock:
            self._policy_systems.pop(policy_id, None)
            self._policy_processes.pop(policy_id, None)
