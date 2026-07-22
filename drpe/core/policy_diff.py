"""Structural JSON diff between policy versions."""

from __future__ import annotations

from typing import Any

from drpe.models.policy import Policy
from drpe.models.policy_version import PolicyDiffChange


def _as_json(value: Policy | dict[str, Any]) -> dict[str, Any]:
    if isinstance(value, Policy):
        return value.model_dump(mode="json")
    return value


def _join(path: str, key: str | int) -> str:
    segment = str(key)
    if not path:
        return segment
    return f"{path}.{segment}"


def _diff_values(path: str, left: Any, right: Any, out: list[PolicyDiffChange]) -> None:
    if left == right:
        return

    if isinstance(left, dict) and isinstance(right, dict):
        keys = set(left) | set(right)
        for key in sorted(keys):
            child = _join(path, key)
            if key not in left:
                out.append(PolicyDiffChange(path=child, op="add", old=None, new=right[key]))
            elif key not in right:
                out.append(PolicyDiffChange(path=child, op="remove", old=left[key], new=None))
            else:
                _diff_values(child, left[key], right[key], out)
        return

    if isinstance(left, list) and isinstance(right, list):
        max_len = max(len(left), len(right))
        for idx in range(max_len):
            child = _join(path, idx)
            if idx >= len(left):
                out.append(PolicyDiffChange(path=child, op="add", old=None, new=right[idx]))
            elif idx >= len(right):
                out.append(PolicyDiffChange(path=child, op="remove", old=left[idx], new=None))
            else:
                _diff_values(child, left[idx], right[idx], out)
        return

    out.append(PolicyDiffChange(path=path or "", op="replace", old=left, new=right))


def diff_policies(
    from_policy: Policy | dict[str, Any],
    to_policy: Policy | dict[str, Any],
) -> list[PolicyDiffChange]:
    """Return structural changes from ``from_policy`` to ``to_policy``."""
    left = _as_json(from_policy)
    right = _as_json(to_policy)
    changes: list[PolicyDiffChange] = []
    _diff_values("", left, right, changes)
    return changes
