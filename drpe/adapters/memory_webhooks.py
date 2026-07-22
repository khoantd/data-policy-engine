"""In-memory WebhookStore adapter."""

from __future__ import annotations

import secrets
import threading
import uuid
from datetime import datetime, timezone

from drpe.models.webhook import WebhookRegistration


class InMemoryWebhookStore:
    def __init__(self) -> None:
        self._webhooks: dict[str, WebhookRegistration] = {}
        self._lock = threading.Lock()

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
        with self._lock:
            self._webhooks[registration.id] = registration
        return registration.model_copy(deep=True)

    def get(self, webhook_id: str) -> WebhookRegistration | None:
        with self._lock:
            wh = self._webhooks.get(webhook_id)
            return wh.model_copy(deep=True) if wh else None

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
        with self._lock:
            existing = self._webhooks.get(webhook_id)
            if existing is None:
                raise KeyError(f"webhook not found: {webhook_id}")
            updated = existing.model_copy(deep=True)
            if url is not None:
                updated.url = url
            if events is not None:
                updated.events = list(events)
            if secret is not None:
                updated.secret = secret
            if description is not None:
                updated.description = description
            if active is not None:
                updated.active = active
            updated.updated_at = datetime.now(timezone.utc)
            self._webhooks[webhook_id] = updated
            return updated.model_copy(deep=True)

    def delete(self, webhook_id: str) -> bool:
        with self._lock:
            return self._webhooks.pop(webhook_id, None) is not None

    def list_webhooks(
        self,
        *,
        active: bool | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[WebhookRegistration]:
        with self._lock:
            items = list(self._webhooks.values())
        if active is not None:
            items = [w for w in items if w.active is active]
        items.sort(key=lambda w: w.created_at, reverse=True)
        return [w.model_copy(deep=True) for w in items[offset : offset + limit]]
