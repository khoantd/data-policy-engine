"""Webhook registration CRUD API endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Request, Response, status

from drpe.api.deps import AuthDep
from drpe.models.webhook import (
    WebhookCreateRequest,
    WebhookCreateResponse,
    WebhookRegistration,
    WebhookResponse,
    WebhookUpdateRequest,
)
from drpe.ports.webhook_store import WebhookStore

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


def _store(request: Request) -> WebhookStore:
    return request.app.state.webhook_store


def _to_response(registration: WebhookRegistration) -> WebhookResponse:
    return WebhookResponse(
        id=registration.id,
        url=registration.url,
        events=registration.events,
        description=registration.description,
        active=registration.active,
        secret_set=bool(registration.secret),
        created_at=registration.created_at,
        updated_at=registration.updated_at,
    )


def _to_create_response(registration: WebhookRegistration) -> WebhookCreateResponse:
    assert registration.secret is not None
    return WebhookCreateResponse(
        id=registration.id,
        url=registration.url,
        events=registration.events,
        description=registration.description,
        active=registration.active,
        secret_set=True,
        secret=registration.secret,
        created_at=registration.created_at,
        updated_at=registration.updated_at,
    )


@router.post("", response_model=WebhookCreateResponse, status_code=status.HTTP_201_CREATED)
def create_webhook(
    _: AuthDep, request: Request, body: WebhookCreateRequest
) -> WebhookCreateResponse:
    registration = _store(request).create(
        url=str(body.url),
        events=body.events,
        secret=body.secret,
        description=body.description,
        active=body.active,
    )
    return _to_create_response(registration)


@router.get("", response_model=list[WebhookResponse])
def list_webhooks(
    _: AuthDep,
    request: Request,
    active: bool | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[WebhookResponse]:
    return [
        _to_response(w)
        for w in _store(request).list_webhooks(
            active=active, limit=limit, offset=offset
        )
    ]


@router.get("/{webhook_id}", response_model=WebhookResponse)
def get_webhook(_: AuthDep, request: Request, webhook_id: str) -> WebhookResponse:
    registration = _store(request).get(webhook_id)
    if registration is None:
        raise HTTPException(status_code=404, detail="webhook not found")
    return _to_response(registration)


@router.patch("/{webhook_id}", response_model=WebhookResponse)
def update_webhook(
    _: AuthDep, request: Request, webhook_id: str, body: WebhookUpdateRequest
) -> WebhookResponse:
    try:
        registration = _store(request).update(
            webhook_id,
            url=str(body.url) if body.url is not None else None,
            events=body.events,
            secret=body.secret,
            description=body.description,
            active=body.active,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="webhook not found") from exc
    return _to_response(registration)


@router.delete("/{webhook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_webhook(_: AuthDep, request: Request, webhook_id: str) -> Response:
    deleted = _store(request).delete(webhook_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="webhook not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
