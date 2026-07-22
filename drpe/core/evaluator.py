"""Core policy evaluation engine."""

from __future__ import annotations

import uuid
from collections.abc import Callable
from datetime import datetime, timezone
from typing import Any

from drpe.core.conflict import MatchCandidate, resolve_conflicts
from drpe.core.duration import parse_duration
from drpe.core.jurisdictions import jurisdiction_applies
from drpe.core.operators import evaluate_operator
from drpe.models.enums import Action
from drpe.models.policy import (
    ConditionGroup,
    EvaluationRequest,
    EvaluationResponse,
    EvaluationResultDetail,
    FieldCondition,
    Policy,
    PolicyRule,
)


def get_field(metadata: dict[str, Any], field: str) -> Any:
    """Resolve a dotted field path from metadata."""
    current: Any = metadata
    for part in field.split("."):
        if not isinstance(current, dict) or part not in current:
            return None
        current = current[part]
    return current


def evaluate_field_condition(
    condition: FieldCondition,
    metadata: dict[str, Any],
    *,
    now: datetime | None = None,
) -> bool:
    value = get_field(metadata, condition.field)
    return evaluate_operator(
        condition.operator, value, condition.value, now=now
    )


def evaluate_condition_group(
    group: ConditionGroup,
    metadata: dict[str, Any],
    *,
    now: datetime | None = None,
) -> bool:
    if group.all is not None:
        return all(
            evaluate_field_condition(c, metadata, now=now) for c in group.all
        )
    if group.any is not None:
        return any(
            evaluate_field_condition(c, metadata, now=now) for c in group.any
        )
    return False


def policy_in_scope(policy: Policy, request: EvaluationRequest) -> bool:
    scope = policy.scope
    if scope.exclude:
        if request.data_type in scope.exclude.data_types:
            return False
        if request.source and request.source in scope.exclude.sources:
            return False
    if scope.data_types and request.data_type not in scope.data_types:
        return False
    if scope.sources and request.source:
        if request.source not in scope.sources:
            return False
    return True


def policy_is_active(policy: Policy, *, now: datetime | None = None) -> bool:
    from drpe.models.enums import PolicyStatus

    if policy.status != PolicyStatus.ACTIVE:
        return False
    # effective_from / expires_at are informational for v1; status gates activation
    return True


def find_matching_rules(
    policies: list[Policy],
    request: EvaluationRequest,
    *,
    now: datetime | None = None,
) -> list[MatchCandidate]:
    matches: list[MatchCandidate] = []
    for policy in policies:
        if not policy_is_active(policy):
            continue
        if not jurisdiction_applies(policy.jurisdiction, request.jurisdiction):
            continue
        if not policy_in_scope(policy, request):
            continue
        for rule in policy.rules:
            if evaluate_condition_group(rule.condition, request.metadata, now=now):
                matches.append(MatchCandidate(policy=policy, rule=rule))
    return matches


def _iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _compute_timestamps(
    rule: PolicyRule, *, now: datetime
) -> tuple[str | None, str | None]:
    grace_ends: str | None = None
    notify_at: str | None = None
    if rule.grace_period:
        ends = now + parse_duration(rule.grace_period)
        grace_ends = _iso(ends)
        if rule.notify_before:
            notify_at = _iso(ends - parse_duration(rule.notify_before))
    elif rule.notify_before:
        notify_at = _iso(now + parse_duration(rule.notify_before))
    return grace_ends, notify_at


def evaluate(
    request: EvaluationRequest,
    policies: list[Policy],
    *,
    now: datetime | None = None,
    dry_run: bool = False,
) -> EvaluationResponse:
    """Evaluate a record against the given policies."""
    evaluated_at = now or datetime.now(timezone.utc)
    if evaluated_at.tzinfo is None:
        evaluated_at = evaluated_at.replace(tzinfo=timezone.utc)

    matches = find_matching_rules(policies, request, now=evaluated_at)
    winner, conflicts = resolve_conflicts(matches)

    evaluation_id = f"eval_{uuid.uuid4().hex[:12]}"
    audit_ref = None if dry_run else f"aud_{uuid.uuid4().hex[:12]}"

    if winner is None:
        jurisdiction = request.jurisdiction
        return EvaluationResponse(
            record_id=request.record_id,
            evaluation_id=evaluation_id,
            result=EvaluationResultDetail(
                action=Action.RETAIN,
                matched_policy=None,
                matched_rule=None,
                policy_version=None,
                confidence="none",
            ),
            conflicting_policies=[],
            jurisdiction_applied=jurisdiction,
            evaluated_at=_iso(evaluated_at),
            audit_ref=audit_ref,
        )

    grace_ends, notify_at = _compute_timestamps(winner.rule, now=evaluated_at)
    jurisdiction_applied = request.jurisdiction or winner.policy.jurisdiction

    return EvaluationResponse(
        record_id=request.record_id,
        evaluation_id=evaluation_id,
        result=EvaluationResultDetail(
            action=winner.rule.action,
            matched_policy=winner.policy.id,
            matched_rule=winner.rule.id,
            policy_version=winner.policy.version,
            grace_period_ends=grace_ends,
            notify_at=notify_at,
            requires_approval=winner.rule.requires_approval,
            confidence="definitive",
            archive_target=winner.rule.archive_target,
            retain_until=winner.rule.retain_until,
        ),
        conflicting_policies=conflicts,
        jurisdiction_applied=jurisdiction_applied,
        evaluated_at=_iso(evaluated_at),
        audit_ref=audit_ref,
    )


def evaluate_batch(
    requests: list[EvaluationRequest],
    policies: list[Policy],
    *,
    now: datetime | None = None,
    dry_run: bool = False,
) -> list[EvaluationResponse]:
    return [
        evaluate(req, policies, now=now, dry_run=dry_run) for req in requests
    ]


class PolicyEvaluatorEngine:
    """Stateful evaluator over a list of policies."""

    def __init__(self, policies: list[Policy] | None = None) -> None:
        self.policies: list[Policy] = list(policies or [])
        self.on_before_evaluate: Callable[[], None] | None = None
        self._cache_gen: int | None = None

    def add_policy(self, policy: Policy) -> None:
        self.policies = [p for p in self.policies if p.id != policy.id]
        self.policies.append(policy)

    def remove_policy(self, policy_id: str) -> None:
        self.policies = [p for p in self.policies if p.id != policy_id]

    def _maybe_sync(self) -> None:
        if self.on_before_evaluate is not None:
            self.on_before_evaluate()

    def evaluate(
        self,
        request: EvaluationRequest,
        *,
        now: datetime | None = None,
        dry_run: bool = False,
    ) -> EvaluationResponse:
        self._maybe_sync()
        return evaluate(request, self.policies, now=now, dry_run=dry_run)

    def evaluate_batch(
        self,
        requests: list[EvaluationRequest],
        *,
        now: datetime | None = None,
        dry_run: bool = False,
    ) -> list[EvaluationResponse]:
        self._maybe_sync()
        return evaluate_batch(requests, self.policies, now=now, dry_run=dry_run)
