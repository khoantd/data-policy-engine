"""Lazy PrivalyseMasker singleton (optional privalyse-mask package)."""

from __future__ import annotations

import inspect
from typing import Any

_masker: Any | None = None
_masker_config: tuple[str, tuple[str, ...], tuple[str, ...]] | None = None


def is_privalyse_available() -> bool:
    try:
        import privalyse_mask  # noqa: F401

        return True
    except ImportError:
        return False


def get_masker(
    *,
    model_size: str = "sm",
    languages: list[str] | None = None,
    allow_list: list[str] | None = None,
) -> Any:
    """Return a configured PrivalyseMasker or raise ImportError.

    ``model_size`` is accepted for API/settings compatibility. Current
    ``privalyse-mask`` (0.1.x) always uses spaCy ``*_lg`` models and ignores
    this argument unless a future release adds the parameter.
    """
    global _masker, _masker_config

    from privalyse_mask import PrivalyseMasker

    langs = tuple(languages or ["en"])
    allow = tuple(allow_list or [])
    config_key = (model_size, langs, allow)

    if _masker is not None and _masker_config == config_key:
        return _masker

    kwargs: dict[str, Any] = {
        "languages": list(langs),
        "allow_list": list(allow),
    }
    # Forward model_size only when the installed package supports it.
    if "model_size" in inspect.signature(PrivalyseMasker.__init__).parameters:
        kwargs["model_size"] = model_size

    _masker = PrivalyseMasker(**kwargs)
    _masker_config = config_key
    return _masker


def reset_masker_for_tests() -> None:
    global _masker, _masker_config
    _masker = None
    _masker_config = None
