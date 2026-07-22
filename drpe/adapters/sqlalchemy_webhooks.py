"""SQLAlchemy-backed WebhookStore."""

from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from drpe.db.models import WebhookRow
from drpe.models.webhook import WebhookRegistration


def _as_utc(value: datetime) -> datetime:
    """SQLite may return naive datetimes; normalize to UTC-aware."""
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _row_to_registration(row: WebhookRow) -> WebhookRegistration:
    return WebhookRegistration(
        id=row.id,
        url=row.url,
        events=list(row.events or []),
        secret=row.secret,
        description=row.description,
        active=row.active,
        created_at=_as_utc(row.created_at),
        updated_at=_as_utc(row.updated_at),
    )


def _registration_to_columns(registration: WebhookRegistration) -> dict[str, Any]:
    return {
        "id": registration.id,
        "url": registration.url,
        "events": list(registration.events),
        "secret": registration.secret,
        "description": registration.description,
        "active": registration.active,
        "created_at": registration.created_at,
        "updated_at": registration.updated_at,
    }


class SqlAlchemyWebhookStore:
    def __init__(self, session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
        self._session_factory = session_factory

    def create(
        self,
        *,
        url: str,
        events: list[str],
        secret: str | None = None,
        description: str | None = None,
        active: bool = True,
    ) -> WebhookRegistration:
        now = datetime.now(timezone.utc)
        registration = WebhookRegistration(
            id=f"wh_{uuid.uuid4().hex[:16]}",
            url=url,
            events=list(events),
            secret=secret or f"whsec_{secrets.token_urlsafe(24)}",
            description=description,
            active=active,
            created_at=now,
            updated_at=now,
        )
        with self._session_factory() as session:
            session.add(WebhookRow(**_registration_to_columns(registration)))
            session.commit()
        return registration

    def get(self, webhook_id: str) -> WebhookRegistration | None:
        with self._session_factory() as session:
            row = session.get(WebhookRow, webhook_id)
            return _row_to_registration(row) if row else None

    def update(
        self,
        webhook_id: str,
        *,
        url: str | None = None,
        events: list[str] | None = None,
        secret: str | None = None,
        description: str | None = None,
        active: bool | None = None,
    ) -> WebhookRegistration:
        with self._session_factory() as session:
            row = session.get(WebhookRow, webhook_id)
            if row is None:
                raise KeyError(f"webhook not found: {webhook_id}")
            if url is not None:
                row.url = url
            if events is not None:
                row.events = list(events)
            if secret is not None:
                row.secret = secret
            if description is not None:
                row.description = description
            if active is not None:
                row.active = active
            row.updated_at = datetime.now(timezone.utc)
            session.commit()
            session.refresh(row)
            return _row_to_registration(row)

    def delete(self, webhook_id: str) -> bool:
        with self._session_factory() as session:
            row = session.get(WebhookRow, webhook_id)
            if row is None:
                return False
            session.delete(row)
            session.commit()
            return True

    def list_webhooks(
        self,
        *,
        active: bool | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[WebhookRegistration]:
        stmt = select(WebhookRow).order_by(WebhookRow.created_at.desc())
        if active is not None:
            stmt = stmt.where(WebhookRow.active.is_(active))
        stmt = stmt.offset(offset).limit(limit)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_row_to_registration(r) for r in rows]
