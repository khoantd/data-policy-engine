"""Pydantic domain models for PII / sensitive data classification policies."""

from __future__ import annotations

from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator

from drpe.models.enums import (
    ClassificationAction,
    DataClassification,
    Operator,
    PolicyKind,
    PolicyStatus,
    Sensitivity,
)
from drpe.models.policy import ConditionGroup, PolicyScope


class EntityDetection(BaseModel):
    """How to detect an entity in record metadata or text."""

    field_names: list[str] = Field(default_factory=list)
    regex: str | None = None
    ner_types: list[str] = Field(default_factory=list)
    catalog_ref: str | None = None


class ClassificationEntity(BaseModel):
    """A detectable PII / sensitive data entity definition."""

    id: str
    label: str
    classification: DataClassification
    sensitivity: Sensitivity = Sensitivity.MEDIUM
    regulatory_refs: list[str] = Field(default_factory=list)
    detection: EntityDetection = Field(default_factory=EntityDetection)


class ClassificationRule(BaseModel):
    """Rule fired after entity detection to recommend handling."""

    id: str
    description: str | None = None
    priority: int = Field(ge=1)
    condition: ConditionGroup
    action: ClassificationAction
    handling: str | None = None


class ClassificationPolicy(BaseModel):
    """Full classification policy definition."""

    id: str
    name: str
    version: int = 1
    status: PolicyStatus = PolicyStatus.DRAFT
    jurisdiction: str
    policy_kind: PolicyKind = PolicyKind.CLASSIFICATION
    owner: str | None = None
    effective_from: date | str | None = None
    expires_at: date | str | None = None
    tags: list[str] = Field(default_factory=list)
    scope: PolicyScope = Field(default_factory=PolicyScope)
    entities: list[ClassificationEntity] = Field(min_length=1)
    rules: list[ClassificationRule] = Field(min_length=1)
    text_fields: list[str] = Field(
        default_factory=list,
        description="Metadata field paths scanned with NER when privalyse is available",
    )

    @model_validator(mode="after")
    def validate_entities_and_rules(self) -> ClassificationPolicy:
        entity_ids = {entity.id for entity in self.entities}
        if len(entity_ids) != len(self.entities):
            raise ValueError("entity ids must be unique")
        rule_ids = {rule.id for rule in self.rules}
        if len(rule_ids) != len(self.rules):
            raise ValueError("rule ids must be unique")
        return self


class ClassificationDocument(BaseModel):
    """Top-level YAML wrapper: ``classification_policy:`` root key."""

    classification_policy: ClassificationPolicy


class DetectedEntity(BaseModel):
    """A single entity hit from classification."""

    entity_id: str
    label: str
    field: str
    classification: DataClassification
    sensitivity: Sensitivity
    confidence: str = "definitive"
    snippet: str | None = None
    detector: str
    regulatory_refs: list[str] = Field(default_factory=list)


class ClassificationRequest(BaseModel):
    """Request to classify a record against classification policies."""

    data_type: str
    record_id: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    source: str | None = None
    jurisdiction: str | None = None
    text_fields: list[str] | None = None
    policy_id: str | None = None


class ClassificationResultDetail(BaseModel):
    action: ClassificationAction
    handling: str | None = None
    matched_policy: str | None = None
    matched_rule: str | None = None
    policy_version: int | None = None
    max_classification: DataClassification | None = None
    max_sensitivity: Sensitivity | None = None


class ClassificationPolicyScopeSummary(BaseModel):
    """Subset of selected policy scope echoed for UI diagnostics."""

    jurisdiction: str
    data_types: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)
    excluded_data_types: list[str] = Field(default_factory=list)
    excluded_sources: list[str] = Field(default_factory=list)


class ClassificationDiagnostics(BaseModel):
    """Why a policy did or did not apply to this request."""

    applicable_policy_count: int = 0
    selected_policy_applied: bool = False
    out_of_scope_reason: Literal["none", "jurisdiction", "data_type", "source"] = "none"
    policy_scope_summary: ClassificationPolicyScopeSummary | None = None


class ClassificationResponse(BaseModel):
    record_id: str
    classification_id: str
    detected_entities: list[DetectedEntity] = Field(default_factory=list)
    result: ClassificationResultDetail
    diagnostics: ClassificationDiagnostics = Field(default_factory=ClassificationDiagnostics)
    jurisdiction_applied: str | None = None
    classified_at: str
    audit_ref: str | None = None


# Re-export for condition validation on synthetic metadata fields.
_FIELD_OPERATORS = Operator
