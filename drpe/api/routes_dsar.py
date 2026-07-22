"""DSAR (Data Subject Access Request) API endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Request

from drpe.api.deps import AuthDep
from drpe.core.dsar import DsarRightsError, DsarService
from drpe.models.dsar import (
    DsarRequest,
    DsarRequestStatus,
    DsarRequestType,
    DsarSubmitRequest,
)

router = APIRouter(prefix="/dsar", tags=["dsar"])


def _service(request: Request) -> DsarService:
    return request.app.state.dsar_service


@router.post("/access", response_model=DsarRequest)
def submit_access(_: AuthDep, request: Request, body: DsarSubmitRequest) -> DsarRequest:
    svc = _service(request)
    try:
        return svc.submit_access(
            subject_id=body.subject_id,
            policy_id=body.policy_id,
            identity=body.identity,
            records=body.records,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except DsarRightsError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc


@router.post("/erasure", response_model=DsarRequest)
def submit_erasure(
    _: AuthDep, request: Request, body: DsarSubmitRequest
) -> DsarRequest:
    svc = _service(request)
    try:
        return svc.submit_erasure(
            subject_id=body.subject_id,
            policy_id=body.policy_id,
            identity=body.identity,
            records=body.records,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except DsarRightsError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc


@router.get("/requests", response_model=list[DsarRequest])
def list_requests(
    _: AuthDep,
    request: Request,
    type: DsarRequestType | None = Query(default=None),
    status: DsarRequestStatus | None = Query(default=None),
    subject_id: str | None = Query(default=None),
    policy_id: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[DsarRequest]:
    return request.app.state.dsar_store.list_requests(
        type=type,
        status=status,
        subject_id=subject_id,
        policy_id=policy_id,
        limit=limit,
        offset=offset,
    )


@router.get("/requests/{request_id}", response_model=DsarRequest)
def get_request(_: AuthDep, request: Request, request_id: str) -> DsarRequest:
    req = request.app.state.dsar_store.get(request_id)
    if req is None:
        raise HTTPException(status_code=404, detail="dsar request not found")
    return req
