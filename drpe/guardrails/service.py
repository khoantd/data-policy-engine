"""Guardrails evaluation service (OpenGuardrails runtime wrapper)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from drpe.guardrails.availability import is_openguardrails_available
from drpe.guardrails.runtime_factory import build_runtime


class GuardrailsUnavailable(Exception):
    """openguardrails is not installed or the feature is disabled."""


class GuardrailsError(Exception):
    """Evaluation failed for a non-availability reason."""


@dataclass(frozen=True)
class GuardrailsStatus:
    available: bool
    enabled: bool
    ogr_version: str | None


def get_guardrails_status(*, enabled: bool = True) -> GuardrailsStatus:
    available = enabled and is_openguardrails_available()
    ogr_version: str | None = None
    if available:
        from openguardrails import OGR_VERSION

        ogr_version = OGR_VERSION
    return GuardrailsStatus(
        available=available,
        enabled=enabled,
        ogr_version=ogr_version,
    )


def _require_runtime(*, enabled: bool) -> None:
    if not enabled:
        raise GuardrailsUnavailable("Guardrails is disabled")
    if not is_openguardrails_available():
        raise GuardrailsUnavailable(
            "openguardrails is not installed. "
            'Install with: pip install "drpe[guardrails]"'
        )


def _to_guard_event(event: dict[str, Any]) -> Any:
    from openguardrails import GuardEvent, Provenance

    provenance_raw = event.get("provenance") or []
    provenance = [
        Provenance(
            source=p.get("source", "user"),
            trust=p.get("trust", "unverified"),
            ref=p.get("ref"),
            taint_tags=list(p.get("taint_tags") or []),
        )
        for p in provenance_raw
        if isinstance(p, dict)
    ]
    required = (
        "kind",
        "observation_point",
        "subject",
        "payload",
        "event_id",
        "guard_id",
        "timestamp",
    )
    missing = [k for k in required if k not in event]
    if missing:
        raise GuardrailsError(f"GuardEvent missing fields: {', '.join(missing)}")

    return GuardEvent(
        kind=str(event["kind"]),
        observation_point=str(event["observation_point"]),
        subject=dict(event["subject"] or {}),
        payload=dict(event["payload"] or {}),
        event_id=str(event["event_id"]),
        guard_id=str(event["guard_id"]),
        timestamp=str(event["timestamp"]),
        session_id=event.get("session_id"),
        llm_protocol=event.get("llm_protocol"),
        context_refs=list(event.get("context_refs") or []),
        provenance=provenance,
        ogr_version=str(event.get("ogr_version") or "0.1"),
    )


def evaluate_event(
    event: dict[str, Any],
    policy: dict[str, Any],
    *,
    enabled: bool = True,
) -> dict[str, Any]:
    """Evaluate a GuardEvent dict against an OGR policy; return Verdict as dict."""
    _require_runtime(enabled=enabled)
    try:
        runtime = build_runtime(policy)
        guard_event = _to_guard_event(event)
        verdict = runtime.evaluate(guard_event)
        return verdict.to_dict()
    except GuardrailsError:
        raise
    except Exception as exc:  # noqa: BLE001 — surface as service error
        raise GuardrailsError(f"Guardrails evaluation failed: {exc}") from exc
