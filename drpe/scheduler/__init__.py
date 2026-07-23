"""DRPE Celery scheduler package."""

from __future__ import annotations

from typing import Any

__all__ = ["celery_app", "configure_celery", "create_celery_app"]


def __getattr__(name: str) -> Any:
    if name in ("celery_app", "configure_celery", "create_celery_app"):
        import drpe.scheduler.celery_app as celery_module

        return getattr(celery_module, name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
