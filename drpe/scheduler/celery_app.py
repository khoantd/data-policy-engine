"""Celery application for DRPE enforcement scheduling."""

from __future__ import annotations

import os

from celery import Celery
from celery.schedules import schedule

from drpe.api.settings import Settings

celery_app = Celery("drpe")


def configure_celery(settings: Settings | None = None) -> Celery:
    """Apply settings to the shared Celery app (worker, beat, and API process)."""
    settings = settings or Settings()
    broker = settings.effective_celery_broker_url or "memory://"
    eager = (
        settings.drpe_celery_eager
        or broker.startswith("memory://")
        or os.environ.get("DRPE_CELERY_EAGER", "").lower() in ("1", "true", "yes")
    )
    if broker.startswith("memory://"):
        backend = "cache+memory://"
    else:
        backend = settings.redis_url or broker

    celery_app.conf.update(
        broker_url=broker,
        result_backend=backend,
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        task_always_eager=eager,
        task_eager_propagates=True,
        task_ignore_result=eager,
        beat_schedule={
            "scan-due-policies": {
                "task": "drpe.scheduler.tasks.scan_due_policies",
                "schedule": schedule(run_every=settings.drpe_enforce_interval_seconds),
            },
        },
        imports=("drpe.scheduler.tasks",),
    )
    return celery_app


def create_celery_app(settings: Settings | None = None) -> Celery:
    return configure_celery(settings)


# Default configuration for `celery -A drpe.scheduler.celery_app worker`
configure_celery()
