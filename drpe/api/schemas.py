"""API request/response schemas beyond core models."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from drpe.models.classification_policy import ClassificationPolicy, ClassificationRequest
from drpe.models.enums import PolicyKind, PolicyStatus
from drpe.models.policy import EvaluationRequest, Policy
from drpe.models.policy_version import (
    PolicyDiffChange,
    PolicyDiffRequest,
    PolicyDiffResponse,
    PolicyVersionInfo,
)

__all__ = [
    "BatchClassificationRequest",
    "BatchEvaluateRequest",
    "HealthResponse",
    "ImportRequest",
    "ImportResponse",
    "PolicyCreateRequest",
    "PolicyDiffChange",
    "PolicyDiffRequest",
    "PolicyDiffResponse",
    "PolicyListItem",
    "PolicyStatusChangeRequest",
    "PolicyVersionInfo",
    "ReadyResponse",
    "ValidateRequest",
    "ValidateResponse",
]


class ValidateRequest(BaseModel):
    yaml: str | None = None
    policy: dict[str, Any] | None = None


class ValidateResponse(BaseModel):
    valid: bool
    policy: Policy | None = None
    classification_policy: ClassificationPolicy | None = None
    policy_kind: PolicyKind | None = None
    errors: list[str] = Field(default_factory=list)


class PolicyListItem(BaseModel):
    id: str
    name: str
    version: int
    status: PolicyStatus
    jurisdiction: str
    policy_kind: PolicyKind
    data_classification: str | None = None
    entity_count: int | None = None
    scope_data_types: list[str] = Field(default_factory=list)
    scope_sources: list[str] = Field(default_factory=list)
    excluded_data_types: list[str] = Field(default_factory=list)
    excluded_sources: list[str] = Field(default_factory=list)
    rule_count: int


class BatchClassificationRequest(BaseModel):
    records: list[ClassificationRequest]


class ImportRequest(BaseModel):
    yaml: str


class ImportResponse(BaseModel):
    imported: list[str]
    count: int


class PolicyCreateRequest(BaseModel):
    """Create from YAML string or JSON policy object."""

    yaml: str | None = None
    policy: dict[str, Any] | None = None


class PolicyStatusChangeRequest(BaseModel):
    status: PolicyStatus


class BatchEvaluateRequest(BaseModel):
    records: list[EvaluationRequest]


class HealthResponse(BaseModel):
    status: str
    version: str = "0.1.0"


class ReadyResponse(BaseModel):
    status: str
    policies_loaded: int
