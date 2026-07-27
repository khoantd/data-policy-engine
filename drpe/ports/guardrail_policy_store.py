"""Guardrail policy store port."""

from __future__ import annotations

from typing import Any, Protocol

from drpe.models.guardrail_policy import GuardrailPolicy


class GuardrailPolicyStore(Protocol):
    def create(self, *, name: str, policy: dict[str, Any]) -> GuardrailPolicy: ...

    def get(self, policy_id: str) -> GuardrailPolicy | None: ...

    def update(
        self,
        policy_id: str,
        *,
        name: str | None = None,
        policy: dict[str, Any] | None = None,
    ) -> GuardrailPolicy: ...

    def delete(self, policy_id: str) -> bool: ...

    def list_policies(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
    ) -> list[GuardrailPolicy]: ...
