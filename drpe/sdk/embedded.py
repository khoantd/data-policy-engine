"""Embedded (in-process) policy evaluator — no network required."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from drpe.core.classifier import ClassificationEngine
from drpe.core.evaluator import PolicyEvaluatorEngine
from drpe.dsl.parser import parse_directory, parse_yaml
from drpe.models.classification_policy import (
    ClassificationPolicy,
    ClassificationRequest,
    ClassificationResponse,
)
from drpe.models.policy import EvaluationRequest, EvaluationResponse, Policy
from drpe.models.stored_policy import as_classification, as_retention


class PolicyEvaluator:
    """Load policies locally and evaluate/classify without a remote API."""

    def __init__(
        self,
        policies: list[Policy] | None = None,
        classification_policies: list[ClassificationPolicy] | None = None,
    ) -> None:
        self._engine = PolicyEvaluatorEngine(policies)
        self._classifier = ClassificationEngine(classification_policies)

    @classmethod
    def from_directory(cls, directory: str | Path) -> PolicyEvaluator:
        stored = parse_directory(directory)
        retention = [p for item in stored if (p := as_retention(item)) is not None]
        classification = [
            p for item in stored if (p := as_classification(item)) is not None
        ]
        return cls(retention, classification)

    @classmethod
    def from_yaml(cls, yaml_content: str) -> PolicyEvaluator:
        stored = parse_yaml(yaml_content)
        retention = as_retention(stored)
        classification = as_classification(stored)
        return cls(
            [retention] if retention is not None else [],
            [classification] if classification is not None else [],
        )

    @classmethod
    def from_policies(
        cls,
        policies: list[Policy],
        classification_policies: list[ClassificationPolicy] | None = None,
    ) -> PolicyEvaluator:
        return cls(policies, classification_policies)

    @property
    def policies(self) -> list[Policy]:
        return list(self._engine.policies)

    @property
    def classification_policies(self) -> list[ClassificationPolicy]:
        return list(self._classifier.policies)

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

    def classify(
        self,
        request: ClassificationRequest | None = None,
        *,
        data_type: str | None = None,
        record_id: str = "unknown",
        metadata: dict[str, Any] | None = None,
        source: str | None = None,
        jurisdiction: str | None = None,
        text_fields: list[str] | None = None,
        policy_id: str | None = None,
        dry_run: bool = False,
    ) -> ClassificationResponse:
        if request is None:
            if data_type is None:
                raise ValueError("data_type is required when request is omitted")
            request = ClassificationRequest(
                data_type=data_type,
                record_id=record_id,
                metadata=metadata or {},
                source=source,
                jurisdiction=jurisdiction,
                text_fields=text_fields,
                policy_id=policy_id,
            )
        return self._classifier.classify(request, dry_run=dry_run)

    def classify_dry_run(
        self,
        request: ClassificationRequest | None = None,
        *,
        data_type: str | None = None,
        record_id: str = "unknown",
        metadata: dict[str, Any] | None = None,
        source: str | None = None,
        jurisdiction: str | None = None,
        text_fields: list[str] | None = None,
        policy_id: str | None = None,
    ) -> ClassificationResponse:
        return self.classify(
            request,
            data_type=data_type,
            record_id=record_id,
            metadata=metadata,
            source=source,
            jurisdiction=jurisdiction,
            text_fields=text_fields,
            policy_id=policy_id,
            dry_run=True,
        )

    def classify_batch(
        self,
        records: list[ClassificationRequest | dict[str, Any]],
        *,
        dry_run: bool = False,
    ) -> list[ClassificationResponse]:
        requests: list[ClassificationRequest] = []
        for rec in records:
            if isinstance(rec, ClassificationRequest):
                requests.append(rec)
            else:
                requests.append(ClassificationRequest.model_validate(rec))
        return self._classifier.classify_batch(requests, dry_run=dry_run)
