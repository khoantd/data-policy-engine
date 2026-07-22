"""Union helpers for retention and classification policies in the store."""

from __future__ import annotations

from typing import Union

from drpe.models.classification_policy import ClassificationPolicy
from drpe.models.enums import PolicyKind
from drpe.models.policy import Policy

StoredPolicy = Union[Policy, ClassificationPolicy]


def policy_kind_of(policy: StoredPolicy) -> PolicyKind:
    if isinstance(policy, ClassificationPolicy):
        return PolicyKind.CLASSIFICATION
    return getattr(policy, "policy_kind", PolicyKind.RETENTION)


def policy_id_of(policy: StoredPolicy) -> str:
    return policy.id


def as_retention(policy: StoredPolicy) -> Policy | None:
    return policy if isinstance(policy, Policy) else None


def as_classification(policy: StoredPolicy) -> ClassificationPolicy | None:
    return policy if isinstance(policy, ClassificationPolicy) else None


def is_retention_policy(policy: StoredPolicy) -> bool:
    return isinstance(policy, Policy)


def is_classification_policy(policy: StoredPolicy) -> bool:
    return isinstance(policy, ClassificationPolicy)
