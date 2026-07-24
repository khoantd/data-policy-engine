"""Process catalog domain models (governance inventory)."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from drpe.models.system import CatalogStatus


class ProcessRecord(BaseModel):
    """Stored business process inventory entry."""

    id: str
    name: str
    description: str | None = None
    owner: str | None = None
    status: CatalogStatus = CatalogStatus.ACTIVE
    tags: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class ProcessCreateRequest(BaseModel):
    """POST /api/v1/processes body."""

    name: str = Field(min_length=1, max_length=512)
    description: str | None = Field(default=None, max_length=4000)
    owner: str | None = Field(default=None, max_length=255)
    status: CatalogStatus = CatalogStatus.ACTIVE
    tags: list[str] = Field(default_factory=list)

    @field_validator("name", "description", "owner", mode="before")
    @classmethod
    def _strip_optional(cls, value: object) -> object:
        if isinstance(value, str):
            stripped = value.strip()
            return stripped if stripped else None
        return value

    @field_validator("name")
    @classmethod
    def _require_name(cls, value: str | None) -> str:
        if not value:
            raise ValueError("name is required")
        return value

    @field_validator("tags", mode="before")
    @classmethod
    def _clean_tags(cls, value: object) -> list[str]:
        if value is None:
            return []
        if not isinstance(value, list):
            raise ValueError("tags must be a list")
        return [str(t).strip() for t in value if str(t).strip()]


class ProcessUpdateRequest(BaseModel):
    """PATCH /api/v1/processes/{id} body."""

    name: str | None = Field(default=None, min_length=1, max_length=512)
    description: str | None = Field(default=None, max_length=4000)
    owner: str | None = Field(default=None, max_length=255)
    status: CatalogStatus | None = None
    tags: list[str] | None = None

    @field_validator("name", "description", "owner", mode="before")
    @classmethod
    def _strip_optional(cls, value: object) -> object:
        if isinstance(value, str):
            stripped = value.strip()
            return stripped if stripped else None
        return value

    @field_validator("tags", mode="before")
    @classmethod
    def _clean_tags(cls, value: object) -> list[str] | None:
        if value is None:
            return None
        if not isinstance(value, list):
            raise ValueError("tags must be a list")
        return [str(t).strip() for t in value if str(t).strip()]


class ProcessResponse(BaseModel):
    """Public process view."""

    id: str
    name: str
    description: str | None = None
    owner: str | None = None
    status: CatalogStatus = CatalogStatus.ACTIVE
    tags: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class ProcessIdsRequest(BaseModel):
    """Replace-set body for linking processes to a policy."""

    process_ids: list[str] = Field(default_factory=list)

    @field_validator("process_ids", mode="before")
    @classmethod
    def _clean_ids(cls, value: object) -> list[str]:
        if value is None:
            return []
        if not isinstance(value, list):
            raise ValueError("process_ids must be a list")
        cleaned = [str(i).strip() for i in value if str(i).strip()]
        return list(dict.fromkeys(cleaned))
