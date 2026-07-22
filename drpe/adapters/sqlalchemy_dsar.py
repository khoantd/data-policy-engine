"""SQLAlchemy-backed DsarRequestStore."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from drpe.db.models import DsarRequestRow
from drpe.models.dsar import (
    DsarRequest,
    DsarRequestStatus,
    DsarRequestType,
    DsarResult,
)
from drpe.models.enforcement import RecordRef


def _row_to_request(row: DsarRequestRow) -> DsarRequest:
    inline = None
    if row.inline_records:
        inline = [RecordRef.model_validate(r) for r in row.inline_records]
    return DsarRequest(
        id=row.id,
        type=DsarRequestType(row.type),
        status=DsarRequestStatus(row.status),
        subject_id=row.subject_id,
        policy_id=row.policy_id,
        identity=row.identity,
        requested_at=row.requested_at,
        due_at=row.due_at,
        completed_at=row.completed_at,
        inline_records=inline,
        result=DsarResult.model_validate(row.result or {}),
        error=row.error,
    )


def _request_to_columns(request: DsarRequest) -> dict[str, Any]:
    inline = None
    if request.inline_records is not None:
        inline = [r.model_dump(mode="json") for r in request.inline_records]
    return {
        "id": request.id,
        "type": request.type.value,
        "status": request.status.value,
        "subject_id": request.subject_id,
        "policy_id": request.policy_id,
        "identity": request.identity,
        "requested_at": request.requested_at,
        "due_at": request.due_at,
        "completed_at": request.completed_at,
        "inline_records": inline,
        "result": request.result.model_dump(mode="json"),
        "error": request.error,
    }


class SqlAlchemyDsarStore:
    def __init__(self, session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
        self._session_factory = session_factory

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
        with self._session_factory() as session:
            session.add(DsarRequestRow(**_request_to_columns(request)))
            session.commit()
        return request

    def get(self, request_id: str) -> DsarRequest | None:
        with self._session_factory() as session:
            row = session.get(DsarRequestRow, request_id)
            return _row_to_request(row) if row else None

    def update(self, request: DsarRequest) -> DsarRequest:
        cols = _request_to_columns(request)
        with self._session_factory() as session:
            row = session.get(DsarRequestRow, request.id)
            if row is None:
                raise KeyError(f"dsar request not found: {request.id}")
            for key, value in cols.items():
                if key == "id":
                    continue
                setattr(row, key, value)
            session.commit()
        return request

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
        stmt = select(DsarRequestRow).order_by(DsarRequestRow.requested_at.desc())
        if type is not None:
            stmt = stmt.where(DsarRequestRow.type == type.value)
        if status is not None:
            stmt = stmt.where(DsarRequestRow.status == status.value)
        if subject_id is not None:
            stmt = stmt.where(DsarRequestRow.subject_id == subject_id)
        if policy_id is not None:
            stmt = stmt.where(DsarRequestRow.policy_id == policy_id)
        stmt = stmt.offset(offset).limit(limit)
        with self._session_factory() as session:
            rows = session.scalars(stmt).all()
            return [_row_to_request(r) for r in rows]
