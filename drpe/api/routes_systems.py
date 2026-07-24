"""Systems catalog CRUD and policy link API."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Request, Response, status

from drpe.api.deps import AuthDep, StoreDep
from drpe.models.system import (
    CatalogStatus,
    PolicyIdsRequest,
    SystemCreateRequest,
    SystemRecord,
    SystemResponse,
    SystemUpdateRequest,
)
from drpe.ports.catalog_store import CatalogStore

router = APIRouter(prefix="/systems", tags=["systems"])


def _catalog(request: Request) -> CatalogStore:
    return request.app.state.catalog_store


def _to_response(record: SystemRecord) -> SystemResponse:
    return SystemResponse(
        id=record.id,
        name=record.name,
        description=record.description,
        owner=record.owner,
        status=record.status,
        source_key=record.source_key,
        tags=list(record.tags),
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


@router.post("", response_model=SystemResponse, status_code=status.HTTP_201_CREATED)
def create_system(
    _: AuthDep, request: Request, body: SystemCreateRequest
) -> SystemResponse:
    record = _catalog(request).create_system(
        name=body.name,
        description=body.description,
        owner=body.owner,
        status=body.status,
        source_key=body.source_key,
        tags=body.tags,
    )
    return _to_response(record)


@router.get("", response_model=list[SystemResponse])
def list_systems(
    _: AuthDep,
    request: Request,
    status_filter: CatalogStatus | None = Query(default=None, alias="status"),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[SystemResponse]:
    return [
        _to_response(s)
        for s in _catalog(request).list_systems(
            status=status_filter, limit=limit, offset=offset
        )
    ]


@router.get("/{system_id}", response_model=SystemResponse)
def get_system(_: AuthDep, request: Request, system_id: str) -> SystemResponse:
    record = _catalog(request).get_system(system_id)
    if record is None:
        raise HTTPException(status_code=404, detail="system not found")
    return _to_response(record)


@router.patch("/{system_id}", response_model=SystemResponse)
def update_system(
    _: AuthDep, request: Request, system_id: str, body: SystemUpdateRequest
) -> SystemResponse:
    try:
        record = _catalog(request).update_system(
            system_id,
            name=body.name,
            description=body.description,
            owner=body.owner,
            status=body.status,
            source_key=body.source_key,
            tags=body.tags,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="system not found") from exc
    return _to_response(record)


@router.delete("/{system_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_system(_: AuthDep, request: Request, system_id: str) -> Response:
    deleted = _catalog(request).delete_system(system_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="system not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{system_id}/policies", response_model=list[str])
def list_system_policies(
    _: AuthDep, request: Request, system_id: str
) -> list[str]:
    if _catalog(request).get_system(system_id) is None:
        raise HTTPException(status_code=404, detail="system not found")
    return _catalog(request).list_policy_ids_for_system(system_id)


@router.put("/{system_id}/policies", response_model=list[str])
def set_system_policies(
    _: AuthDep,
    request: Request,
    system_id: str,
    body: PolicyIdsRequest,
    store: StoreDep,
) -> list[str]:
    for policy_id in body.policy_ids:
        if store.get(policy_id) is None:
            raise HTTPException(
                status_code=404, detail=f"policy not found: {policy_id}"
            )
    try:
        return _catalog(request).set_system_policies(system_id, body.policy_ids)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="system not found") from exc
