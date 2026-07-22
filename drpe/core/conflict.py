"""Priority-based conflict resolution across matching policy rules."""

from __future__ import annotations

from dataclasses import dataclass

from drpe.models.enums import Action
from drpe.models.policy import ConflictingPolicy, Policy, PolicyRule


@dataclass
class MatchCandidate:
    policy: Policy
    rule: PolicyRule


def resolve_conflicts(matches: list[MatchCandidate]) -> tuple[MatchCandidate | None, list[ConflictingPolicy]]:
    """Pick the winning match (lowest priority number) and list conflicts.

    When multiple rules match, the lowest ``priority`` wins. Other matches are
    returned as ``conflicting_policies``.
    """
    if not matches:
        return None, []

    ordered = sorted(matches, key=lambda m: (m.rule.priority, m.policy.id, m.rule.id))
    winner = ordered[0]
    conflicts: list[ConflictingPolicy] = []
    for candidate in ordered[1:]:
        conflicts.append(
            ConflictingPolicy(
                policy_id=candidate.policy.id,
                rule_id=candidate.rule.id,
                action=candidate.rule.action,
                priority=candidate.rule.priority,
            )
        )
    return winner, conflicts


def action_rank(action: Action) -> int:
    """Optional secondary ranking — retain/legal hold conceptually strongest."""
    order = {
        Action.RETAIN: 0,
        Action.FLAG: 1,
        Action.NOTIFY: 2,
        Action.ARCHIVE: 3,
        Action.PSEUDONYMIZE: 4,
        Action.ANONYMIZE: 5,
        Action.DELETE: 6,
    }
    return order.get(action, 99)
