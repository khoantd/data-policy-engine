"""Serialize retention and classification policies for persistence."""

from __future__ import annotations

from typing import Any

from drpe.models.classification_policy import ClassificationPolicy
from drpe.models.enums import DataClassification, PolicyKind
from drpe.models.policy import Policy
from drpe.models.stored_policy import StoredPolicy, is_classification_policy, policy_kind_of


def _default_data_classification(policy: StoredPolicy) -> str:
    if isinstance(policy, ClassificationPolicy):
        if not policy.entities:
            return DataClassification.PII.value
        rank = {
            DataClassification.PUBLIC: 0,
            DataClassification.OPERATIONAL: 1,
            DataClassification.FINANCIAL: 2,
            DataClassification.PII: 3,
            DataClassification.SPII: 4,
        }
        top = max(policy.entities, key=lambda e: rank[e.classification])
        return top.classification.value
    return policy.data_classification.value


def stored_policy_to_columns(policy: StoredPolicy) -> dict[str, Any]:
    kind = policy_kind_of(policy)
    data = policy.model_dump(mode="json")
    base = {
        "policy_kind": kind.value,
        "id": data["id"],
        "name": data["name"],
        "version": data["version"],
        "status": data["status"],
        "jurisdiction": data["jurisdiction"],
        "data_classification": _default_data_classification(policy),
        "owner": data.get("owner"),
        "effective_from": data.get("effective_from"),
        "expires_at": data.get("expires_at"),
        "tags": data.get("tags") or [],
        "scope": data.get("scope") or {},
        "rules": data["rules"],
        "dsar": data.get("dsar") if isinstance(policy, Policy) else None,
        "audit": data.get("audit") if isinstance(policy, Policy) else None,
        "entities": data.get("entities") if isinstance(policy, ClassificationPolicy) else None,
        "text_fields": data.get("text_fields") if isinstance(policy, ClassificationPolicy) else None,
    }
    return base


def row_to_stored_policy(row: Any) -> StoredPolicy:
    kind = getattr(row, "policy_kind", PolicyKind.RETENTION.value)
    if kind == PolicyKind.CLASSIFICATION.value:
        return ClassificationPolicy.model_validate(
            {
                "id": row.id,
                "name": row.name,
                "version": row.version,
                "status": row.status,
                "jurisdiction": row.jurisdiction,
                "owner": row.owner,
                "effective_from": row.effective_from,
                "expires_at": row.expires_at,
                "tags": row.tags or [],
                "scope": row.scope or {},
                "entities": row.entities or [],
                "rules": row.rules,
                "text_fields": getattr(row, "text_fields", None) or [],
            }
        )
    return Policy.model_validate(
        {
            "id": row.id,
            "name": row.name,
            "version": row.version,
            "status": row.status,
            "jurisdiction": row.jurisdiction,
            "policy_kind": PolicyKind.RETENTION,
            "data_classification": row.data_classification,
            "owner": row.owner,
            "effective_from": row.effective_from,
            "expires_at": row.expires_at,
            "tags": row.tags or [],
            "scope": row.scope or {},
            "rules": row.rules,
            "dsar": row.dsar,
            "audit": row.audit,
        }
    )


def snapshot_to_stored_policy(snapshot: dict[str, Any]) -> StoredPolicy:
    kind = snapshot.get("policy_kind", PolicyKind.RETENTION)
    if kind == PolicyKind.CLASSIFICATION.value or "entities" in snapshot:
        return ClassificationPolicy.model_validate(snapshot)
    return Policy.model_validate(snapshot)


def stored_policy_to_cache_json(policy: StoredPolicy) -> dict[str, Any]:
    data = policy.model_dump(mode="json")
    data["policy_kind"] = policy_kind_of(policy).value
    return data


def cache_json_to_stored_policy(data: dict[str, Any]) -> StoredPolicy:
    return snapshot_to_stored_policy(data)
