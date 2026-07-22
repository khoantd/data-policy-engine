"""Semantic PII masking via privalyse-mask (optional dependency)."""

from drpe.privacy.service import (
    PrivacyMaskError,
    PrivacyMaskUnavailable,
    get_privacy_status,
    mask_struct,
    mask_text,
    unmask_text,
)

__all__ = [
    "PrivacyMaskError",
    "PrivacyMaskUnavailable",
    "get_privacy_status",
    "mask_struct",
    "mask_text",
    "unmask_text",
]
