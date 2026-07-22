"""Enforcement job and record domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class JobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"


class JobTrigger(str, Enum):
    SCHEDULE = "schedule"
    API = "api"


class JobProgress(BaseModel):
    scanned: int = 0
    dispatched: int = 0
    pending_grace: int = 0
    errors: int = 0
    notified: int = 0


class RecordRef(BaseModel):
    """A record reference for enforcement scans."""

    record_id: str
    data_type: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    source: str | None = None
    jurisdiction: str | None = None


class EnforcementJob(BaseModel):
    id: str
    policy_id: str | None = None
    status: JobStatus = JobStatus.QUEUED
    trigger: JobTrigger = JobTrigger.API
    requested_at: datetime
    started_at: datetime | None = None
    finished_at: datetime | None = None
    progress: JobProgress = Field(default_factory=JobProgress)
    error: str | None = None
    # Inline records for API-triggered runs (not persisted as JSON column when empty)
    inline_records: list[RecordRef] | None = None


class EnforceRequest(BaseModel):
    """POST /api/v1/enforce body."""

    policy_id: str | None = None
    records: list[RecordRef] | None = None


class EnforceResponse(BaseModel):
    job_id: str
    status: JobStatus


class DispatchResult(BaseModel):
    ok: bool = True
    detail: str | None = None
