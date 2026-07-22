"""YAML policy DSL parser with Pydantic validation."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import ValidationError

from drpe.models.classification_policy import (
    ClassificationDocument,
    ClassificationPolicy,
)
from drpe.models.policy import Policy, PolicyDocument
from drpe.models.stored_policy import StoredPolicy


class PolicyParseError(Exception):
    """Raised when YAML cannot be parsed or fails schema validation."""

    def __init__(self, message: str, *, errors: list[Any] | None = None) -> None:
        super().__init__(message)
        self.errors = errors or []


def _parse_root_mapping(data: dict[str, Any]) -> StoredPolicy:
    if "classification_policy" in data:
        try:
            doc = ClassificationDocument.model_validate(data)
        except ValidationError as exc:
            raise PolicyParseError(
                f"classification policy validation failed: {exc}",
                errors=exc.errors(),
            ) from exc
        return doc.classification_policy

    if "policy" in data:
        payload = data
    else:
        payload = {"policy": data}

    try:
        doc = PolicyDocument.model_validate(payload)
    except ValidationError as exc:
        raise PolicyParseError(
            f"policy validation failed: {exc}",
            errors=exc.errors(),
        ) from exc
    return doc.policy


def parse_yaml(content: str | bytes) -> StoredPolicy:
    """Parse a YAML policy document string into a validated policy."""
    try:
        data = yaml.safe_load(content)
    except yaml.YAMLError as exc:
        raise PolicyParseError(f"invalid YAML: {exc}") from exc

    if data is None:
        raise PolicyParseError("empty YAML document")
    if not isinstance(data, dict):
        raise PolicyParseError("YAML root must be a mapping")

    return _parse_root_mapping(data)


def parse_retention_yaml(content: str | bytes) -> Policy:
    policy = parse_yaml(content)
    if not isinstance(policy, Policy):
        raise PolicyParseError("expected retention policy document (policy: root)")
    return policy


def parse_classification_yaml(content: str | bytes) -> ClassificationPolicy:
    policy = parse_yaml(content)
    if not isinstance(policy, ClassificationPolicy):
        raise PolicyParseError(
            "expected classification policy document (classification_policy: root)"
        )
    return policy


def parse_file(path: str | Path) -> StoredPolicy:
    """Load and parse a YAML policy file."""
    file_path = Path(path)
    if not file_path.is_file():
        raise PolicyParseError(f"policy file not found: {file_path}")
    return parse_yaml(file_path.read_text(encoding="utf-8"))


def parse_directory(directory: str | Path) -> list[StoredPolicy]:
    """Load all ``.yaml`` / ``.yml`` policy files from a directory."""
    dir_path = Path(directory)
    if not dir_path.is_dir():
        raise PolicyParseError(f"policy directory not found: {dir_path}")
    policies: list[StoredPolicy] = []
    for path in sorted(dir_path.iterdir()):
        if path.suffix.lower() in {".yaml", ".yml"}:
            policies.append(parse_file(path))
    return policies
