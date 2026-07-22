"""Parse DSL duration strings like ``730d``, ``7y``, ``52w``, ``12h``, ``15m``."""

from __future__ import annotations

import re
from datetime import timedelta

_DURATION_RE = re.compile(r"^(\d+)([dhmwy])$", re.IGNORECASE)

_DAYS_PER_YEAR = 365
_DAYS_PER_WEEK = 7


def parse_duration(value: str) -> timedelta:
    """Convert a duration string to ``timedelta``.

    Supported units: ``m`` (minutes), ``h`` (hours), ``d`` (days), ``w`` (weeks),
    ``y`` (years, 365 days each).
    """
    if not isinstance(value, str):
        raise ValueError(f"duration must be a string, got {type(value).__name__}")
    match = _DURATION_RE.match(value.strip())
    if not match:
        raise ValueError(
            f"invalid duration '{value}'; expected format like '730d', '7y', '52w', '12h', '15m'"
        )
    amount = int(match.group(1))
    unit = match.group(2).lower()
    if unit == "y":
        return timedelta(days=amount * _DAYS_PER_YEAR)
    if unit == "w":
        return timedelta(days=amount * _DAYS_PER_WEEK)
    if unit == "d":
        return timedelta(days=amount)
    if unit == "h":
        return timedelta(hours=amount)
    return timedelta(minutes=amount)
