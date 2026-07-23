"""Grace hold domain models — sticky deferred destructive actions."""

from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class GraceHoldStatus(str, Enum):
    ACTIVE = "active"
    DISPATCHED = "dispatched"
    FORCED = "forced"
    CANCELLED = "cancelled"


class GraceHold(BaseModel):
    id: str
    policy_id: str
    rule_id: str
    record_id: str
    data_type: str
    action: str
    grace_period_ends: str
    notify_at: str | None = None
    status: GraceHoldStatus = GraceHoldStatus.ACTIVE
    created_at: datetime
    updated_at: datetime
    closed_at: datetime | None = None
    requester: str | None = None
    source_job_id: str | None = None
    evaluation_id: str | None = None


class GraceHoldCreate(BaseModel):
    policy_id: str
    rule_id: str
    record_id: str
    data_type: str
    action: str
    grace_period_ends: str
    notify_at: str | None = None
    requester: str | None = None
    source_job_id: str | None = None
    evaluation_id: str | None = None


class GraceHoldActionRequest(BaseModel):
    """Optional body for force / cancel."""

    requester: str | None = Field(default=None, max_length=255)
