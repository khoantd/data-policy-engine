"""In-memory DsarRequestStore adapter."""

from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone
from typing import Any

from drpe.models.dsar import (
    DsarRequest,
    DsarRequestStatus,
    DsarRequestType,
    DsarResult,
)
from drpe.models.enforcement import RecordRef


class InMemoryDsarStore:
    def __init__(self) -> None:
        self._requests: dict[str, DsarRequest] = {}
        self._lock = threading.Lock()

    def create(
        self,
        *,
        type: DsarRequestType,
        subject_id: str,
        policy_id: str,
        identity: dict[str, Any] | None = None,
        inline_records: list[RecordRef] | None = None,
        due_at: datetime | None = None,
        status: DsarRequestStatus = DsarRequestStatus.RECEIVED,
        result: DsarResult | None = None,
    ) -> DsarRequest:
        request = DsarRequest(
            id=f"dsar_{uuid.uuid4().hex[:16]}",
            type=type,
            status=status,
            subject_id=subject_id,
            policy_id=policy_id,
            identity=dict(identity) if identity else None,
            requested_at=datetime.now(timezone.utc),
            due_at=due_at,
            inline_records=list(inline_records) if inline_records else None,
            result=result or DsarResult(),
        )
        with self._lock:
            self._requests[request.id] = request
        return request.model_copy(deep=True)

    def get(self, request_id: str) -> DsarRequest | None:
        with self._lock:
            req = self._requests.get(request_id)
            return req.model_copy(deep=True) if req else None

    def update(self, request: DsarRequest) -> DsarRequest:
        with self._lock:
            if request.id not in self._requests:
                raise KeyError(f"dsar request not found: {request.id}")
            self._requests[request.id] = request.model_copy(deep=True)
            return request.model_copy(deep=True)

    def list_requests(
        self,
        *,
        type: DsarRequestType | None = None,
        status: DsarRequestStatus | None = None,
        subject_id: str | None = None,
        policy_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[DsarRequest]:
        with self._lock:
            items = list(self._requests.values())

        def _match(r: DsarRequest) -> bool:
            if type is not None and r.type != type:
                return False
            if status is not None and r.status != status:
                return False
            if subject_id is not None and r.subject_id != subject_id:
                return False
            if policy_id is not None and r.policy_id != policy_id:
                return False
            return True

        filtered = [r.model_copy(deep=True) for r in items if _match(r)]
        filtered.sort(key=lambda r: r.requested_at, reverse=True)
        return filtered[offset : offset + limit]
