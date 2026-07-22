"""Privacy masking endpoints (privalyse-mask, optional)."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, model_validator

from drpe.api.deps import AuthDep, SettingsDep
from drpe.privacy.service import (
    PrivacyMaskError,
    PrivacyMaskUnavailable,
    get_privacy_status,
    mask_struct,
    mask_text,
    unmask_text,
)

router = APIRouter(prefix="/privacy", tags=["privacy"])


class PrivacyStatusResponse(BaseModel):
    available: bool
    enabled: bool
    model_size: str | None = None
    languages: list[str] = Field(default_factory=list)


class MaskRequest(BaseModel):
    text: str | None = None
    messages: list[dict[str, str]] | None = None

    @model_validator(mode="after")
    def require_text_or_messages(self) -> MaskRequest:
        has_text = self.text is not None
        has_messages = self.messages is not None
        if has_text == has_messages:
            raise ValueError("Provide exactly one of text or messages")
        return self


class MaskResponse(BaseModel):
    masked_text: str | None = None
    masked_messages: list[dict[str, str]] | None = None
    mapping_token: str
    entity_count: int


class UnmaskRequest(BaseModel):
    text: str
    mapping_token: str
    consume_token: bool = True


class UnmaskResponse(BaseModel):
    text: str


def _privacy_kwargs(settings: SettingsDep) -> dict[str, Any]:
    return {
        "enabled": settings.privacy_mask_enabled,
        "model_size": settings.privalyse_model_size,
        "languages": settings.privalyse_languages_list,
        "allow_list": settings.privalyse_allow_list_items,
        "mapping_ttl_seconds": settings.privacy_mapping_ttl_seconds,
    }


@router.get("/status", response_model=PrivacyStatusResponse)
def privacy_status(_: AuthDep, settings: SettingsDep) -> PrivacyStatusResponse:
    status = get_privacy_status(
        enabled=settings.privacy_mask_enabled,
        model_size=settings.privalyse_model_size,
        languages=settings.privalyse_languages_list,
    )
    return PrivacyStatusResponse(
        available=status.available,
        enabled=status.enabled,
        model_size=status.model_size,
        languages=status.languages,
    )


@router.post("/mask", response_model=MaskResponse)
def privacy_mask(
    body: MaskRequest,
    _: AuthDep,
    settings: SettingsDep,
) -> MaskResponse:
    kwargs = _privacy_kwargs(settings)
    try:
        if body.text is not None:
            result = mask_text(body.text, **kwargs)
            return MaskResponse(
                masked_text=result.masked_text,
                mapping_token=result.mapping_token,
                entity_count=result.entity_count,
            )
        assert body.messages is not None
        masked_messages, token, entity_count = mask_struct(body.messages, **kwargs)
        return MaskResponse(
            masked_messages=masked_messages,
            mapping_token=token,
            entity_count=entity_count,
        )
    except PrivacyMaskUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except PrivacyMaskError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/unmask", response_model=UnmaskResponse)
def privacy_unmask(
    body: UnmaskRequest,
    _: AuthDep,
    settings: SettingsDep,
) -> UnmaskResponse:
    kwargs = _privacy_kwargs(settings)
    try:
        text = unmask_text(
            body.text,
            body.mapping_token,
            consume_token=body.consume_token,
            **kwargs,
        )
        return UnmaskResponse(text=text)
    except PrivacyMaskUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except PrivacyMaskError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
