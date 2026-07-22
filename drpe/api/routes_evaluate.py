"""Evaluation endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from drpe.api.deps import AuthDep, EngineDep
from drpe.api.schemas import BatchEvaluateRequest
from drpe.models.policy import EvaluationRequest, EvaluationResponse

router = APIRouter(prefix="/evaluate", tags=["evaluate"])


@router.post("", response_model=EvaluationResponse)
def evaluate_one(
    _: AuthDep,
    body: EvaluationRequest,
    engine: EngineDep,
) -> EvaluationResponse:
    return engine.evaluate(body)


@router.post("/batch", response_model=list[EvaluationResponse])
def evaluate_batch(
    _: AuthDep,
    body: BatchEvaluateRequest,
    engine: EngineDep,
) -> list[EvaluationResponse]:
    if len(body.records) > 1000:
        raise HTTPException(status_code=400, detail="batch limit is 1000 records")
    return engine.evaluate_batch(body.records)


@router.post("/dry-run", response_model=EvaluationResponse)
def evaluate_dry_run(
    _: AuthDep,
    body: EvaluationRequest,
    engine: EngineDep,
) -> EvaluationResponse:
    return engine.evaluate(body, dry_run=True)
