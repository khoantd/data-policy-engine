"""Guardrails (OpenGuardrails) API endpoints."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Query, Request, Response, status
from pydantic import BaseModel, Field

from drpe.api.deps import AuthDep, SettingsDep
from drpe.guardrails.service import (
    GuardrailsError,
    GuardrailsUnavailable,
    evaluate_event,
    get_guardrails_status,
)
from drpe.models.enums import PolicyStatus
from drpe.models.guardrail_policy import (
    GuardrailPolicy,
    GuardrailPolicyCreateRequest,
    GuardrailPolicyResponse,
    GuardrailPolicyUpdateRequest,
)
from drpe.ports.guardrail_policy_store import GuardrailPolicyStore
from drpe.ports.policy_store import PolicyStore
from drpe.models.stored_policy import is_agent_policy

router = APIRouter(prefix="/guardrails", tags=["guardrails"])


class GuardrailsStatusResponse(BaseModel):
    available: bool
    enabled: bool
    ogr_version: str | None = None


class ProvenanceModel(BaseModel):
    source: str
    trust: str
    ref: str | None = None
    taint_tags: list[str] = Field(default_factory=list)


class GuardEventModel(BaseModel):
    kind: str
    observation_point: str
    subject: dict[str, Any] = Field(default_factory=dict)
    payload: dict[str, Any] = Field(default_factory=dict)
    event_id: str
    guard_id: str
    timestamp: str
    session_id: str | None = None
    llm_protocol: str | None = None
    context_refs: list[str] = Field(default_factory=list)
    provenance: list[ProvenanceModel] = Field(default_factory=list)
    ogr_version: str = "0.1"


class EvaluateRequest(BaseModel):
    event: GuardEventModel
    policy_id: str | None = None
    policy: dict[str, Any] | None = None


class CategoryModel(BaseModel):
    id: str
    domain: str
    score: float = 1.0


class VerdictResponse(BaseModel):
    event_id: str
    guard_id: str
    provider: str
    decision: str
    categories: list[CategoryModel] = Field(default_factory=list)
    reasons: list[str] = Field(default_factory=list)
    evidence: list[dict[str, Any]] = Field(default_factory=list)
    confidence: float | None = None
    latency_ms: float | None = None
    ogr_version: str = "0.1"


def _guardrail_store(request: Request) -> GuardrailPolicyStore:
    return request.app.state.guardrail_policy_store


def _policy_store(request: Request) -> PolicyStore:
    return request.app.state.store


def _resolve_policy_document(
    request: Request,
    *,
    policy_id: str | None,
    inline_policy: dict[str, Any] | None,
) -> dict[str, Any]:
    if inline_policy is not None:
        return inline_policy
    if not policy_id:
        raise HTTPException(
            status_code=400,
            detail="Provide policy_id or inline policy",
        )

    main_store = _policy_store(request)
    agent_policy = main_store.get(policy_id)
    if agent_policy is not None and is_agent_policy(agent_policy):
        if agent_policy.status != PolicyStatus.ACTIVE:
            raise HTTPException(
                status_code=409,
                detail=f"agent policy '{policy_id}' is not active",
            )
        return agent_policy.ogr_policy

    stored = _guardrail_store(request).get(policy_id)
    if stored is None:
        raise HTTPException(status_code=404, detail="guardrail policy not found")
    return stored.policy


def _to_response(doc: GuardrailPolicy) -> GuardrailPolicyResponse:
    return GuardrailPolicyResponse(
        id=doc.id,
        name=doc.name,
        policy=doc.policy,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.get("/status", response_model=GuardrailsStatusResponse)
def guardrails_status(_: AuthDep, settings: SettingsDep) -> GuardrailsStatusResponse:
    status_info = get_guardrails_status(enabled=settings.guardrails_enabled)
    return GuardrailsStatusResponse(
        available=status_info.available,
        enabled=status_info.enabled,
        ogr_version=status_info.ogr_version,
    )


@router.get("/policies", response_model=list[GuardrailPolicyResponse])
def list_guardrail_policies(
    _: AuthDep,
    request: Request,
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[GuardrailPolicyResponse]:
    return [
        _to_response(p)
        for p in _guardrail_store(request).list_policies(limit=limit, offset=offset)
    ]


@router.post(
    "/policies",
    response_model=GuardrailPolicyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_guardrail_policy(
    _: AuthDep, request: Request, body: GuardrailPolicyCreateRequest
) -> GuardrailPolicyResponse:
    doc = _guardrail_store(request).create(name=body.name, policy=body.policy)
    return _to_response(doc)


@router.get("/policies/{policy_id}", response_model=GuardrailPolicyResponse)
def get_guardrail_policy(
    _: AuthDep, request: Request, policy_id: str
) -> GuardrailPolicyResponse:
    doc = _guardrail_store(request).get(policy_id)
    if doc is None:
        raise HTTPException(status_code=404, detail="guardrail policy not found")
    return _to_response(doc)


@router.put("/policies/{policy_id}", response_model=GuardrailPolicyResponse)
def update_guardrail_policy(
    _: AuthDep,
    request: Request,
    policy_id: str,
    body: GuardrailPolicyUpdateRequest,
) -> GuardrailPolicyResponse:
    if body.name is None and body.policy is None:
        raise HTTPException(status_code=400, detail="Provide name and/or policy")
    try:
        doc = _guardrail_store(request).update(
            policy_id, name=body.name, policy=body.policy
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="guardrail policy not found") from None
    return _to_response(doc)


@router.delete("/policies/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guardrail_policy(
    _: AuthDep, request: Request, policy_id: str
) -> Response:
    deleted = _guardrail_store(request).delete(policy_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="guardrail policy not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/evaluate", response_model=VerdictResponse)
def evaluate_guard_event(
    _: AuthDep,
    request: Request,
    settings: SettingsDep,
    body: EvaluateRequest,
) -> VerdictResponse:
    try:
        policy_doc = _resolve_policy_document(
            request,
            policy_id=body.policy_id,
            inline_policy=body.policy,
        )
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        verdict = evaluate_event(
            body.event.model_dump(),
            policy_doc,
            enabled=settings.guardrails_enabled,
        )
    except GuardrailsUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except GuardrailsError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return VerdictResponse.model_validate(verdict)


def seed_default_guardrail_policy(
    store: GuardrailPolicyStore,
    path: str | Path | None,
) -> GuardrailPolicy | None:
    """Seed a default OGR policy when the store is empty."""
    if not path:
        return None
    if store.list_policies(limit=1):
        return None
    policy_path = Path(path)
    if not policy_path.is_file():
        return None
    try:
        data = json.loads(policy_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(data, dict):
        return None
    return store.create(name="default", policy=data)
