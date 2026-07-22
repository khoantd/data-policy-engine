"""Enforcement job endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from drpe.api.deps import AuthDep
from drpe.models.enforcement import (
    EnforceRequest,
    EnforceResponse,
    EnforcementJob,
    JobStatus,
    JobTrigger,
)
from drpe.scheduler.runtime import enqueue_enforcement_job, get_enforcement_runtime

router = APIRouter(tags=["enforce"])


@router.post("/enforce", response_model=EnforceResponse)
def trigger_enforce(_: AuthDep, body: EnforceRequest) -> EnforceResponse:
    runtime = get_enforcement_runtime()
    if body.policy_id:
        policy = runtime.policy_store.get(body.policy_id)
        if policy is None:
            raise HTTPException(status_code=404, detail="policy not found")

    job = runtime.job_store.create(
        policy_id=body.policy_id,
        trigger=JobTrigger.API,
        inline_records=body.records,
    )
    enqueue_enforcement_job(job.id)
    # Re-fetch in case eager mode completed synchronously
    updated = runtime.job_store.get(job.id) or job
    return EnforceResponse(job_id=updated.id, status=updated.status)


@router.get("/enforce/jobs", response_model=list[EnforcementJob])
def list_jobs(
    _: AuthDep,
    status: JobStatus | None = Query(default=None),
    policy_id: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[EnforcementJob]:
    runtime = get_enforcement_runtime()
    return runtime.job_store.list_jobs(
        status=status, policy_id=policy_id, limit=limit, offset=offset
    )


@router.get("/enforce/jobs/{job_id}", response_model=EnforcementJob)
def get_job(_: AuthDep, job_id: str) -> EnforcementJob:
    runtime = get_enforcement_runtime()
    job = runtime.job_store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="job not found")
    return job
