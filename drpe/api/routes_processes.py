"""Processes catalog CRUD and policy link API."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Request, Response, status

from drpe.api.deps import AuthDep, StoreDep
from drpe.models.process import (
    ProcessCreateRequest,
    ProcessRecord,
    ProcessResponse,
    ProcessUpdateRequest,
)
from drpe.models.system import CatalogStatus, PolicyIdsRequest
from drpe.ports.catalog_store import CatalogStore

router = APIRouter(prefix="/processes", tags=["processes"])


def _catalog(request: Request) -> CatalogStore:
    return request.app.state.catalog_store


def _to_response(record: ProcessRecord) -> ProcessResponse:
    return ProcessResponse(
        id=record.id,
        name=record.name,
        description=record.description,
        owner=record.owner,
        status=record.status,
        tags=list(record.tags),
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


@router.post("", response_model=ProcessResponse, status_code=status.HTTP_201_CREATED)
def create_process(
    _: AuthDep, request: Request, body: ProcessCreateRequest
) -> ProcessResponse:
    record = _catalog(request).create_process(
        name=body.name,
        description=body.description,
        owner=body.owner,
        status=body.status,
        tags=body.tags,
    )
    return _to_response(record)


@router.get("", response_model=list[ProcessResponse])
def list_processes(
    _: AuthDep,
    request: Request,
    status_filter: CatalogStatus | None = Query(default=None, alias="status"),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[ProcessResponse]:
    return [
        _to_response(p)
        for p in _catalog(request).list_processes(
            status=status_filter, limit=limit, offset=offset
        )
    ]


@router.get("/{process_id}", response_model=ProcessResponse)
def get_process(_: AuthDep, request: Request, process_id: str) -> ProcessResponse:
    record = _catalog(request).get_process(process_id)
    if record is None:
        raise HTTPException(status_code=404, detail="process not found")
    return _to_response(record)


@router.patch("/{process_id}", response_model=ProcessResponse)
def update_process(
    _: AuthDep, request: Request, process_id: str, body: ProcessUpdateRequest
) -> ProcessResponse:
    try:
        record = _catalog(request).update_process(
            process_id,
            name=body.name,
            description=body.description,
            owner=body.owner,
            status=body.status,
            tags=body.tags,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="process not found") from exc
    return _to_response(record)


@router.delete("/{process_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_process(_: AuthDep, request: Request, process_id: str) -> Response:
    deleted = _catalog(request).delete_process(process_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="process not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{process_id}/policies", response_model=list[str])
def list_process_policies(
    _: AuthDep, request: Request, process_id: str
) -> list[str]:
    if _catalog(request).get_process(process_id) is None:
        raise HTTPException(status_code=404, detail="process not found")
    return _catalog(request).list_policy_ids_for_process(process_id)


@router.put("/{process_id}/policies", response_model=list[str])
def set_process_policies(
    _: AuthDep,
    request: Request,
    process_id: str,
    body: PolicyIdsRequest,
    store: StoreDep,
) -> list[str]:
    for policy_id in body.policy_ids:
        if store.get(policy_id) is None:
            raise HTTPException(
                status_code=404, detail=f"policy not found: {policy_id}"
            )
    try:
        return _catalog(request).set_process_policies(process_id, body.policy_ids)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="process not found") from exc
