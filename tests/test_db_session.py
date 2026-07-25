"""Unit tests for SQLAlchemy engine helpers (Supabase / PgBouncer-safe)."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.exc import OperationalError

from drpe.db.session import create_db_engine, normalize_database_url


def test_normalize_postgresql_url_to_psycopg() -> None:
    assert (
        normalize_database_url("postgresql://user:pass@host:5432/db")
        == "postgresql+psycopg://user:pass@host:5432/db"
    )


def test_normalize_postgres_scheme() -> None:
    assert (
        normalize_database_url("postgres://user:pass@host/db")
        == "postgresql+psycopg://user:pass@host/db"
    )


def test_normalize_already_psycopg() -> None:
    url = "postgresql+psycopg://user:pass@host/db"
    assert normalize_database_url(url) == url


def test_normalize_adds_sslmode_for_supabase_hosts() -> None:
    url = normalize_database_url(
        "postgresql://postgres.ref:pw@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    )
    assert "sslmode=require" in url
    assert url.startswith("postgresql+psycopg://")


def test_normalize_preserves_existing_sslmode() -> None:
    url = normalize_database_url(
        "postgresql://u:p@db.ref.supabase.co:5432/postgres?sslmode=verify-full"
    )
    assert "sslmode=verify-full" in url
    assert url.count("sslmode=") == 1


def test_create_db_engine_disables_prepared_statements_and_recycles() -> None:
    with patch("drpe.db.session.create_engine") as mock_create:
        mock_create.return_value = MagicMock(name="engine")
        create_db_engine(
            "postgresql://postgres.ref:pw@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
        )

    assert mock_create.call_count == 1
    args, kwargs = mock_create.call_args
    assert args[0].startswith("postgresql+psycopg://")
    assert "sslmode=require" in args[0]
    assert kwargs["pool_pre_ping"] is True
    assert kwargs["pool_recycle"] == 300
    assert kwargs["connect_args"]["prepare_threshold"] is None
    assert kwargs["connect_args"]["connect_timeout"] == 10


def test_bootstrap_retries_transient_operational_error() -> None:
    import drpe.api.app as app_module

    store = MagicMock()
    engine = MagicMock()
    classifier = MagicMock()
    path = MagicMock()
    path.is_dir.return_value = False
    lost = OperationalError("the connection is lost", None, None)
    # Two failures, then empty list for existence check + empty for engine load.
    store.list_policies.side_effect = [lost, lost, [], []]

    with patch("drpe.api.app.time.sleep") as sleep:
        app_module._bootstrap_store(
            store,
            engine,
            classifier,
            path,
            force_seed=False,
        )

    assert store.list_policies.call_count == 4
    assert sleep.call_count == 2
    engine.add_policy.assert_not_called()


def test_bootstrap_raises_after_retries_exhausted() -> None:
    import drpe.api.app as app_module

    store = MagicMock()
    lost = OperationalError("the connection is lost", None, None)
    store.list_policies.side_effect = lost

    with patch("drpe.api.app.time.sleep"), pytest.raises(OperationalError):
        app_module._bootstrap_store(
            store,
            MagicMock(),
            MagicMock(),
            MagicMock(),
            force_seed=False,
        )

    assert store.list_policies.call_count == 4
