"""Tests for SQLAlchemy audit and job stores (SQLite in-memory)."""

from __future__ import annotations

import pytest
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from drpe.adapters.sqlalchemy_audit import SqlAlchemyAuditStore
from drpe.adapters.sqlalchemy_jobs import SqlAlchemyEnforcementJobStore
from drpe.db.base import SCHEMA, Base
from drpe.db.models import AuditLogRow, EnforcementJobRow  # noqa: F401
from drpe.models.audit import AuditEntryCreate, AuditEventType
from drpe.models.enforcement import JobStatus, JobTrigger, RecordRef


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


def test_audit_append_and_list(session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
    store = SqlAlchemyAuditStore(session_factory)
    entry = store.append(
        AuditEntryCreate(
            event_type=AuditEventType.ACTION,
            policy_id="pol_1",
            record_id="r1",
            action="delete",
            job_id="job_1",
            requester="enforcement_runner",
        )
    )
    assert entry.id.startswith("aud_")
    logs = store.list_logs(policy_id="pol_1")
    assert len(logs) == 1
    assert logs[0].record_id == "r1"
    assert logs[0].requester == "enforcement_runner"


def test_audit_filter_by_requester(session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
    store = SqlAlchemyAuditStore(session_factory)
    store.append(
        AuditEntryCreate(
            event_type=AuditEventType.EVALUATION,
            policy_id="pol_1",
            action="delete",
            requester="crm_cleanup_job",
        )
    )
    store.append(
        AuditEntryCreate(
            event_type=AuditEventType.EVALUATION,
            policy_id="pol_1",
            action="retain",
            requester="enforcement_runner",
        )
    )
    filtered = store.list_logs(requester="crm_cleanup_job")
    assert len(filtered) == 1
    assert filtered[0].requester == "crm_cleanup_job"


def test_job_lifecycle(session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
    store = SqlAlchemyEnforcementJobStore(session_factory)
    job = store.create(
        policy_id="pol_1",
        trigger=JobTrigger.API,
        inline_records=[
            RecordRef(record_id="r1", data_type="customer_profile", metadata={})
        ],
    )
    assert job.status == JobStatus.QUEUED
    fetched = store.get(job.id)
    assert fetched is not None
    assert fetched.inline_records is not None
    assert fetched.inline_records[0].record_id == "r1"

    job.status = JobStatus.RUNNING
    job.progress.scanned = 1
    store.update(job)
    again = store.get(job.id)
    assert again is not None
    assert again.status == JobStatus.RUNNING
    assert again.progress.scanned == 1

    listed = store.list_jobs(status=JobStatus.RUNNING)
    assert len(listed) == 1
