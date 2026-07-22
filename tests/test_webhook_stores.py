"""Tests for in-memory and SQLAlchemy webhook registration stores."""

from __future__ import annotations

import pytest
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from drpe.adapters.memory_webhooks import InMemoryWebhookStore
from drpe.adapters.sqlalchemy_webhooks import SqlAlchemyWebhookStore
from drpe.db.base import SCHEMA, Base
from drpe.db.models import WebhookRow  # noqa: F401


@pytest.fixture
def session_factory() -> sessionmaker:  # type: ignore[type-arg]
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def _attach_schema(dbapi_conn, _connection_record):  # type: ignore[no-untyped-def]
        dbapi_conn.execute(f"ATTACH DATABASE ':memory:' AS {SCHEMA}")

    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        conn.commit()

    Base.metadata.create_all(engine)
    return sessionmaker(
        bind=engine, autoflush=False, autocommit=False, expire_on_commit=False
    )


def _exercise_store(store: InMemoryWebhookStore | SqlAlchemyWebhookStore) -> None:
    created = store.create(
        url="https://hooks.example.com/drpe",
        events=["enforcement.delete", "dsar.access"],
        secret="whsec_test",
        description="Primary hook",
        active=True,
    )
    assert created.id.startswith("wh_")
    assert created.url == "https://hooks.example.com/drpe"
    assert created.events == ["enforcement.delete", "dsar.access"]
    assert created.secret == "whsec_test"
    assert created.active is True

    fetched = store.get(created.id)
    assert fetched is not None
    assert fetched.id == created.id
    assert fetched.secret == "whsec_test"

    updated = store.update(
        created.id,
        url="https://hooks.example.com/drpe/v2",
        events=["*"],
        active=False,
        description="Updated",
    )
    assert updated.url == "https://hooks.example.com/drpe/v2"
    assert updated.events == ["*"]
    assert updated.active is False
    assert updated.description == "Updated"
    assert updated.secret == "whsec_test"
    assert updated.updated_at >= created.updated_at

    listed = store.list_webhooks(active=False)
    assert len(listed) == 1
    assert listed[0].id == created.id

    assert store.delete(created.id) is True
    assert store.get(created.id) is None
    assert store.delete(created.id) is False


def test_memory_webhook_store() -> None:
    _exercise_store(InMemoryWebhookStore())


def test_sqlalchemy_webhook_store(session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
    _exercise_store(SqlAlchemyWebhookStore(session_factory))


def test_update_missing_raises() -> None:
    store = InMemoryWebhookStore()
    with pytest.raises(KeyError):
        store.update("wh_missing", url="https://example.com/x")
