"""Guardrails availability soft-fail tests."""

from __future__ import annotations

from unittest.mock import patch

from drpe.guardrails.service import (
    GuardrailsUnavailable,
    evaluate_event,
    get_guardrails_status,
)


def test_status_unavailable_when_package_missing() -> None:
    with patch(
        "drpe.guardrails.service.is_openguardrails_available", return_value=False
    ):
        status = get_guardrails_status(enabled=True)
    assert status.available is False
    assert status.enabled is True
    assert status.ogr_version is None


def test_status_reports_ogr_version_when_available() -> None:
    status = get_guardrails_status(enabled=True)
    # Package is installed in the test env (dev extra).
    assert status.available is True
    assert status.ogr_version is not None


def test_evaluate_raises_when_unavailable() -> None:
    with patch(
        "drpe.guardrails.service.is_openguardrails_available", return_value=False
    ):
        try:
            evaluate_event(
                {
                    "kind": "tool_call",
                    "observation_point": "agent_hook",
                    "subject": {},
                    "payload": {},
                    "event_id": "e1",
                    "guard_id": "g1",
                    "timestamp": "2026-07-27T00:00:00Z",
                },
                {"composition": {"default": {"strategy": "deny-wins"}}},
            )
            raise AssertionError("expected GuardrailsUnavailable")
        except GuardrailsUnavailable as exc:
            assert "openguardrails" in str(exc).lower()


def test_evaluate_raises_when_disabled() -> None:
    try:
        evaluate_event(
            {
                "kind": "tool_call",
                "observation_point": "agent_hook",
                "subject": {},
                "payload": {},
                "event_id": "e1",
                "guard_id": "g1",
                "timestamp": "2026-07-27T00:00:00Z",
            },
            {"composition": {"default": {"strategy": "deny-wins"}}},
            enabled=False,
        )
        raise AssertionError("expected GuardrailsUnavailable")
    except GuardrailsUnavailable as exc:
        assert "disabled" in str(exc).lower()
