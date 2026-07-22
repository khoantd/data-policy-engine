"""In-memory EnforcementJobStore adapter."""

from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone

from drpe.models.enforcement import (
    EnforcementJob,
    JobProgress,
    JobStatus,
    JobTrigger,
    RecordRef,
)


class InMemoryEnforcementJobStore:
    def __init__(self) -> None:
        self._jobs: dict[str, EnforcementJob] = {}
        self._lock = threading.Lock()

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
        with self._lock:
            self._jobs[job.id] = job
        return job.model_copy(deep=True)

    def get(self, job_id: str) -> EnforcementJob | None:
        with self._lock:
            job = self._jobs.get(job_id)
            return job.model_copy(deep=True) if job else None

    def update(self, job: EnforcementJob) -> EnforcementJob:
        with self._lock:
            if job.id not in self._jobs:
                raise KeyError(f"job not found: {job.id}")
            self._jobs[job.id] = job.model_copy(deep=True)
            return job.model_copy(deep=True)

    def list_jobs(
        self,
        *,
        status: JobStatus | None = None,
        policy_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[EnforcementJob]:
        with self._lock:
            items = list(self._jobs.values())

        def _match(j: EnforcementJob) -> bool:
            if status is not None and j.status != status:
                return False
            if policy_id is not None and j.policy_id != policy_id:
                return False
            return True

        filtered = [j.model_copy(deep=True) for j in items if _match(j)]
        filtered.sort(key=lambda j: j.requested_at, reverse=True)
        return filtered[offset : offset + limit]
