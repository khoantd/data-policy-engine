"""Embedded (in-process) policy evaluator — no network required."""

from __future__ import annotations

from pathlib import Path

from drpe.core.evaluator import PolicyEvaluatorEngine
from drpe.dsl.parser import parse_directory, parse_yaml
from drpe.models.policy import EvaluationRequest, EvaluationResponse, Policy


class PolicyEvaluator:
    """Load policies locally and evaluate without a remote API."""

    def __init__(self, policies: list[Policy] | None = None) -> None:
        self._engine = PolicyEvaluatorEngine(policies)

    @classmethod
    def from_directory(cls, directory: str | Path) -> PolicyEvaluator:
        policies = parse_directory(directory)
        return cls(policies)

    @classmethod
    def from_yaml(cls, yaml_content: str) -> PolicyEvaluator:
        return cls([parse_yaml(yaml_content)])

    @classmethod
    def from_policies(cls, policies: list[Policy]) -> PolicyEvaluator:
        return cls(policies)

    @property
    def policies(self) -> list[Policy]:
        return list(self._engine.policies)

    def evaluate(
        self,
        request: EvaluationRequest | None = None,
        *,
        data_type: str | None = None,
        record_id: str = "unknown",
        metadata: dict | None = None,
        source: str | None = None,
        jurisdiction: str | None = None,
        **kwargs: object,
    ) -> EvaluationResponse:
        if request is None:
            if data_type is None:
                raise ValueError("data_type is required when request is omitted")
            request = EvaluationRequest(
                data_type=data_type,
                record_id=record_id,
                metadata=metadata or {},
                source=source,
                jurisdiction=jurisdiction,
            )
        return self._engine.evaluate(request)

    def evaluate_request(self, request: EvaluationRequest) -> EvaluationResponse:
        return self._engine.evaluate(request)
