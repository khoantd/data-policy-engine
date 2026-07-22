"""Tests for in-memory and SQLAlchemy DSAR stores."""

from __future__ import annotations

from datetime import datetime, timezone

import pytest
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from drpe.adapters.memory_dsar import InMemoryDsarStore
from drpe.adapters.sqlalchemy_dsar import SqlAlchemyDsarStore
from drpe.db.base import SCHEMA, Base
from drpe.db.models import DsarRequestRow  # noqa: F401
from drpe.models.dsar import DsarRequestStatus, DsarRequestType, DsarResult
from drpe.models.enforcement import RecordRef


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


def _exercise_store(store: InMemoryDsarStore | SqlAlchemyDsarStore) -> None:
    req = store.create(
        type=DsarRequestType.ACCESS,
        subject_id="subj_1",
        policy_id="pol_1",
        identity={"email": "a@b.c"},
        inline_records=[
            RecordRef(record_id="subj_1", data_type="customer_profile", metadata={})
        ],
        due_at=datetime.now(timezone.utc),
        status=DsarRequestStatus.IN_PROGRESS,
    )
    assert req.id.startswith("dsar_")
    fetched = store.get(req.id)
    assert fetched is not None
    assert fetched.subject_id == "subj_1"
    assert fetched.inline_records is not None

    req.status = DsarRequestStatus.COMPLETED
    req.result = DsarResult(records=fetched.inline_records or [])
    req.completed_at = datetime.now(timezone.utc)
    store.update(req)

    again = store.get(req.id)
    assert again is not None
    assert again.status == DsarRequestStatus.COMPLETED
    assert len(again.result.records) == 1

    listed = store.list_requests(
        type=DsarRequestType.ACCESS,
        subject_id="subj_1",
        policy_id="pol_1",
    )
    assert len(listed) == 1


def test_memory_dsar_store() -> None:
    _exercise_store(InMemoryDsarStore())


def test_sqlalchemy_dsar_store(session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
    _exercise_store(SqlAlchemyDsarStore(session_factory))
