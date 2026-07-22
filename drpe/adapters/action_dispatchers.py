"""Action dispatcher adapters."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from drpe.models.enforcement import DispatchResult, RecordRef
from drpe.models.enums import Action
from drpe.models.policy import EvaluationResponse
from drpe.ports.webhook_sender import WebhookSender

logger = logging.getLogger(__name__)

ActionCallback = Callable[[Action, RecordRef, EvaluationResponse], None]


class LoggingActionDispatcher:
    """Logs actions and optionally invokes registered callbacks (tests)."""

    def __init__(self) -> None:
        self.dispatched: list[tuple[Action, str, str]] = []
        self._callbacks: dict[Action, list[ActionCallback]] = {}

    def on(self, action: Action, callback: ActionCallback) -> None:
        self._callbacks.setdefault(action, []).append(callback)

    def dispatch(
        self,
        action: Action,
        record: RecordRef,
        evaluation: EvaluationResponse,
    ) -> DispatchResult:
        logger.info(
            "dispatch action=%s record=%s evaluation=%s",
            action.value,
            record.record_id,
            evaluation.evaluation_id,
        )
        self.dispatched.append((action, record.record_id, evaluation.evaluation_id))
        for cb in self._callbacks.get(action, []):
            cb(action, record, evaluation)
        return DispatchResult(ok=True)


class HttpWebhookActionDispatcher:
    """Posts action events via WebhookSender."""

    def __init__(self, sender: WebhookSender) -> None:
        self._sender = sender

    def dispatch(
        self,
        action: Action,
        record: RecordRef,
        evaluation: EvaluationResponse,
    ) -> DispatchResult:
        payload: dict[str, Any] = {
            "action": action.value,
            "record_id": record.record_id,
            "data_type": record.data_type,
            "evaluation": evaluation.model_dump(mode="json"),
        }
        try:
            self._sender.send(f"enforcement.{action.value}", payload)
            return DispatchResult(ok=True)
        except Exception as exc:  # noqa: BLE001 — surface as failed dispatch
            logger.exception("webhook dispatch failed")
            return DispatchResult(ok=False, detail=str(exc))
