"""Policy version history and diff models."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class PolicyVersionInfo(BaseModel):
    """Lightweight metadata for a stored policy version snapshot."""

    policy_id: str
    version: int
    created_at: datetime | None = None
    name: str | None = None
    status: str | None = None


class PolicyDiffChange(BaseModel):
    """A single structural change between two policy versions."""

    path: str
    op: Literal["add", "remove", "replace"]
    old: Any = None
    new: Any = None


class PolicyDiffRequest(BaseModel):
    from_version: int = Field(ge=1)
    to_version: int = Field(ge=1)


class PolicyDiffResponse(BaseModel):
    policy_id: str
    from_version: int
    to_version: int
    changes: list[PolicyDiffChange] = Field(default_factory=list)
