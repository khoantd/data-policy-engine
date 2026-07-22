"""Health and jurisdiction endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from drpe.api.deps import AuthDep, StoreDep
from drpe.api.schemas import HealthResponse, ReadyResponse
from drpe.core.jurisdictions import get_jurisdiction, list_jurisdictions
from drpe.db.session import check_connection

health_router = APIRouter(prefix="/health", tags=["health"])
jurisdictions_router = APIRouter(prefix="/jurisdictions", tags=["jurisdictions"])


@health_router.get("", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@health_router.get("/ready", response_model=ReadyResponse)
def ready(request: Request, store: StoreDep) -> ReadyResponse:
    db_engine = getattr(request.app.state, "db_engine", None)
    if db_engine is not None:
        try:
            check_connection(db_engine)
        except Exception as exc:
            raise HTTPException(
                status_code=503,
                detail=f"database unavailable: {exc}",
            ) from exc

    policy_cache = getattr(request.app.state, "policy_cache", None)
    if policy_cache is not None:
        try:
            policy_cache.check_connection()
        except Exception as exc:
            raise HTTPException(
                status_code=503,
                detail=f"cache unavailable: {exc}",
            ) from exc

    return ReadyResponse(status="ready", policies_loaded=len(store.list_policies()))


@jurisdictions_router.get("")
def list_all(_: AuthDep) -> list[dict]:
    return [
        {
            "code": j.code,
            "name": j.name,
            "description": j.description,
            "default_max_retention_days": j.default_max_retention_days,
        }
        for j in list_jurisdictions()
    ]


@jurisdictions_router.get("/{code}")
def get_one(_: AuthDep, code: str) -> dict:
    info = get_jurisdiction(code)
    if info is None:
        raise HTTPException(status_code=404, detail="jurisdiction not found")
    return {
        "code": info.code,
        "name": info.name,
        "description": info.description,
        "default_max_retention_days": info.default_max_retention_days,
    }
