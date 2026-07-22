"""Privacy masking service — mask/unmask text for LLM pipelines."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from drpe.privacy.mapping_store import count_entities, get_mapping_store
from drpe.privacy.masker import get_masker, is_privalyse_available


class PrivacyMaskUnavailable(Exception):
    """privalyse-mask is not installed or masking is disabled."""


class PrivacyMaskError(Exception):
    """Mask/unmask operation failed."""


@dataclass(frozen=True)
class MaskResult:
    masked_text: str
    mapping_token: str
    entity_count: int


@dataclass(frozen=True)
class PrivacyStatus:
    available: bool
    enabled: bool
    model_size: str | None
    languages: list[str]


def _require_masker(
    *,
    enabled: bool,
    model_size: str,
    languages: list[str],
    allow_list: list[str],
) -> Any:
    if not enabled:
        raise PrivacyMaskUnavailable("Privacy masking is disabled")
    if not is_privalyse_available():
        raise PrivacyMaskUnavailable(
            "privalyse-mask is not installed. Run: pip install -e \".[ai]\""
        )
    try:
        return get_masker(
            model_size=model_size,
            languages=languages,
            allow_list=allow_list,
        )
    except Exception as exc:
        raise PrivacyMaskError(f"Failed to initialize masker: {exc}") from exc


def get_privacy_status(
    *,
    enabled: bool = True,
    model_size: str = "sm",
    languages: list[str] | None = None,
) -> PrivacyStatus:
    langs = languages or ["en"]
    available = enabled and is_privalyse_available()
    return PrivacyStatus(
        available=available,
        enabled=enabled,
        model_size=model_size if available else None,
        languages=langs if available else [],
    )


def mask_text(
    text: str,
    *,
    enabled: bool = True,
    model_size: str = "sm",
    languages: list[str] | None = None,
    allow_list: list[str] | None = None,
    mapping_ttl_seconds: int = 300,
) -> MaskResult:
    masker = _require_masker(
        enabled=enabled,
        model_size=model_size,
        languages=languages or ["en"],
        allow_list=allow_list or [],
    )
    try:
        masked, mapping = masker.mask(text)
    except Exception as exc:
        raise PrivacyMaskError(f"Mask failed: {exc}") from exc

    store = get_mapping_store(mapping_ttl_seconds)
    token = store.issue(mapping)
    return MaskResult(
        masked_text=masked,
        mapping_token=token,
        entity_count=count_entities(mapping),
    )


def mask_struct(
    messages: list[dict[str, str]],
    *,
    enabled: bool = True,
    model_size: str = "sm",
    languages: list[str] | None = None,
    allow_list: list[str] | None = None,
    mapping_ttl_seconds: int = 300,
) -> tuple[list[dict[str, str]], str, int]:
    masker = _require_masker(
        enabled=enabled,
        model_size=model_size,
        languages=languages or ["en"],
        allow_list=allow_list or [],
    )
    try:
        masked_messages, mapping = masker.mask_struct(messages)
    except Exception as exc:
        raise PrivacyMaskError(f"Mask struct failed: {exc}") from exc

    store = get_mapping_store(mapping_ttl_seconds)
    token = store.issue(mapping)
    return masked_messages, token, count_entities(mapping)


def unmask_text(
    text: str,
    mapping_token: str,
    *,
    enabled: bool = True,
    model_size: str = "sm",
    languages: list[str] | None = None,
    allow_list: list[str] | None = None,
    mapping_ttl_seconds: int = 300,
    consume_token: bool = True,
) -> str:
    if not enabled:
        raise PrivacyMaskUnavailable("Privacy masking is disabled")

    store = get_mapping_store(mapping_ttl_seconds)
    mapping = store.consume(mapping_token) if consume_token else store.peek(mapping_token)
    if mapping is None:
        raise PrivacyMaskError("Invalid or expired mapping token")

    masker = _require_masker(
        enabled=enabled,
        model_size=model_size,
        languages=languages or ["en"],
        allow_list=allow_list or [],
    )
    try:
        return masker.unmask(text, mapping)
    except Exception as exc:
        raise PrivacyMaskError(f"Unmask failed: {exc}") from exc
