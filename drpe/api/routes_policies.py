"""Policy management endpoints."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, status

from drpe.api.deps import AuthDep, ClassifierDep, EngineDep, StoreDep
from drpe.api.schemas import (
    ImportRequest,
    ImportResponse,
    PolicyCreateRequest,
    PolicyDiffRequest,
    PolicyDiffResponse,
    PolicyListItem,
    PolicyStatusChangeRequest,
    PolicyVersionInfo,
    ValidateRequest,
    ValidateResponse,
)
from drpe.core.policy_diff import diff_policies
from drpe.dsl.parser import PolicyParseError, parse_yaml
from drpe.models.classification_policy import ClassificationDocument, ClassificationPolicy
from drpe.models.enums import PolicyKind
from drpe.models.policy import Policy, PolicyDocument, ReferenceSource
from drpe.models.stored_policy import StoredPolicy, as_retention, is_classification_policy, policy_kind_of

router = APIRouter(prefix="/policies", tags=["policies"])


def _preserve_reference_sources(
    policy: StoredPolicy, existing: StoredPolicy | None
) -> StoredPolicy:
    """Keep AI provenance when YAML rebuild omits reference_sources."""
    if policy.reference_sources:
        return policy
    if existing is None or not existing.reference_sources:
        return policy
    return policy.model_copy(
        update={"reference_sources": list(existing.reference_sources)}
    )


def _attach_import_reference_sources(
    policy: StoredPolicy, sources: list[ReferenceSource]
) -> StoredPolicy:
    if not sources:
        return policy
    return policy.model_copy(update={"reference_sources": list(sources)})


def _policy_from_body(body: PolicyCreateRequest | ValidateRequest) -> StoredPolicy:
    if body.yaml:
        return parse_yaml(body.yaml)
    if body.policy is not None:
        if "classification_policy" in body.policy:
            return ClassificationDocument.model_validate(body.policy).classification_policy
        if "policy" in body.policy:
            return PolicyDocument.model_validate(body.policy).policy
        if "entities" in body.policy:
            return ClassificationPolicy.model_validate(body.policy)
        return Policy.model_validate(body.policy)
    raise PolicyParseError("provide 'yaml' or 'policy'")


def _to_list_item(policy: StoredPolicy) -> PolicyListItem:
    kind = policy_kind_of(policy)
    exclude = policy.scope.exclude
    if is_classification_policy(policy):
        assert isinstance(policy, ClassificationPolicy)
        return PolicyListItem(
            id=policy.id,
            name=policy.name,
            version=policy.version,
            status=policy.status,
            jurisdiction=policy.jurisdiction,
            policy_kind=kind,
            entity_count=len(policy.entities),
            scope_data_types=list(policy.scope.data_types),
            scope_sources=list(policy.scope.sources),
            excluded_data_types=list(exclude.data_types) if exclude else [],
            excluded_sources=list(exclude.sources) if exclude else [],
            rule_count=len(policy.rules),
        )
    retention = as_retention(policy)
    assert retention is not None
    return PolicyListItem(
        id=retention.id,
        name=retention.name,
        version=retention.version,
        status=retention.status,
        jurisdiction=retention.jurisdiction,
        policy_kind=kind,
        data_classification=retention.data_classification.value,
        scope_data_types=list(retention.scope.data_types),
        scope_sources=list(retention.scope.sources),
        excluded_data_types=list(exclude.data_types) if exclude else [],
        excluded_sources=list(exclude.sources) if exclude else [],
        rule_count=len(retention.rules),
    )


def _register_policy(
    stored: StoredPolicy,
    engine: EngineDep,
    classifier: ClassifierDep,
) -> None:
    if is_classification_policy(stored):
        classifier.add_policy(stored)  # type: ignore[arg-type]
    else:
        retention = as_retention(stored)
        if retention is not None:
            engine.add_policy(retention)


@router.post("/validate", response_model=ValidateResponse)
def validate_policy(_: AuthDep, body: ValidateRequest) -> ValidateResponse:
    try:
        policy = _policy_from_body(body)
        kind = policy_kind_of(policy)
        if is_classification_policy(policy):
            return ValidateResponse(
                valid=True,
                classification_policy=policy,  # type: ignore[arg-type]
                policy_kind=kind,
            )
        return ValidateResponse(
            valid=True,
            policy=as_retention(policy),
            policy_kind=kind,
        )
    except PolicyParseError as exc:
        return ValidateResponse(valid=False, errors=[str(exc)])
    except Exception as exc:  # noqa: BLE001
        return ValidateResponse(valid=False, errors=[str(exc)])


@router.post("/import", response_model=ImportResponse)
def import_policies(
    _: AuthDep,
    body: ImportRequest,
    store: StoreDep,
    engine: EngineDep,
    classifier: ClassifierDep,
) -> ImportResponse:
    try:
        policy = parse_yaml(body.yaml)
    except PolicyParseError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if body.reference_sources:
        policy = _attach_import_reference_sources(policy, body.reference_sources)
    else:
        policy = _preserve_reference_sources(policy, store.get(policy.id))
    stored = store.upsert(policy)
    _register_policy(stored, engine, classifier)
    return ImportResponse(imported=[stored.id], count=1)


@router.get("", response_model=list[PolicyListItem])
def list_policies(
    _: AuthDep,
    store: StoreDep,
    status_filter: str | None = None,
    policy_kind: PolicyKind | None = None,
) -> list[PolicyListItem]:
    items = [_to_list_item(p) for p in store.list_policies(status=status_filter)]
    if policy_kind is not None:
        items = [item for item in items if item.policy_kind == policy_kind]
    return items


@router.post("", response_model=Any, status_code=status.HTTP_201_CREATED)
def create_policy(
    _: AuthDep,
    body: PolicyCreateRequest,
    store: StoreDep,
    engine: EngineDep,
    classifier: ClassifierDep,
) -> StoredPolicy:
    try:
        policy = _policy_from_body(body)
    except PolicyParseError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if store.get(policy.id):
        raise HTTPException(status_code=409, detail=f"policy '{policy.id}' exists")
    stored = store.upsert(policy)
    _register_policy(stored, engine, classifier)
    return stored


@router.get("/{policy_id}", response_model=Any)
def get_policy(_: AuthDep, policy_id: str, store: StoreDep) -> StoredPolicy:
    policy = store.get(policy_id)
    if policy is None:
        raise HTTPException(status_code=404, detail="policy not found")
    return policy


@router.put("/{policy_id}", response_model=Any)
def update_policy(
    _: AuthDep,
    policy_id: str,
    body: PolicyCreateRequest,
    store: StoreDep,
    engine: EngineDep,
    classifier: ClassifierDep,
) -> StoredPolicy:
    existing = store.get(policy_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="policy not found")
    try:
        policy = _policy_from_body(body)
    except PolicyParseError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if policy.id != policy_id:
        raise HTTPException(status_code=400, detail="policy id mismatch")
    policy = _preserve_reference_sources(policy, existing)
    policy = policy.model_copy(update={"version": existing.version})
    stored = store.upsert(policy)
    _register_policy(stored, engine, classifier)
    return stored


@router.delete("/{policy_id}", response_model=Any)
def delete_policy(
    _: AuthDep,
    policy_id: str,
    store: StoreDep,
    engine: EngineDep,
    classifier: ClassifierDep,
) -> StoredPolicy:
    deprecated = store.deprecate(policy_id)
    if deprecated is None:
        raise HTTPException(status_code=404, detail="policy not found")
    _register_policy(deprecated, engine, classifier)
    return deprecated


@router.post("/{policy_id}/status", response_model=Any)
def change_policy_status(
    _: AuthDep,
    policy_id: str,
    body: PolicyStatusChangeRequest,
    store: StoreDep,
    engine: EngineDep,
    classifier: ClassifierDep,
) -> StoredPolicy:
    updated = store.set_status(policy_id, body.status)
    if updated is None:
        raise HTTPException(status_code=404, detail="policy not found")
    _register_policy(updated, engine, classifier)
    return updated


@router.get("/{policy_id}/versions", response_model=list[PolicyVersionInfo])
def list_policy_versions(
    _: AuthDep, policy_id: str, store: StoreDep
) -> list[PolicyVersionInfo]:
    if store.get(policy_id) is None:
        raise HTTPException(status_code=404, detail="policy not found")
    return store.list_versions(policy_id)


@router.get("/{policy_id}/versions/{ver}", response_model=Any)
def get_policy_version(
    _: AuthDep, policy_id: str, ver: int, store: StoreDep
) -> StoredPolicy:
    if store.get(policy_id) is None:
        raise HTTPException(status_code=404, detail="policy not found")
    policy = store.get_version(policy_id, ver)
    if policy is None:
        raise HTTPException(status_code=404, detail="version not found")
    return policy


@router.post("/{policy_id}/versions/{ver}/activate", response_model=Any)
def activate_policy_version(
    _: AuthDep,
    policy_id: str,
    ver: int,
    store: StoreDep,
    engine: EngineDep,
    classifier: ClassifierDep,
) -> StoredPolicy:
    restored = store.activate_version(policy_id, ver)
    if restored is None:
        raise HTTPException(status_code=404, detail="policy or version not found")
    _register_policy(restored, engine, classifier)
    return restored


@router.post("/{policy_id}/diff", response_model=PolicyDiffResponse)
def diff_policy_versions(
    _: AuthDep,
    policy_id: str,
    body: PolicyDiffRequest,
    store: StoreDep,
) -> PolicyDiffResponse:
    if store.get(policy_id) is None:
        raise HTTPException(status_code=404, detail="policy not found")
    from_pol = store.get_version(policy_id, body.from_version)
    to_pol = store.get_version(policy_id, body.to_version)
    if from_pol is None or to_pol is None:
        raise HTTPException(status_code=404, detail="version not found")
    if is_classification_policy(from_pol) or is_classification_policy(to_pol):
        raise HTTPException(
            status_code=400,
            detail="policy diff is only supported for retention policies",
        )
    left = as_retention(from_pol)
    right = as_retention(to_pol)
    if left is None or right is None:
        raise HTTPException(status_code=400, detail="invalid retention policy versions")
    return PolicyDiffResponse(
        policy_id=policy_id,
        from_version=body.from_version,
        to_version=body.to_version,
        changes=diff_policies(left, right),
    )
