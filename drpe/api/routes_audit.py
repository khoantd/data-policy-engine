"""Audit log query endpoints."""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Query

from drpe.api.deps import AuthDep
from drpe.models.audit import AuditEntry, AuditEventType
from drpe.scheduler.runtime import get_enforcement_runtime

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/logs", response_model=list[AuditEntry])
def list_audit_logs(
    _: AuthDep,
    policy_id: str | None = Query(default=None),
    record_id: str | None = Query(default=None),
    job_id: str | None = Query(default=None),
    event_type: AuditEventType | None = Query(default=None),
    since: datetime | None = Query(default=None),
    until: datetime | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[AuditEntry]:
    runtime = get_enforcement_runtime()
    return runtime.audit_store.list_logs(
        policy_id=policy_id,
        record_id=record_id,
        job_id=job_id,
        event_type=event_type,
        since=since,
        until=until,
        limit=limit,
        offset=offset,
    )
