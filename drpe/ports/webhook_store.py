"""Webhook registration store port."""

from __future__ import annotations

from typing import Protocol

from drpe.models.webhook import WebhookRegistration


class WebhookStore(Protocol):
    def create(
        self,
        *,
        url: str,
        events: list[str],
        secret: str | None = None,
        description: str | None = None,
        active: bool = True,
    ) -> WebhookRegistration: ...

    def get(self, webhook_id: str) -> WebhookRegistration | None: ...

    def update(
        self,
        webhook_id: str,
        *,
        url: str | None = None,
        events: list[str] | None = None,
        secret: str | None = None,
        description: str | None = None,
        active: bool | None = None,
    ) -> WebhookRegistration: ...

    def delete(self, webhook_id: str) -> bool: ...

    def list_webhooks(
        self,
        *,
        active: bool | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[WebhookRegistration]: ...
