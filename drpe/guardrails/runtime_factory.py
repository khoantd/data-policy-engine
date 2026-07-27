"""Build an OGR Runtime from a deployer-owned policy document."""

from __future__ import annotations

from typing import Any


def build_runtime(policy: dict[str, Any]) -> Any:
    """Return an ``openguardrails.Runtime`` composed with DRPE detectors.

    Raises ``ImportError`` if ``openguardrails`` is not installed.
    """
    from openguardrails import Runtime
    from openguardrails.detectors.config_rules import ConfigRulesDetector

    from drpe.guardrails.detectors.drpe_data_safety import DrpeDataSafetyDetector

    config_rules = policy.get("config_rules") or {}
    detectors = [
        ConfigRulesDetector(config_rules),
        DrpeDataSafetyDetector(),
    ]
    return Runtime(detectors=detectors, policy=policy)
