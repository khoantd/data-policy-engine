"""API request/response schemas beyond core models."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from drpe.models.agent_policy import AgentPolicy
from drpe.models.classification_policy import ClassificationPolicy, ClassificationRequest
from drpe.models.enums import PolicyKind, PolicyStatus
from drpe.models.policy import EvaluationRequest, Policy, ReferenceSource
from drpe.models.policy_version import (
    PolicyDiffChange,
    PolicyDiffRequest,
    PolicyDiffResponse,
    PolicyVersionInfo,
)

__all__ = [
    "BatchClassificationRequest",
    "BatchEvaluateRequest",
    "CatalogLinkProcessRef",
    "CatalogLinkSystemRef",
    "HealthResponse",
    "ImportRequest",
    "ImportResponse",
    "PolicyCatalogLinksResponse",
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
    agent_policy: AgentPolicy | None = None
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
    reference_sources: list[ReferenceSource] = Field(default_factory=list)


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


class CatalogLinkSystemRef(BaseModel):
    """Lean system ref for fleet graph / bulk catalog links."""

    id: str
    name: str
    source_key: str | None = None


class CatalogLinkProcessRef(BaseModel):
    """Lean process ref for fleet graph / bulk catalog links."""

    id: str
    name: str


class PolicyCatalogLinksResponse(BaseModel):
    """Systems and processes linked to one policy (bulk catalog-links entry)."""

    systems: list[CatalogLinkSystemRef] = Field(default_factory=list)
    processes: list[CatalogLinkProcessRef] = Field(default_factory=list)
