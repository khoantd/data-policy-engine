"""In-memory GraceHoldStore adapter."""

from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone

from drpe.models.grace_hold import (
    GraceHold,
    GraceHoldCreate,
    GraceHoldStatus,
)


class InMemoryGraceHoldStore:
    def __init__(self) -> None:
        self._holds: dict[str, GraceHold] = {}
        self._lock = threading.Lock()

    def create(self, entry: GraceHoldCreate) -> GraceHold:
        now = datetime.now(timezone.utc)
        hold = GraceHold(
            id=f"gh_{uuid.uuid4().hex[:16]}",
            policy_id=entry.policy_id,
            rule_id=entry.rule_id,
            record_id=entry.record_id,
            data_type=entry.data_type,
            action=entry.action,
            grace_period_ends=entry.grace_period_ends,
            notify_at=entry.notify_at,
            status=GraceHoldStatus.ACTIVE,
            created_at=now,
            updated_at=now,
            requester=entry.requester,
            source_job_id=entry.source_job_id,
            evaluation_id=entry.evaluation_id,
        )
        with self._lock:
            existing = self._find_locked(
                policy_id=entry.policy_id,
                rule_id=entry.rule_id,
                record_id=entry.record_id,
            )
            if existing is not None:
                raise ValueError(
                    f"grace hold already exists for "
                    f"{entry.policy_id}/{entry.rule_id}/{entry.record_id}"
                )
            self._holds[hold.id] = hold
        return hold.model_copy(deep=True)

    def get(self, hold_id: str) -> GraceHold | None:
        with self._lock:
            hold = self._holds.get(hold_id)
            return hold.model_copy(deep=True) if hold else None

    def get_by_key(
        self, *, policy_id: str, rule_id: str, record_id: str
    ) -> GraceHold | None:
        with self._lock:
            hold = self._find_locked(
                policy_id=policy_id, rule_id=rule_id, record_id=record_id
            )
            return hold.model_copy(deep=True) if hold else None

    def update(self, hold: GraceHold) -> GraceHold:
        with self._lock:
            if hold.id not in self._holds:
                raise KeyError(f"grace hold not found: {hold.id}")
            updated = hold.model_copy(deep=True)
            updated.updated_at = datetime.now(timezone.utc)
            self._holds[hold.id] = updated
            return updated.model_copy(deep=True)

    def delete(self, hold_id: str) -> None:
        with self._lock:
            self._holds.pop(hold_id, None)

    def list_holds(
        self,
        *,
        status: GraceHoldStatus | None = None,
        policy_id: str | None = None,
        record_id: str | None = None,
        rule_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[GraceHold]:
        with self._lock:
            items = list(self._holds.values())

        def _match(h: GraceHold) -> bool:
            if status is not None and h.status != status:
                return False
            if policy_id is not None and h.policy_id != policy_id:
                return False
            if record_id is not None and h.record_id != record_id:
                return False
            if rule_id is not None and h.rule_id != rule_id:
                return False
            return True

        filtered = [h.model_copy(deep=True) for h in items if _match(h)]
        filtered.sort(key=lambda h: h.created_at, reverse=True)
        return filtered[offset : offset + limit]

    def _find_locked(
        self, *, policy_id: str, rule_id: str, record_id: str
    ) -> GraceHold | None:
        for hold in self._holds.values():
            if (
                hold.policy_id == policy_id
                and hold.rule_id == rule_id
                and hold.record_id == record_id
            ):
                return hold
        return None
