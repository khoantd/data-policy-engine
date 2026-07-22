"""Pydantic domain models for retention policies."""

from __future__ import annotations

from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator

from drpe.models.enums import Action, DataClassification, Operator, PolicyKind, PolicyStatus


class FieldCondition(BaseModel):
    """A single field comparison in a rule condition."""

    field: str
    operator: Operator
    value: Any = None

    @model_validator(mode="after")
    def validate_value_for_operator(self) -> FieldCondition:
        if self.operator == Operator.IS_NULL:
            return self
        if self.value is None:
            raise ValueError(f"operator '{self.operator.value}' requires a value")
        if self.operator in (Operator.IN, Operator.NOT_IN) and not isinstance(
            self.value, list
        ):
            raise ValueError(f"operator '{self.operator.value}' requires a list value")
        return self


class ConditionGroup(BaseModel):
    """Compound condition: all (AND) or any (OR) of field conditions."""

    all: list[FieldCondition] | None = None
    any: list[FieldCondition] | None = None

    @model_validator(mode="after")
    def require_one_branch(self) -> ConditionGroup:
        if self.all is None and self.any is None:
            raise ValueError("condition must have 'all' or 'any'")
        if self.all is not None and self.any is not None:
            raise ValueError("condition cannot have both 'all' and 'any'")
        if self.all is not None and len(self.all) == 0:
            raise ValueError("'all' must not be empty")
        if self.any is not None and len(self.any) == 0:
            raise ValueError("'any' must not be empty")
        return self


class PolicyRule(BaseModel):
    """A single retention rule within a policy."""

    id: str
    description: str | None = None
    priority: int = Field(ge=1)
    condition: ConditionGroup
    action: Action
    grace_period: str | None = None
    notify_before: str | None = None
    requires_approval: bool = False
    archive_target: str | None = None
    retain_until: str | None = None

    @field_validator("grace_period", "notify_before", mode="before")
    @classmethod
    def validate_duration(cls, v: str | None) -> str | None:
        if v is None:
            return v
        from drpe.core.duration import parse_duration

        parse_duration(v)  # raises on invalid
        return v


class ScopeExclude(BaseModel):
    data_types: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)


class PolicyScope(BaseModel):
    data_types: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)
    exclude: ScopeExclude | None = None


class DsarConfig(BaseModel):
    right_to_access: bool = True
    right_to_erasure: bool = True
    erasure_exceptions: list[str] = Field(default_factory=list)
    response_deadline: str | None = None


class AuditConfig(BaseModel):
    log_evaluations: bool = True
    log_actions: bool = True
    retention_of_audit_logs: str | None = None


class Policy(BaseModel):
    """Full retention policy definition."""

    id: str
    name: str
    version: int = 1
    status: PolicyStatus = PolicyStatus.DRAFT
    jurisdiction: str
    policy_kind: PolicyKind = PolicyKind.RETENTION
    data_classification: DataClassification
    owner: str | None = None
    effective_from: date | str | None = None
    expires_at: date | str | None = None
    tags: list[str] = Field(default_factory=list)
    scope: PolicyScope = Field(default_factory=PolicyScope)
    rules: list[PolicyRule] = Field(min_length=1)
    dsar: DsarConfig | None = None
    audit: AuditConfig | None = None


class PolicyDocument(BaseModel):
    """Top-level YAML wrapper: ``policy:`` root key."""

    policy: Policy


class EvaluationRequest(BaseModel):
    """Request to evaluate a record against policies."""

    data_type: str
    record_id: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    source: str | None = None
    jurisdiction: str | None = None
    context: dict[str, Any] | None = None


class EvaluationResultDetail(BaseModel):
    action: Action
    matched_policy: str | None = None
    matched_rule: str | None = None
    policy_version: int | None = None
    grace_period_ends: str | None = None
    notify_at: str | None = None
    requires_approval: bool = False
    confidence: Literal["definitive", "partial", "none"] = "none"
    archive_target: str | None = None
    retain_until: str | None = None


class ConflictingPolicy(BaseModel):
    policy_id: str
    rule_id: str
    action: Action
    priority: int


class EvaluationResponse(BaseModel):
    """Full evaluation response (API + SDK)."""

    record_id: str
    evaluation_id: str
    result: EvaluationResultDetail
    conflicting_policies: list[ConflictingPolicy] = Field(default_factory=list)
    jurisdiction_applied: str | None = None
    evaluated_at: str
    audit_ref: str | None = None

    @property
    def action(self) -> Action:
        return self.result.action

    @property
    def should_delete(self) -> bool:
        return self.result.action == Action.DELETE

    @property
    def should_archive(self) -> bool:
        return self.result.action == Action.ARCHIVE

    @property
    def is_retained(self) -> bool:
        return self.result.action == Action.RETAIN

    @property
    def grace_period_ends(self) -> str | None:
        return self.result.grace_period_ends
