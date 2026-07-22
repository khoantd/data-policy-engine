"""Action dispatcher port — execute retention actions on external systems."""

from __future__ import annotations

from typing import Protocol

from drpe.models.enforcement import DispatchResult, RecordRef
from drpe.models.enums import Action
from drpe.models.policy import EvaluationResponse


class ActionDispatcher(Protocol):
    def dispatch(
        self,
        action: Action,
        record: RecordRef,
        evaluation: EvaluationResponse,
    ) -> DispatchResult: ...
