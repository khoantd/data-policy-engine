"""Grace hold list / force / cancel endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from drpe.api.deps import AuthDep
from drpe.models.grace_hold import (
    GraceHold,
    GraceHoldActionRequest,
    GraceHoldStatus,
)
from drpe.scheduler.runtime import get_enforcement_runtime

router = APIRouter(prefix="/grace-holds", tags=["grace-holds"])


@router.get("", response_model=list[GraceHold])
def list_grace_holds(
    _: AuthDep,
    status: GraceHoldStatus | None = Query(default=None),
    policy_id: str | None = Query(default=None),
    record_id: str | None = Query(default=None),
    rule_id: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[GraceHold]:
    runtime = get_enforcement_runtime()
    return runtime.grace_hold_store.list_holds(
        status=status,
        policy_id=policy_id,
        record_id=record_id,
        rule_id=rule_id,
        limit=limit,
        offset=offset,
    )


@router.get("/{hold_id}", response_model=GraceHold)
def get_grace_hold(_: AuthDep, hold_id: str) -> GraceHold:
    runtime = get_enforcement_runtime()
    hold = runtime.grace_hold_store.get(hold_id)
    if hold is None:
        raise HTTPException(status_code=404, detail="grace hold not found")
    return hold


@router.post("/{hold_id}/force", response_model=GraceHold)
def force_grace_hold(
    _: AuthDep,
    hold_id: str,
    body: GraceHoldActionRequest | None = None,
) -> GraceHold:
    runtime = get_enforcement_runtime()
    requester = body.requester if body else None
    try:
        return runtime.runner.force_dispatch_hold(hold_id, requester=requester)
    except KeyError:
        raise HTTPException(status_code=404, detail="grace hold not found") from None
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from None
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from None
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from None


@router.post("/{hold_id}/cancel", response_model=GraceHold)
def cancel_grace_hold(
    _: AuthDep,
    hold_id: str,
    body: GraceHoldActionRequest | None = None,
) -> GraceHold:
    runtime = get_enforcement_runtime()
    requester = body.requester if body else None
    try:
        return runtime.runner.cancel_hold(hold_id, requester=requester)
    except KeyError:
        raise HTTPException(status_code=404, detail="grace hold not found") from None
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from None
