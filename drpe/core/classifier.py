"""Hybrid PII / sensitive data classification engine."""

from __future__ import annotations

import re
import uuid
from collections.abc import Callable
from datetime import datetime, timezone
from typing import Any

from drpe.core.entity_catalog import resolve_catalog_entities
from drpe.core.evaluator import (
    evaluate_condition_group,
    get_field,
    policy_in_scope,
    policy_is_active,
)
from drpe.core.jurisdictions import jurisdiction_applies
from drpe.models.classification_policy import (
    ClassificationDiagnostics,
    ClassificationEntity,
    ClassificationPolicy,
    ClassificationPolicyScopeSummary,
    ClassificationRequest,
    ClassificationResponse,
    ClassificationResultDetail,
    ClassificationRule,
    DetectedEntity,
)
from drpe.models.enums import (
    ClassificationAction,
    DataClassification,
    PolicyStatus,
    Sensitivity,
)
from drpe.privacy.masker import is_privalyse_available

_CLASSIFICATION_RANK: dict[DataClassification, int] = {
    DataClassification.PUBLIC: 0,
    DataClassification.OPERATIONAL: 1,
    DataClassification.FINANCIAL: 2,
    DataClassification.PII: 3,
    DataClassification.SPII: 4,
}

_SENSITIVITY_RANK: dict[Sensitivity, int] = {
    Sensitivity.LOW: 0,
    Sensitivity.MEDIUM: 1,
    Sensitivity.HIGH: 2,
    Sensitivity.CRITICAL: 3,
}

_PRIVACY_ENTITY_MAP: dict[str, str] = {
    "EMAIL": "email",
    "PHONE": "phone",
    "PERSON": "person_name",
    "LOCATION": "address",
    "CREDIT_CARD": "payment_card",
    "SSN": "national_id",
    "IP_ADDRESS": "ip_address",
    "DATE": "date",
    "ORG": "organization",
}


def _iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _redact_snippet(value: str, max_len: int = 24) -> str:
    text = str(value).strip()
    if len(text) <= 4:
        return "***"
    return f"{text[:2]}…{text[-2:]}"[:max_len]


def _iter_metadata_paths(
    metadata: dict[str, Any],
    prefix: str = "",
) -> list[tuple[str, Any]]:
    paths: list[tuple[str, Any]] = []
    for key, value in metadata.items():
        path = f"{prefix}.{key}" if prefix else key
        paths.append((path, value))
        if isinstance(value, dict):
            paths.extend(_iter_metadata_paths(value, path))
    return paths


def _field_name_matches(path: str, names: list[str]) -> bool:
    lowered_path = path.lower()
    leaf = lowered_path.rsplit(".", 1)[-1]
    for name in names:
        candidate = name.lower()
        if candidate == leaf or candidate == lowered_path:
            return True
    return False


def _detect_by_field_names(
    entity: ClassificationEntity,
    metadata: dict[str, Any],
) -> list[DetectedEntity]:
    if not entity.detection.field_names:
        return []
    hits: list[DetectedEntity] = []
    for path, value in _iter_metadata_paths(metadata):
        if value is None or value == "":
            continue
        if not _field_name_matches(path, entity.detection.field_names):
            continue
        snippet = _redact_snippet(value) if isinstance(value, str) else None
        hits.append(
            DetectedEntity(
                entity_id=entity.id,
                label=entity.label,
                field=path,
                classification=entity.classification,
                sensitivity=entity.sensitivity,
                confidence="definitive",
                snippet=snippet,
                detector="field_name",
                regulatory_refs=entity.regulatory_refs,
            )
        )
    return hits


def _detect_by_regex(
    entity: ClassificationEntity,
    metadata: dict[str, Any],
) -> list[DetectedEntity]:
    pattern = entity.detection.regex
    if not pattern:
        return []
    try:
        compiled = re.compile(pattern)
    except re.error:
        return []
    hits: list[DetectedEntity] = []
    for path, value in _iter_metadata_paths(metadata):
        if not isinstance(value, str) or not value:
            continue
        if not compiled.search(value):
            continue
        hits.append(
            DetectedEntity(
                entity_id=entity.id,
                label=entity.label,
                field=path,
                classification=entity.classification,
                sensitivity=entity.sensitivity,
                confidence="definitive",
                snippet=_redact_snippet(value),
                detector="regex",
                regulatory_refs=entity.regulatory_refs,
            )
        )
    return hits


def _collect_text_values(
    metadata: dict[str, Any],
    text_fields: list[str],
) -> list[tuple[str, str]]:
    values: list[tuple[str, str]] = []
    for field in text_fields:
        raw = get_field(metadata, field)
        if isinstance(raw, str) and raw.strip():
            values.append((field, raw))
    if not text_fields:
        for path, value in _iter_metadata_paths(metadata):
            if isinstance(value, str) and len(value.strip()) > 8:
                values.append((path, value))
    return values


def _detect_by_ner(
    entity: ClassificationEntity,
    metadata: dict[str, Any],
    text_fields: list[str],
) -> list[DetectedEntity]:
    if not entity.detection.ner_types or not is_privalyse_available():
        return []
    from drpe.privacy.masker import get_masker

    masker = get_masker()
    hits: list[DetectedEntity] = []
    wanted = {t.upper() for t in entity.detection.ner_types}
    for path, text in _collect_text_values(metadata, text_fields):
        try:
            masked, mapping = masker.mask(text)
        except Exception:
            continue
        entities = mapping.get("entities", mapping) if isinstance(mapping, dict) else {}
        if not isinstance(entities, dict):
            continue
        for ent_type, spans in entities.items():
            normalized = str(ent_type).upper()
            if normalized not in wanted:
                continue
            if not spans:
                continue
            hits.append(
                DetectedEntity(
                    entity_id=entity.id,
                    label=entity.label,
                    field=path,
                    classification=entity.classification,
                    sensitivity=entity.sensitivity,
                    confidence="partial",
                    snippet=_redact_snippet(text),
                    detector="ner",
                    regulatory_refs=entity.regulatory_refs,
                )
            )
            break
        _ = masked
    return hits


def _expand_entities(policy: ClassificationPolicy) -> list[ClassificationEntity]:
    expanded: list[ClassificationEntity] = list(policy.entities)
    for entity in policy.entities:
        if entity.detection.catalog_ref:
            expanded.extend(
                resolve_catalog_entities(entity.detection.catalog_ref, policy.jurisdiction)
            )
    return expanded


def detect_entities(
    policy: ClassificationPolicy,
    metadata: dict[str, Any],
    *,
    text_fields: list[str] | None = None,
) -> list[DetectedEntity]:
    fields = text_fields if text_fields is not None else policy.text_fields
    seen: set[tuple[str, str, str]] = set()
    hits: list[DetectedEntity] = []
    for entity in _expand_entities(policy):
        for detector in (
            _detect_by_field_names,
            _detect_by_regex,
            lambda e, m: _detect_by_ner(e, m, fields),
        ):
            for hit in detector(entity, metadata):
                key = (hit.entity_id, hit.field, hit.detector)
                if key in seen:
                    continue
                seen.add(key)
                hits.append(hit)
    return hits


def _max_classification(entities: list[DetectedEntity]) -> DataClassification | None:
    if not entities:
        return None
    return max(
        (e.classification for e in entities),
        key=lambda c: _CLASSIFICATION_RANK[c],
    )


def _max_sensitivity(entities: list[DetectedEntity]) -> Sensitivity | None:
    if not entities:
        return None
    return max(
        (e.sensitivity for e in entities),
        key=lambda s: _SENSITIVITY_RANK[s],
    )


def _synthetic_metadata(entities: list[DetectedEntity]) -> dict[str, Any]:
    return {
        "_max_classification": _max_classification(entities),
        "_max_sensitivity": _max_sensitivity(entities),
        "_entity_count": len(entities),
        "_has_spii": any(e.classification == DataClassification.SPII for e in entities),
        "_has_pii": any(e.classification == DataClassification.PII for e in entities),
    }


def _classification_in_scope(
    policy: ClassificationPolicy,
    request: ClassificationRequest,
) -> bool:
    eval_request = type(
        "EvalReq",
        (),
        {
            "data_type": request.data_type,
            "source": request.source,
            "metadata": request.metadata,
        },
    )()
    return policy_in_scope(policy, eval_request)  # type: ignore[arg-type]


def _policy_scope_summary(
    policy: ClassificationPolicy,
) -> ClassificationPolicyScopeSummary:
    exclude = policy.scope.exclude
    return ClassificationPolicyScopeSummary(
        jurisdiction=policy.jurisdiction,
        data_types=list(policy.scope.data_types),
        sources=list(policy.scope.sources),
        excluded_data_types=list(exclude.data_types) if exclude else [],
        excluded_sources=list(exclude.sources) if exclude else [],
    )


def _out_of_scope_reason(
    policy: ClassificationPolicy,
    request: ClassificationRequest,
) -> str:
    if not jurisdiction_applies(policy.jurisdiction, request.jurisdiction):
        return "jurisdiction"
    scope = policy.scope
    if scope.exclude and request.data_type in scope.exclude.data_types:
        return "data_type"
    if scope.exclude and request.source and request.source in scope.exclude.sources:
        return "source"
    if scope.data_types and request.data_type not in scope.data_types:
        return "data_type"
    if scope.sources and request.source and request.source not in scope.sources:
        return "source"
    return "none"


def _find_matching_rule(
    policy: ClassificationPolicy,
    metadata: dict[str, Any],
    *,
    now: datetime | None = None,
) -> ClassificationRule | None:
    synthetic = _synthetic_metadata([])
    synthetic.update(metadata)
    matches: list[ClassificationRule] = []
    for rule in sorted(policy.rules, key=lambda r: r.priority):
        if evaluate_condition_group(rule.condition, synthetic, now=now):
            matches.append(rule)
    if not matches:
        return None
    return min(matches, key=lambda r: r.priority)


def classify(
    request: ClassificationRequest,
    policies: list[ClassificationPolicy],
    *,
    now: datetime | None = None,
    dry_run: bool = False,
) -> ClassificationResponse:
    classified_at = now or datetime.now(timezone.utc)
    if classified_at.tzinfo is None:
        classified_at = classified_at.replace(tzinfo=timezone.utc)

    active = [
        p
        for p in policies
        if policy_is_active(p) and p.status == PolicyStatus.ACTIVE
    ]
    if request.policy_id:
        active = [p for p in active if p.id == request.policy_id]

    all_hits: list[DetectedEntity] = []
    matched_policy: ClassificationPolicy | None = None
    applicable: list[ClassificationPolicy] = []
    selected_policy = (
        next((p for p in active if p.id == request.policy_id), None)
        if request.policy_id
        else None
    )
    for policy in active:
        if not jurisdiction_applies(policy.jurisdiction, request.jurisdiction):
            continue
        if not _classification_in_scope(policy, request):
            continue
        applicable.append(policy)

    for policy in applicable:
        hits = detect_entities(
            policy,
            request.metadata,
            text_fields=request.text_fields,
        )
        matched_policy = policy
        all_hits = hits
        if hits:
            break

    if matched_policy is None and applicable:
        matched_policy = applicable[0]
        all_hits = detect_entities(
            matched_policy,
            request.metadata,
            text_fields=request.text_fields,
        )

    synthetic = _synthetic_metadata(all_hits)
    rule: ClassificationRule | None = None
    if matched_policy is not None:
        rule = _find_matching_rule(matched_policy, synthetic, now=classified_at)

    target_policy = selected_policy or matched_policy or (applicable[0] if applicable else None)
    diagnostics = ClassificationDiagnostics(
        applicable_policy_count=len(applicable),
        selected_policy_applied=(
            selected_policy is not None
            and any(policy.id == selected_policy.id for policy in applicable)
        ),
        out_of_scope_reason=(
            _out_of_scope_reason(selected_policy, request)
            if selected_policy is not None
            else "none"
        ),
        policy_scope_summary=(
            _policy_scope_summary(target_policy) if target_policy is not None else None
        ),
    )

    if rule is None:
        action = (
            ClassificationAction.ALLOW
            if not all_hits
            else ClassificationAction.FLAG
        )
        handling = None
        policy_id = matched_policy.id if matched_policy else None
        policy_version = matched_policy.version if matched_policy else None
        rule_id = None
    else:
        action = rule.action
        handling = rule.handling
        policy_id = matched_policy.id if matched_policy else None
        policy_version = matched_policy.version if matched_policy else None
        rule_id = rule.id

    classification_id = f"cls_{uuid.uuid4().hex[:12]}"
    audit_ref = None if dry_run else f"aud_{uuid.uuid4().hex[:12]}"

    return ClassificationResponse(
        record_id=request.record_id,
        classification_id=classification_id,
        detected_entities=all_hits,
        result=ClassificationResultDetail(
            action=action,
            handling=handling,
            matched_policy=policy_id,
            matched_rule=rule_id,
            policy_version=policy_version,
            max_classification=_max_classification(all_hits),
            max_sensitivity=_max_sensitivity(all_hits),
        ),
        diagnostics=diagnostics,
        jurisdiction_applied=request.jurisdiction
        or (matched_policy.jurisdiction if matched_policy else None),
        classified_at=_iso(classified_at),
        audit_ref=audit_ref,
    )


def classify_batch(
    requests: list[ClassificationRequest],
    policies: list[ClassificationPolicy],
    *,
    now: datetime | None = None,
    dry_run: bool = False,
) -> list[ClassificationResponse]:
    return [
        classify(req, policies, now=now, dry_run=dry_run) for req in requests
    ]


class ClassificationEngine:
    """Stateful classifier over loaded classification policies."""

    def __init__(self, policies: list[ClassificationPolicy] | None = None) -> None:
        self.policies: list[ClassificationPolicy] = list(policies or [])
        self.on_before_classify: Callable[[], None] | None = None
        self._cache_gen: int | None = None

    def add_policy(self, policy: ClassificationPolicy) -> None:
        self.policies = [p for p in self.policies if p.id != policy.id]
        self.policies.append(policy)

    def remove_policy(self, policy_id: str) -> None:
        self.policies = [p for p in self.policies if p.id != policy_id]

    def load_policies(self, policies: list[ClassificationPolicy]) -> None:
        self.policies = list(policies)

    def _maybe_sync(self) -> None:
        if self.on_before_classify is not None:
            self.on_before_classify()

    def classify(
        self,
        request: ClassificationRequest,
        *,
        now: datetime | None = None,
        dry_run: bool = False,
    ) -> ClassificationResponse:
        self._maybe_sync()
        return classify(request, self.policies, now=now, dry_run=dry_run)

    def classify_batch(
        self,
        requests: list[ClassificationRequest],
        *,
        now: datetime | None = None,
        dry_run: bool = False,
    ) -> list[ClassificationResponse]:
        self._maybe_sync()
        return classify_batch(requests, self.policies, now=now, dry_run=dry_run)
