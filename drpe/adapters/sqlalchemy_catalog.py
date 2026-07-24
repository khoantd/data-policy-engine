"""SQLAlchemy-backed CatalogStore."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import delete, select
from sqlalchemy.orm import sessionmaker

from drpe.db.models import (
    PolicyProcessLinkRow,
    PolicySystemLinkRow,
    ProcessRow,
    SystemRow,
)
from drpe.models.process import ProcessRecord
from drpe.models.system import CatalogStatus, SystemRecord


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _system_from_row(row: SystemRow) -> SystemRecord:
    return SystemRecord(
        id=row.id,
        name=row.name,
        description=row.description,
        owner=row.owner,
        status=CatalogStatus(row.status),
        source_key=row.source_key,
        tags=list(row.tags or []),
        created_at=_as_utc(row.created_at),
        updated_at=_as_utc(row.updated_at),
    )


def _process_from_row(row: ProcessRow) -> ProcessRecord:
    return ProcessRecord(
        id=row.id,
        name=row.name,
        description=row.description,
        owner=row.owner,
        status=CatalogStatus(row.status),
        tags=list(row.tags or []),
        created_at=_as_utc(row.created_at),
        updated_at=_as_utc(row.updated_at),
    )


class SqlAlchemyCatalogStore:
    def __init__(self, session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
        self._session_factory = session_factory

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
        with self._session_factory() as session:
            session.add(
                SystemRow(
                    id=record.id,
                    name=record.name,
                    description=record.description,
                    owner=record.owner,
                    status=record.status.value,
                    source_key=record.source_key,
                    tags=list(record.tags),
                    created_at=record.created_at,
                    updated_at=record.updated_at,
                )
            )
            session.commit()
        return record

    def get_system(self, system_id: str) -> SystemRecord | None:
        with self._session_factory() as session:
            row = session.get(SystemRow, system_id)
            return _system_from_row(row) if row else None

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
        with self._session_factory() as session:
            row = session.get(SystemRow, system_id)
            if row is None:
                raise KeyError(f"system not found: {system_id}")
            if name is not None:
                row.name = name
            if description is not None:
                row.description = description
            if owner is not None:
                row.owner = owner
            if status is not None:
                row.status = status.value
            if source_key is not None:
                row.source_key = source_key
            if tags is not None:
                row.tags = list(tags)
            row.updated_at = datetime.now(timezone.utc)
            session.commit()
            session.refresh(row)
            return _system_from_row(row)

    def delete_system(self, system_id: str) -> bool:
        with self._session_factory() as session:
            row = session.get(SystemRow, system_id)
            if row is None:
                return False
            session.execute(
                delete(PolicySystemLinkRow).where(
                    PolicySystemLinkRow.system_id == system_id
                )
            )
            session.delete(row)
            session.commit()
            return True

    def list_systems(
        self,
        *,
        status: CatalogStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[SystemRecord]:
        stmt = select(SystemRow).order_by(SystemRow.created_at.desc())
        if status is not None:
            stmt = stmt.where(SystemRow.status == status.value)
        stmt = stmt.offset(offset).limit(limit)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_system_from_row(r) for r in rows]

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
        with self._session_factory() as session:
            session.add(
                ProcessRow(
                    id=record.id,
                    name=record.name,
                    description=record.description,
                    owner=record.owner,
                    status=record.status.value,
                    tags=list(record.tags),
                    created_at=record.created_at,
                    updated_at=record.updated_at,
                )
            )
            session.commit()
        return record

    def get_process(self, process_id: str) -> ProcessRecord | None:
        with self._session_factory() as session:
            row = session.get(ProcessRow, process_id)
            return _process_from_row(row) if row else None

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
        with self._session_factory() as session:
            row = session.get(ProcessRow, process_id)
            if row is None:
                raise KeyError(f"process not found: {process_id}")
            if name is not None:
                row.name = name
            if description is not None:
                row.description = description
            if owner is not None:
                row.owner = owner
            if status is not None:
                row.status = status.value
            if tags is not None:
                row.tags = list(tags)
            row.updated_at = datetime.now(timezone.utc)
            session.commit()
            session.refresh(row)
            return _process_from_row(row)

    def delete_process(self, process_id: str) -> bool:
        with self._session_factory() as session:
            row = session.get(ProcessRow, process_id)
            if row is None:
                return False
            session.execute(
                delete(PolicyProcessLinkRow).where(
                    PolicyProcessLinkRow.process_id == process_id
                )
            )
            session.delete(row)
            session.commit()
            return True

    def list_processes(
        self,
        *,
        status: CatalogStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[ProcessRecord]:
        stmt = select(ProcessRow).order_by(ProcessRow.created_at.desc())
        if status is not None:
            stmt = stmt.where(ProcessRow.status == status.value)
        stmt = stmt.offset(offset).limit(limit)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_process_from_row(r) for r in rows]

    def list_systems_for_policy(self, policy_id: str) -> list[SystemRecord]:
        stmt = (
            select(SystemRow)
            .join(
                PolicySystemLinkRow,
                PolicySystemLinkRow.system_id == SystemRow.id,
            )
            .where(PolicySystemLinkRow.policy_id == policy_id)
            .order_by(SystemRow.id)
        )
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_system_from_row(r) for r in rows]

    def list_processes_for_policy(self, policy_id: str) -> list[ProcessRecord]:
        stmt = (
            select(ProcessRow)
            .join(
                PolicyProcessLinkRow,
                PolicyProcessLinkRow.process_id == ProcessRow.id,
            )
            .where(PolicyProcessLinkRow.policy_id == policy_id)
            .order_by(ProcessRow.id)
        )
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_process_from_row(r) for r in rows]

    def list_policy_ids_for_system(self, system_id: str) -> list[str]:
        stmt = (
            select(PolicySystemLinkRow.policy_id)
            .where(PolicySystemLinkRow.system_id == system_id)
            .order_by(PolicySystemLinkRow.policy_id)
        )
        with self._session_factory() as session:
            return list(session.scalars(stmt).all())

    def list_policy_ids_for_process(self, process_id: str) -> list[str]:
        stmt = (
            select(PolicyProcessLinkRow.policy_id)
            .where(PolicyProcessLinkRow.process_id == process_id)
            .order_by(PolicyProcessLinkRow.policy_id)
        )
        with self._session_factory() as session:
            return list(session.scalars(stmt).all())

    def set_policy_systems(
        self, policy_id: str, system_ids: list[str]
    ) -> list[SystemRecord]:
        unique = list(dict.fromkeys(system_ids))
        with self._session_factory() as session:
            for sid in unique:
                if session.get(SystemRow, sid) is None:
                    raise KeyError(f"system not found: {sid}")
            session.execute(
                delete(PolicySystemLinkRow).where(
                    PolicySystemLinkRow.policy_id == policy_id
                )
            )
            for sid in unique:
                session.add(
                    PolicySystemLinkRow(policy_id=policy_id, system_id=sid)
                )
            session.commit()
            return self.list_systems_for_policy(policy_id)

    def set_policy_processes(
        self, policy_id: str, process_ids: list[str]
    ) -> list[ProcessRecord]:
        unique = list(dict.fromkeys(process_ids))
        with self._session_factory() as session:
            for pid in unique:
                if session.get(ProcessRow, pid) is None:
                    raise KeyError(f"process not found: {pid}")
            session.execute(
                delete(PolicyProcessLinkRow).where(
                    PolicyProcessLinkRow.policy_id == policy_id
                )
            )
            for pid in unique:
                session.add(
                    PolicyProcessLinkRow(policy_id=policy_id, process_id=pid)
                )
            session.commit()
            return self.list_processes_for_policy(policy_id)

    def set_system_policies(self, system_id: str, policy_ids: list[str]) -> list[str]:
        unique = list(dict.fromkeys(policy_ids))
        with self._session_factory() as session:
            if session.get(SystemRow, system_id) is None:
                raise KeyError(f"system not found: {system_id}")
            session.execute(
                delete(PolicySystemLinkRow).where(
                    PolicySystemLinkRow.system_id == system_id
                )
            )
            for pid in unique:
                session.add(
                    PolicySystemLinkRow(policy_id=pid, system_id=system_id)
                )
            session.commit()
            return sorted(unique)

    def set_process_policies(self, process_id: str, policy_ids: list[str]) -> list[str]:
        unique = list(dict.fromkeys(policy_ids))
        with self._session_factory() as session:
            if session.get(ProcessRow, process_id) is None:
                raise KeyError(f"process not found: {process_id}")
            session.execute(
                delete(PolicyProcessLinkRow).where(
                    PolicyProcessLinkRow.process_id == process_id
                )
            )
            for pid in unique:
                session.add(
                    PolicyProcessLinkRow(policy_id=pid, process_id=process_id)
                )
            session.commit()
            return sorted(unique)

    def clear_links_for_policy(self, policy_id: str) -> None:
        with self._session_factory() as session:
            session.execute(
                delete(PolicySystemLinkRow).where(
                    PolicySystemLinkRow.policy_id == policy_id
                )
            )
            session.execute(
                delete(PolicyProcessLinkRow).where(
                    PolicyProcessLinkRow.policy_id == policy_id
                )
            )
            session.commit()
