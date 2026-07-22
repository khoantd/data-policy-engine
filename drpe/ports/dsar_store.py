"""DSAR request store port."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Protocol

from drpe.models.dsar import (
    DsarRequest,
    DsarRequestStatus,
    DsarRequestType,
    DsarResult,
)
from drpe.models.enforcement import RecordRef


class DsarRequestStore(Protocol):
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
    ) -> DsarRequest: ...

    def get(self, request_id: str) -> DsarRequest | None: ...

    def update(self, request: DsarRequest) -> DsarRequest: ...

    def list_requests(
        self,
        *,
        type: DsarRequestType | None = None,
        status: DsarRequestStatus | None = None,
        subject_id: str | None = None,
        policy_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[DsarRequest]: ...
