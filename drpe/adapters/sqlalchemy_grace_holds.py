"""SQLAlchemy-backed GraceHoldStore."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from drpe.db.models import GraceHoldRow
from drpe.models.grace_hold import (
    GraceHold,
    GraceHoldCreate,
    GraceHoldStatus,
)


def _row_to_hold(row: GraceHoldRow) -> GraceHold:
    return GraceHold(
        id=row.id,
        policy_id=row.policy_id,
        rule_id=row.rule_id,
        record_id=row.record_id,
        data_type=row.data_type,
        action=row.action,
        grace_period_ends=row.grace_period_ends,
        notify_at=row.notify_at,
        status=GraceHoldStatus(row.status),
        created_at=row.created_at,
        updated_at=row.updated_at,
        closed_at=row.closed_at,
        requester=row.requester,
        source_job_id=row.source_job_id,
        evaluation_id=row.evaluation_id,
    )


def _hold_to_columns(hold: GraceHold) -> dict[str, Any]:
    return {
        "id": hold.id,
        "policy_id": hold.policy_id,
        "rule_id": hold.rule_id,
        "record_id": hold.record_id,
        "data_type": hold.data_type,
        "action": hold.action,
        "grace_period_ends": hold.grace_period_ends,
        "notify_at": hold.notify_at,
        "status": hold.status.value,
        "created_at": hold.created_at,
        "updated_at": hold.updated_at,
        "closed_at": hold.closed_at,
        "requester": hold.requester,
        "source_job_id": hold.source_job_id,
        "evaluation_id": hold.evaluation_id,
    }


class SqlAlchemyGraceHoldStore:
    def __init__(self, session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
        self._session_factory = session_factory

    def create(self, entry: GraceHoldCreate) -> GraceHold:
        now = datetime.now(timezone.utc)
        hold = GraceHold(
            id=f"gh_{uuid.uuid4().hex[:16]}",
            policy_id=entry.policy_id,
            rule_id=entry.rule_id,
            record_id=entry.record_id,
            data_type=entry.data_type,
            action=entry.action,
            grace_period_ends=entry.grace_period_ends,
            notify_at=entry.notify_at,
            status=GraceHoldStatus.ACTIVE,
            created_at=now,
            updated_at=now,
            requester=entry.requester,
            source_job_id=entry.source_job_id,
            evaluation_id=entry.evaluation_id,
        )
        with self._session_factory() as session:
            session.add(GraceHoldRow(**_hold_to_columns(hold)))
            session.commit()
        return hold

    def get(self, hold_id: str) -> GraceHold | None:
        with self._session_factory() as session:
            row = session.get(GraceHoldRow, hold_id)
            return _row_to_hold(row) if row else None

    def get_by_key(
        self, *, policy_id: str, rule_id: str, record_id: str
    ) -> GraceHold | None:
        stmt = select(GraceHoldRow).where(
            GraceHoldRow.policy_id == policy_id,
            GraceHoldRow.rule_id == rule_id,
            GraceHoldRow.record_id == record_id,
        )
        with self._session_factory() as session:
            row = session.scalars(stmt).first()
            return _row_to_hold(row) if row else None

    def update(self, hold: GraceHold) -> GraceHold:
        updated = hold.model_copy(deep=True)
        updated.updated_at = datetime.now(timezone.utc)
        cols = _hold_to_columns(updated)
        with self._session_factory() as session:
            row = session.get(GraceHoldRow, hold.id)
            if row is None:
                raise KeyError(f"grace hold not found: {hold.id}")
            for key, value in cols.items():
                if key == "id":
                    continue
                setattr(row, key, value)
            session.commit()
        return updated

    def delete(self, hold_id: str) -> None:
        with self._session_factory() as session:
            row = session.get(GraceHoldRow, hold_id)
            if row is not None:
                session.delete(row)
                session.commit()

    def list_holds(
        self,
        *,
        status: GraceHoldStatus | None = None,
        policy_id: str | None = None,
        record_id: str | None = None,
        rule_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[GraceHold]:
        stmt = select(GraceHoldRow).order_by(GraceHoldRow.created_at.desc())
        if status is not None:
            stmt = stmt.where(GraceHoldRow.status == status.value)
        if policy_id is not None:
            stmt = stmt.where(GraceHoldRow.policy_id == policy_id)
        if record_id is not None:
            stmt = stmt.where(GraceHoldRow.record_id == record_id)
        if rule_id is not None:
            stmt = stmt.where(GraceHoldRow.rule_id == rule_id)
        stmt = stmt.offset(offset).limit(limit)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_row_to_hold(r) for r in rows]
