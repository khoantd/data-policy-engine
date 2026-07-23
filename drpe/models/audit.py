"""Audit log domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class AuditEventType(str, Enum):
    EVALUATION = "evaluation"
    ACTION = "action"
    NOTIFY = "notify"
    PENDING_GRACE = "pending_grace"
    FLAG = "flag"
    DSAR_ACCESS = "dsar_access"
    DSAR_ERASURE = "dsar_erasure"
    GRACE_CANCELLED = "grace_cancelled"


class AuditEntry(BaseModel):
    """Immutable audit log entry."""

    id: str
    created_at: datetime
    event_type: AuditEventType
    policy_id: str | None = None
    rule_id: str | None = None
    record_id: str | None = None
    action: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    job_id: str | None = None
    evaluation_id: str | None = None
    requester: str | None = None


class AuditEntryCreate(BaseModel):
    """Input for appending an audit entry (id/created_at assigned by store)."""

    event_type: AuditEventType
    policy_id: str | None = None
    rule_id: str | None = None
    record_id: str | None = None
    action: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    job_id: str | None = None
    evaluation_id: str | None = None
    requester: str | None = None


def normalize_requester(value: Any, *, max_len: int = 255) -> str | None:
    """Coerce evaluate/enforce context requester into a storeable string."""
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    return text[:max_len]
