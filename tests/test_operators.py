"""Unit tests for duration parsing and operators."""

from datetime import datetime, timedelta, timezone

import pytest

from drpe.core.duration import parse_duration
from drpe.core.operators import evaluate_operator
from drpe.models.enums import Operator


def test_parse_duration_days() -> None:
    assert parse_duration("730d") == timedelta(days=730)
    assert parse_duration("30d") == timedelta(days=30)


def test_parse_duration_hours_minutes() -> None:
    assert parse_duration("12h") == timedelta(hours=12)
    assert parse_duration("15m") == timedelta(minutes=15)


def test_parse_duration_weeks_and_years() -> None:
    assert parse_duration("52w") == timedelta(days=364)
    assert parse_duration("7y") == timedelta(days=2555)


def test_parse_duration_invalid() -> None:
    with pytest.raises(ValueError):
        parse_duration("two weeks")


def test_older_than_operator() -> None:
    now = datetime(2026, 7, 22, tzinfo=timezone.utc)
    assert evaluate_operator(
        Operator.OLDER_THAN,
        "2023-01-01T00:00:00Z",
        "730d",
        now=now,
    )
    assert not evaluate_operator(
        Operator.OLDER_THAN,
        "2026-01-01T00:00:00Z",
        "730d",
        now=now,
    )
    assert evaluate_operator(
        Operator.OLDER_THAN,
        "2018-01-01T00:00:00Z",
        "7y",
        now=now,
    )


def test_contains_list_and_string() -> None:
    assert evaluate_operator(Operator.CONTAINS, ["a", "litigation"], "litigation")
    assert evaluate_operator(Operator.CONTAINS, "hello world", "world")
    assert not evaluate_operator(Operator.CONTAINS, ["a"], "b")
