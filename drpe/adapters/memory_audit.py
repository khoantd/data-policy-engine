"""In-memory AuditStore adapter."""

from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone

from drpe.models.audit import AuditEntry, AuditEntryCreate, AuditEventType


class InMemoryAuditStore:
    def __init__(self) -> None:
        self._entries: list[AuditEntry] = []
        self._lock = threading.Lock()

    def append(self, entry: AuditEntryCreate) -> AuditEntry:
        created = AuditEntry(
            id=f"aud_{uuid.uuid4().hex[:16]}",
            created_at=datetime.now(timezone.utc),
            event_type=entry.event_type,
            policy_id=entry.policy_id,
            rule_id=entry.rule_id,
            record_id=entry.record_id,
            action=entry.action,
            payload=dict(entry.payload),
            job_id=entry.job_id,
            evaluation_id=entry.evaluation_id,
        )
        with self._lock:
            self._entries.append(created)
        return created

    def list_logs(
        self,
        *,
        policy_id: str | None = None,
        record_id: str | None = None,
        job_id: str | None = None,
        event_type: AuditEventType | None = None,
        since: datetime | None = None,
        until: datetime | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[AuditEntry]:
        with self._lock:
            items = list(self._entries)

        def _match(e: AuditEntry) -> bool:
            if policy_id is not None and e.policy_id != policy_id:
                return False
            if record_id is not None and e.record_id != record_id:
                return False
            if job_id is not None and e.job_id != job_id:
                return False
            if event_type is not None and e.event_type != event_type:
                return False
            if since is not None and e.created_at < since:
                return False
            if until is not None and e.created_at > until:
                return False
            return True

        filtered = [e for e in items if _match(e)]
        filtered.sort(key=lambda e: e.created_at, reverse=True)
        return filtered[offset : offset + limit]
