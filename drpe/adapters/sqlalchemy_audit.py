"""SQLAlchemy-backed AuditStore (append-only)."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from drpe.db.models import AuditLogRow
from drpe.models.audit import AuditEntry, AuditEntryCreate, AuditEventType


def _row_to_entry(row: AuditLogRow) -> AuditEntry:
    return AuditEntry(
        id=row.id,
        created_at=row.created_at,
        event_type=AuditEventType(row.event_type),
        policy_id=row.policy_id,
        rule_id=row.rule_id,
        record_id=row.record_id,
        action=row.action,
        payload=row.payload or {},
        job_id=row.job_id,
        evaluation_id=row.evaluation_id,
        requester=row.requester,
    )


class SqlAlchemyAuditStore:
    def __init__(self, session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
        self._session_factory = session_factory

    def append(self, entry: AuditEntryCreate) -> AuditEntry:
        row = AuditLogRow(
            id=f"aud_{uuid.uuid4().hex[:16]}",
            created_at=datetime.now(timezone.utc),
            event_type=entry.event_type.value,
            policy_id=entry.policy_id,
            rule_id=entry.rule_id,
            record_id=entry.record_id,
            action=entry.action,
            payload=dict(entry.payload),
            job_id=entry.job_id,
            evaluation_id=entry.evaluation_id,
            requester=entry.requester,
        )
        with self._session_factory() as session:
            session.add(row)
            session.commit()
            session.refresh(row)
            return _row_to_entry(row)

    def list_logs(
        self,
        *,
        policy_id: str | None = None,
        record_id: str | None = None,
        job_id: str | None = None,
        event_type: AuditEventType | None = None,
        requester: str | None = None,
        since: datetime | None = None,
        until: datetime | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[AuditEntry]:
        stmt = select(AuditLogRow).order_by(AuditLogRow.created_at.desc())
        if policy_id is not None:
            stmt = stmt.where(AuditLogRow.policy_id == policy_id)
        if record_id is not None:
            stmt = stmt.where(AuditLogRow.record_id == record_id)
        if job_id is not None:
            stmt = stmt.where(AuditLogRow.job_id == job_id)
        if event_type is not None:
            stmt = stmt.where(AuditLogRow.event_type == event_type.value)
        if requester is not None:
            stmt = stmt.where(AuditLogRow.requester == requester)
        if since is not None:
            stmt = stmt.where(AuditLogRow.created_at >= since)
        if until is not None:
            stmt = stmt.where(AuditLogRow.created_at <= until)
        stmt = stmt.offset(offset).limit(limit)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_row_to_entry(r) for r in rows]
