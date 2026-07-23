"""Immutable audit log port (append + query only)."""

from __future__ import annotations

from datetime import datetime
from typing import Protocol

from drpe.models.audit import AuditEntry, AuditEntryCreate, AuditEventType


class AuditStore(Protocol):
    def append(self, entry: AuditEntryCreate) -> AuditEntry: ...

    def list_logs(
        self,
        *,
        policy_id: str | None = None,
        record_id: str | None = None,
        job_id: str | None = None,
        event_type: AuditEventType | None = None,
        requester: str | None = None,
        since: datetime | None = None,
        until: datetime | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[AuditEntry]: ...
