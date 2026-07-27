"""Pydantic domain models for agent / LLM guardrail policies."""

from __future__ import annotations

from datetime import date
from typing import Any

from pydantic import BaseModel, Field, model_validator

from drpe.models.enums import PolicyKind, PolicyStatus
from drpe.models.policy import PolicyScope, ReferenceSource


class AgentPolicy(BaseModel):
    """Agent safety policy backed by an OpenGuardrails document."""

    id: str
    name: str
    version: int = 1
    status: PolicyStatus = PolicyStatus.DRAFT
    jurisdiction: str
    policy_kind: PolicyKind = PolicyKind.AGENT
    owner: str | None = None
    effective_from: date | str | None = None
    expires_at: date | str | None = None
    tags: list[str] = Field(default_factory=list)
    scope: PolicyScope = Field(default_factory=PolicyScope)
    ogr_policy: dict[str, Any]
    rules: list[Any] = Field(default_factory=list)
    reference_sources: list[ReferenceSource] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_ogr_policy(self) -> AgentPolicy:
        if not self.ogr_policy:
            raise ValueError("ogr_policy must not be empty")
        return self


class AgentDocument(BaseModel):
    """Top-level YAML wrapper: ``agent_policy:`` root key."""

    agent_policy: AgentPolicy
