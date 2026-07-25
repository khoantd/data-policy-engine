"""Engine and session helpers."""

from __future__ import annotations

from typing import Any
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from sqlalchemy import Engine, create_engine, text
from sqlalchemy.orm import Session, sessionmaker

# Recycle before typical managed-Postgres / pooler idle timeouts (~5–10 min).
_DEFAULT_POOL_RECYCLE_SECONDS = 300
_DEFAULT_CONNECT_TIMEOUT_SECONDS = 10


def normalize_database_url(database_url: str) -> str:
    """Normalize a Postgres URL for SQLAlchemy + psycopg3.

    - ``postgres://`` / ``postgresql://`` → ``postgresql+psycopg://``
    - Supabase hosts get ``sslmode=require`` when unset (pooler and direct)
    """
    url = database_url
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://") :]
    elif url.startswith("postgres://"):
        url = "postgresql+psycopg://" + url[len("postgres://") :]

    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if "supabase" in host:
        query = dict(parse_qsl(parsed.query, keep_blank_values=True))
        if "sslmode" not in query:
            query["sslmode"] = "require"
            url = urlunparse(parsed._replace(query=urlencode(query)))
    return url


def create_db_engine(database_url: str, *, echo: bool = False) -> Engine:
    """Create a SQLAlchemy engine. Accepts postgresql:// or postgresql+psycopg:// URLs.

    Configured for managed Postgres / Supabase Supavisor (session or transaction
    pooler): prepared statements disabled, pool pre-ping, and connection recycle.
    """
    url = normalize_database_url(database_url)
    connect_args: dict[str, Any] = {
        # Required for transaction-mode PgBouncer/Supavisor; safe on session/direct.
        "prepare_threshold": None,
        "connect_timeout": _DEFAULT_CONNECT_TIMEOUT_SECONDS,
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }
    return create_engine(
        url,
        echo=echo,
        pool_pre_ping=True,
        pool_recycle=_DEFAULT_POOL_RECYCLE_SECONDS,
        connect_args=connect_args,
    )


def create_session_factory(engine: Engine) -> sessionmaker[Session]:
    return sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def check_connection(engine: Engine) -> None:
    """Raise if the database is unreachable."""
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
