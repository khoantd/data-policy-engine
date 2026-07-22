"""Classification endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from drpe.api.deps import AuthDep, ClassifierDep
from drpe.api.schemas import BatchClassificationRequest
from drpe.models.classification_policy import ClassificationRequest, ClassificationResponse

router = APIRouter(prefix="/classify", tags=["classify"])


@router.post("", response_model=ClassificationResponse)
def classify_one(
    _: AuthDep,
    body: ClassificationRequest,
    classifier: ClassifierDep,
) -> ClassificationResponse:
    return classifier.classify(body)


@router.post("/batch", response_model=list[ClassificationResponse])
def classify_batch(
    _: AuthDep,
    body: BatchClassificationRequest,
    classifier: ClassifierDep,
) -> list[ClassificationResponse]:
    return classifier.classify_batch(body.records)


@router.post("/dry-run", response_model=ClassificationResponse)
def classify_dry_run(
    _: AuthDep,
    body: ClassificationRequest,
    classifier: ClassifierDep,
) -> ClassificationResponse:
    return classifier.classify(body, dry_run=True)
