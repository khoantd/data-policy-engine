"""Operator implementations for policy rule conditions."""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any, Callable

from drpe.core.duration import parse_duration
from drpe.models.enums import Operator


def _parse_datetime(value: Any) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        dt = value
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value, tz=timezone.utc)
    if isinstance(value, str):
        text = value.strip()
        if text.endswith("Z"):
            text = text[:-1] + "+00:00"
        try:
            dt = datetime.fromisoformat(text)
        except ValueError:
            return None
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    return None


def _now(now: datetime | None = None) -> datetime:
    return now if now is not None else datetime.now(timezone.utc)


def op_eq(field_value: Any, expected: Any, **_: Any) -> bool:
    return field_value == expected


def op_neq(field_value: Any, expected: Any, **_: Any) -> bool:
    return field_value != expected


def op_gt(field_value: Any, expected: Any, **_: Any) -> bool:
    if field_value is None:
        return False
    left = _parse_datetime(field_value)
    right = _parse_datetime(expected)
    if left is not None and right is not None:
        return left > right
    return field_value > expected


def op_gte(field_value: Any, expected: Any, **_: Any) -> bool:
    if field_value is None:
        return False
    left = _parse_datetime(field_value)
    right = _parse_datetime(expected)
    if left is not None and right is not None:
        return left >= right
    return field_value >= expected


def op_lt(field_value: Any, expected: Any, **_: Any) -> bool:
    if field_value is None:
        return False
    left = _parse_datetime(field_value)
    right = _parse_datetime(expected)
    if left is not None and right is not None:
        return left < right
    return field_value < expected


def op_lte(field_value: Any, expected: Any, **_: Any) -> bool:
    if field_value is None:
        return False
    left = _parse_datetime(field_value)
    right = _parse_datetime(expected)
    if left is not None and right is not None:
        return left <= right
    return field_value <= expected


def op_in(field_value: Any, expected: Any, **_: Any) -> bool:
    if not isinstance(expected, list):
        return False
    return field_value in expected


def op_not_in(field_value: Any, expected: Any, **_: Any) -> bool:
    if not isinstance(expected, list):
        return False
    return field_value not in expected


def op_contains(field_value: Any, expected: Any, **_: Any) -> bool:
    if field_value is None:
        return False
    if isinstance(field_value, str):
        return str(expected) in field_value
    if isinstance(field_value, (list, tuple, set)):
        return expected in field_value
    return False


def op_older_than(
    field_value: Any, expected: Any, *, now: datetime | None = None, **_: Any
) -> bool:
    dt = _parse_datetime(field_value)
    if dt is None:
        return False
    duration = parse_duration(str(expected))
    return dt <= _now(now) - duration


def op_newer_than(
    field_value: Any, expected: Any, *, now: datetime | None = None, **_: Any
) -> bool:
    dt = _parse_datetime(field_value)
    if dt is None:
        return False
    duration = parse_duration(str(expected))
    return dt > _now(now) - duration


def op_is_null(field_value: Any, expected: Any = None, **_: Any) -> bool:
    want_null = True if expected is None else bool(expected)
    is_null = field_value is None
    return is_null if want_null else not is_null


def op_regex(field_value: Any, expected: Any, **_: Any) -> bool:
    if field_value is None:
        return False
    return re.search(str(expected), str(field_value)) is not None


OPERATORS: dict[Operator, Callable[..., bool]] = {
    Operator.EQ: op_eq,
    Operator.NEQ: op_neq,
    Operator.GT: op_gt,
    Operator.GTE: op_gte,
    Operator.LT: op_lt,
    Operator.LTE: op_lte,
    Operator.IN: op_in,
    Operator.NOT_IN: op_not_in,
    Operator.CONTAINS: op_contains,
    Operator.OLDER_THAN: op_older_than,
    Operator.NEWER_THAN: op_newer_than,
    Operator.IS_NULL: op_is_null,
    Operator.REGEX: op_regex,
}


def evaluate_operator(
    operator: Operator,
    field_value: Any,
    expected: Any,
    *,
    now: datetime | None = None,
) -> bool:
    fn = OPERATORS[operator]
    return fn(field_value, expected, now=now)
