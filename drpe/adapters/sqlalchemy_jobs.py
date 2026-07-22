"""SQLAlchemy-backed EnforcementJobStore."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from drpe.db.models import EnforcementJobRow
from drpe.models.enforcement import (
    EnforcementJob,
    JobProgress,
    JobStatus,
    JobTrigger,
    RecordRef,
)


def _row_to_job(row: EnforcementJobRow) -> EnforcementJob:
    progress_data = row.progress or {}
    inline = None
    if row.inline_records:
        inline = [RecordRef.model_validate(r) for r in row.inline_records]
    return EnforcementJob(
        id=row.id,
        policy_id=row.policy_id,
        status=JobStatus(row.status),
        trigger=JobTrigger(row.trigger),
        requested_at=row.requested_at,
        started_at=row.started_at,
        finished_at=row.finished_at,
        progress=JobProgress.model_validate(progress_data),
        error=row.error,
        inline_records=inline,
    )


def _job_to_columns(job: EnforcementJob) -> dict[str, Any]:
    inline = None
    if job.inline_records is not None:
        inline = [r.model_dump(mode="json") for r in job.inline_records]
    return {
        "id": job.id,
        "policy_id": job.policy_id,
        "status": job.status.value,
        "trigger": job.trigger.value,
        "requested_at": job.requested_at,
        "started_at": job.started_at,
        "finished_at": job.finished_at,
        "progress": job.progress.model_dump(mode="json"),
        "error": job.error,
        "inline_records": inline,
    }


class SqlAlchemyEnforcementJobStore:
    def __init__(self, session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
        self._session_factory = session_factory

    def create(
        self,
        *,
        policy_id: str | None = None,
        trigger: JobTrigger = JobTrigger.API,
        inline_records: list[RecordRef] | None = None,
    ) -> EnforcementJob:
        job = EnforcementJob(
            id=f"job_{uuid.uuid4().hex[:16]}",
            policy_id=policy_id,
            status=JobStatus.QUEUED,
            trigger=trigger,
            requested_at=datetime.now(timezone.utc),
            progress=JobProgress(),
            inline_records=list(inline_records) if inline_records else None,
        )
        with self._session_factory() as session:
            session.add(EnforcementJobRow(**_job_to_columns(job)))
            session.commit()
        return job

    def get(self, job_id: str) -> EnforcementJob | None:
        with self._session_factory() as session:
            row = session.get(EnforcementJobRow, job_id)
            return _row_to_job(row) if row else None

    def update(self, job: EnforcementJob) -> EnforcementJob:
        cols = _job_to_columns(job)
        with self._session_factory() as session:
            row = session.get(EnforcementJobRow, job.id)
            if row is None:
                raise KeyError(f"job not found: {job.id}")
            for key, value in cols.items():
                if key == "id":
                    continue
                setattr(row, key, value)
            session.commit()
        return job

    def list_jobs(
        self,
        *,
        status: JobStatus | None = None,
        policy_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[EnforcementJob]:
        stmt = select(EnforcementJobRow).order_by(
            EnforcementJobRow.requested_at.desc()
        )
        if status is not None:
            stmt = stmt.where(EnforcementJobRow.status == status.value)
        if policy_id is not None:
            stmt = stmt.where(EnforcementJobRow.policy_id == policy_id)
        stmt = stmt.offset(offset).limit(limit)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_row_to_job(r) for r in rows]
