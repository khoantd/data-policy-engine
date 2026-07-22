"""DSAR (Data Subject Access Request) domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field

from drpe.models.enforcement import RecordRef


class DsarRequestType(str, Enum):
    ACCESS = "access"
    ERASURE = "erasure"


class DsarRequestStatus(str, Enum):
    RECEIVED = "received"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PARTIAL = "partial"
    DENIED = "denied"
    FAILED = "failed"


class DsarDeniedRecord(BaseModel):
    record_id: str
    reason: str


class DsarError(BaseModel):
    record_id: str | None = None
    detail: str


class DsarResult(BaseModel):
    """Outcome payload stored on a DSAR request after processing."""

    records: list[RecordRef] = Field(default_factory=list)
    erased: list[str] = Field(default_factory=list)
    denied: list[DsarDeniedRecord] = Field(default_factory=list)
    errors: list[DsarError] = Field(default_factory=list)


class DsarRequest(BaseModel):
    id: str
    type: DsarRequestType
    status: DsarRequestStatus = DsarRequestStatus.RECEIVED
    subject_id: str
    policy_id: str
    identity: dict[str, Any] | None = None
    requested_at: datetime
    due_at: datetime | None = None
    completed_at: datetime | None = None
    inline_records: list[RecordRef] | None = None
    result: DsarResult = Field(default_factory=DsarResult)
    error: str | None = None


class DsarSubmitRequest(BaseModel):
    """POST /api/v1/dsar/access|erasure body."""

    subject_id: str
    policy_id: str
    identity: dict[str, Any] | None = None
    records: list[RecordRef] | None = None
