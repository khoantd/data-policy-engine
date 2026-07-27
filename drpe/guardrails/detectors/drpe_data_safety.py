"""DRPE data-safety detector — PII / secret leakage heuristics for GuardEvents."""

from __future__ import annotations

import json
import re
import time
from typing import Any

# Soft import: module is only used when openguardrails is installed.
try:
    from openguardrails.detectors import Detector
    from openguardrails.models import Category, GuardEvent, Verdict
except ImportError:  # pragma: no cover - exercised via availability soft-fail
    Detector = object  # type: ignore[misc, assignment]
    Category = object  # type: ignore[misc, assignment]
    GuardEvent = Any  # type: ignore[misc, assignment]
    Verdict = Any  # type: ignore[misc, assignment]

_EMAIL_RE = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
)
_AWS_KEY_RE = re.compile(r"\bAKIA[0-9A-Z]{16}\b")
_GENERIC_SECRET_RE = re.compile(
    r"(?i)\b(api[_-]?key|secret[_-]?key|password|private[_-]?key)\b\s*[:=]\s*\S+"
)
_SECRET_PATH_MARKERS = (
    "/.ssh/",
    "/.aws/",
    "/.netrc",
    "/.env",
    ".env",
    "id_rsa",
    "id_ed25519",
    "credentials",
    "Keychains",
)


def _payload_text(ev: Any) -> str:
    try:
        return json.dumps(ev.payload, default=str)
    except (TypeError, ValueError):
        return str(ev.payload)


def _path_from_event(ev: Any) -> str:
    payload = ev.payload or {}
    if isinstance(payload.get("path"), str):
        return payload["path"]
    args = payload.get("arguments") or {}
    if isinstance(args, dict):
        for key in ("path", "file_path", "filename", "file"):
            val = args.get(key)
            if isinstance(val, str):
                return val
    return ""


class DrpeDataSafetyDetector(Detector):  # type: ignore[misc]
    """Flags likely PII exfil and secret-path access in agent tool I/O."""

    provider = "drpe.data_safety"
    handles = ("tool_call", "tool_result", "model_output", "model_input", "exec")

    def evaluate(self, ev: GuardEvent) -> Verdict:  # type: ignore[override]
        t0 = time.perf_counter()
        cats: list[Any] = []
        reasons: list[str] = []
        decision = "allow"

        text = _payload_text(ev)
        path = _path_from_event(ev)

        if any(marker in path for marker in _SECRET_PATH_MARKERS):
            decision = "require_approval"
            cats.append(Category("security.secret_leak", "security", 0.9))
            reasons.append(f"access to sensitive path '{path}'")

        if _AWS_KEY_RE.search(text) or _GENERIC_SECRET_RE.search(text):
            decision = "block" if decision != "block" else decision
            # prefer block over require_approval
            decision = "block"
            cats.append(Category("security.secret_leak", "security", 0.95))
            reasons.append("secret-like credential material in payload")

        emails = _EMAIL_RE.findall(text)
        if emails and ev.is_untrusted():
            if decision == "allow":
                decision = "require_approval"
            cats.append(Category("security.data_exfiltration", "security", 0.7))
            reasons.append(
                f"email-like PII in untrusted context ({len(emails)} match(es))"
            )
        elif emails and ev.kind in ("tool_result", "model_output"):
            if decision == "allow":
                decision = "require_approval"
            cats.append(Category("security.data_exfiltration", "security", 0.65))
            reasons.append(
                f"email-like PII in outbound payload ({len(emails)} match(es))"
            )

        verdict = Verdict(
            ev.event_id,
            ev.guard_id,
            self.provider,
            decision,
            categories=cats,
            reasons=reasons or ["no data-safety finding"],
        )
        verdict.latency_ms = round((time.perf_counter() - t0) * 1000, 3)
        return verdict
