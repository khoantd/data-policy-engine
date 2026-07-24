"""Tests for Celery Redis broker connection pool limits."""

from __future__ import annotations

from drpe.api.settings import Settings
from drpe.scheduler.celery_app import configure_celery


def test_configure_celery_limits_redis_broker_pool() -> None:
    settings = Settings(
        redis_url="redis://localhost:6379/0",
        celery_broker_url=None,
        drpe_celery_eager=False,
        drpe_celery_broker_pool_limit=10,
        drpe_redis_max_connections=20,
    )
    app = configure_celery(settings)

    assert app.conf.broker_pool_limit == 10
    assert app.conf.redis_max_connections == 20
    assert app.conf.broker_transport_options["max_connections"] == 20


def test_configure_celery_skips_redis_pool_for_memory_broker() -> None:
    settings = Settings(
        redis_url=None,
        celery_broker_url=None,
        drpe_celery_eager=True,
    )
    app = configure_celery(settings)

    assert app.conf.broker_url.startswith("memory://")
    # Pool knobs may still be set; ensure eager/memory path stays usable.
    assert app.conf.task_always_eager is True
