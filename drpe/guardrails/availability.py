"""Detect whether the optional openguardrails package is installed."""

from __future__ import annotations


def is_openguardrails_available() -> bool:
    try:
        import openguardrails  # noqa: F401

        return True
    except ImportError:
        return False
