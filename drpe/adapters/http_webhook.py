"""HTTP webhook sender (no-op when URL unset)."""

from __future__ import annotations

import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)


class HttpWebhookSender:
    def __init__(
        self,
        url: str | None = None,
        *,
        timeout: float = 10.0,
        client: httpx.Client | None = None,
    ) -> None:
        self._url = url
        self._timeout = timeout
        self._client = client
        self._owns_client = client is None

    def send(self, event: str, payload: dict[str, Any]) -> None:
        if not self._url:
            logger.debug("webhook skipped (no URL): event=%s", event)
            return
        body = {"event": event, "payload": payload}
        client = self._client or httpx.Client(timeout=self._timeout)
        try:
            resp = client.post(self._url, json=body)
            resp.raise_for_status()
        finally:
            if self._owns_client and self._client is None:
                client.close()


class NoOpWebhookSender:
    def send(self, event: str, payload: dict[str, Any]) -> None:
        del event, payload
