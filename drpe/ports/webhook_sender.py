"""Webhook sender port."""

from __future__ import annotations

from typing import Any, Protocol


class WebhookSender(Protocol):
    def send(self, event: str, payload: dict[str, Any]) -> None: ...
