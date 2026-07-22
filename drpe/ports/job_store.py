"""Enforcement job store port."""

from __future__ import annotations

from typing import Protocol

from drpe.models.enforcement import EnforcementJob, JobStatus, JobTrigger, RecordRef


class EnforcementJobStore(Protocol):
    def create(
        self,
        *,
        policy_id: str | None = None,
        trigger: JobTrigger = JobTrigger.API,
        inline_records: list[RecordRef] | None = None,
    ) -> EnforcementJob: ...

    def get(self, job_id: str) -> EnforcementJob | None: ...

    def update(self, job: EnforcementJob) -> EnforcementJob: ...

    def list_jobs(
        self,
        *,
        status: JobStatus | None = None,
        policy_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[EnforcementJob]: ...
