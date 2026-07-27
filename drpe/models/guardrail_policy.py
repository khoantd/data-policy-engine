"""Guardrail policy domain models (OpenGuardrails policy JSON documents)."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class GuardrailPolicy(BaseModel):
    """Stored OGR policy document."""

    id: str
    name: str
    policy: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class GuardrailPolicyCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=512)
    policy: dict[str, Any]


class GuardrailPolicyUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=512)
    policy: dict[str, Any] | None = None


class GuardrailPolicyResponse(BaseModel):
    id: str
    name: str
    policy: dict[str, Any]
    created_at: datetime
    updated_at: datetime
