"""SQLAlchemy-backed GuardrailPolicyStore."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from drpe.db.models import GuardrailPolicyRow
from drpe.models.guardrail_policy import GuardrailPolicy


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _row_to_policy(row: GuardrailPolicyRow) -> GuardrailPolicy:
    return GuardrailPolicy(
        id=row.id,
        name=row.name,
        policy=dict(row.policy or {}),
        created_at=_as_utc(row.created_at),
        updated_at=_as_utc(row.updated_at),
    )


class SqlAlchemyGuardrailPolicyStore:
    def __init__(self, session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
        self._session_factory = session_factory

    def create(self, *, name: str, policy: dict[str, Any]) -> GuardrailPolicy:
        now = datetime.now(timezone.utc)
        doc = GuardrailPolicy(
            id=f"ogr_{uuid.uuid4().hex[:16]}",
            name=name,
            policy=dict(policy),
            created_at=now,
            updated_at=now,
        )
        with self._session_factory() as session:
            session.add(
                GuardrailPolicyRow(
                    id=doc.id,
                    name=doc.name,
                    policy=doc.policy,
                    created_at=doc.created_at,
                    updated_at=doc.updated_at,
                )
            )
            session.commit()
        return doc

    def get(self, policy_id: str) -> GuardrailPolicy | None:
        with self._session_factory() as session:
            row = session.get(GuardrailPolicyRow, policy_id)
            return _row_to_policy(row) if row else None

    def update(
        self,
        policy_id: str,
        *,
        name: str | None = None,
        policy: dict[str, Any] | None = None,
    ) -> GuardrailPolicy:
        with self._session_factory() as session:
            row = session.get(GuardrailPolicyRow, policy_id)
            if row is None:
                raise KeyError(f"guardrail policy not found: {policy_id}")
            if name is not None:
                row.name = name
            if policy is not None:
                row.policy = dict(policy)
            row.updated_at = datetime.now(timezone.utc)
            session.commit()
            session.refresh(row)
            return _row_to_policy(row)

    def delete(self, policy_id: str) -> bool:
        with self._session_factory() as session:
            row = session.get(GuardrailPolicyRow, policy_id)
            if row is None:
                return False
            session.delete(row)
            session.commit()
            return True

    def list_policies(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
    ) -> list[GuardrailPolicy]:
        with self._session_factory() as session:
            stmt = (
                select(GuardrailPolicyRow)
                .order_by(GuardrailPolicyRow.created_at.desc())
                .offset(offset)
                .limit(limit)
            )
            rows = session.scalars(stmt).all()
            return [_row_to_policy(row) for row in rows]
