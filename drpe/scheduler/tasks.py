"""Celery tasks for retention enforcement."""

from __future__ import annotations

import logging
from typing import Any

from drpe.models.enforcement import JobTrigger
from drpe.scheduler.celery_app import celery_app
from drpe.scheduler.runtime import get_enforcement_runtime

logger = logging.getLogger(__name__)


@celery_app.task(name="drpe.scheduler.tasks.run_enforcement_job")
def run_enforcement_job(job_id: str) -> dict[str, Any]:
    runtime = get_enforcement_runtime()
    job = runtime.runner.run_job(job_id)
    return {
        "job_id": job.id,
        "status": job.status.value,
        "progress": job.progress.model_dump(),
        "error": job.error,
    }


@celery_app.task(name="drpe.scheduler.tasks.scan_due_policies")
def scan_due_policies(policy_id: str | None = None) -> dict[str, Any]:
    """Beat entry: create an enforcement job for active policies and enqueue it."""
    runtime = get_enforcement_runtime()
    job = runtime.job_store.create(
        policy_id=policy_id,
        trigger=JobTrigger.SCHEDULE,
        inline_records=None,
    )
    logger.info("scheduled enforcement job %s policy_id=%s", job.id, policy_id)
    async_result = run_enforcement_job.delay(job.id)
    return {"job_id": job.id, "task_id": async_result.id, "status": job.status.value}
