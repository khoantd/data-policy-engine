"""Webhook registration domain models."""

from __future__ import annotations

from datetime import datetime

from pydantic import AnyHttpUrl, BaseModel, Field, field_validator


class WebhookRegistration(BaseModel):
    """Stored webhook endpoint registration."""

    id: str
    url: str
    events: list[str]
    secret: str | None = None
    description: str | None = None
    active: bool = True
    created_at: datetime
    updated_at: datetime


class WebhookCreateRequest(BaseModel):
    """POST /api/v1/webhooks body."""

    url: AnyHttpUrl
    events: list[str] = Field(min_length=1)
    secret: str | None = Field(default=None, min_length=8, max_length=256)
    description: str | None = Field(default=None, max_length=512)
    active: bool = True

    @field_validator("events")
    @classmethod
    def _non_empty_events(cls, value: list[str]) -> list[str]:
        cleaned = [e.strip() for e in value if e and e.strip()]
        if not cleaned:
            raise ValueError("events must contain at least one non-empty event")
        return cleaned


class WebhookUpdateRequest(BaseModel):
    """PATCH /api/v1/webhooks/{id} body."""

    url: AnyHttpUrl | None = None
    events: list[str] | None = Field(default=None, min_length=1)
    secret: str | None = Field(default=None, min_length=8, max_length=256)
    description: str | None = Field(default=None, max_length=512)
    active: bool | None = None

    @field_validator("events")
    @classmethod
    def _non_empty_events(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        cleaned = [e.strip() for e in value if e and e.strip()]
        if not cleaned:
            raise ValueError("events must contain at least one non-empty event")
        return cleaned


class WebhookResponse(BaseModel):
    """Public webhook view (secret omitted)."""

    id: str
    url: str
    events: list[str]
    description: str | None = None
    active: bool = True
    secret_set: bool = False
    created_at: datetime
    updated_at: datetime


class WebhookCreateResponse(WebhookResponse):
    """Create response includes secret once for the client to store."""

    secret: str
