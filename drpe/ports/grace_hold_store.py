"""Grace hold store port."""

from __future__ import annotations

from typing import Protocol

from drpe.models.grace_hold import GraceHold, GraceHoldCreate, GraceHoldStatus


class GraceHoldStore(Protocol):
    def create(self, entry: GraceHoldCreate) -> GraceHold: ...

    def get(self, hold_id: str) -> GraceHold | None: ...

    def get_by_key(
        self, *, policy_id: str, rule_id: str, record_id: str
    ) -> GraceHold | None: ...

    def update(self, hold: GraceHold) -> GraceHold: ...

    def delete(self, hold_id: str) -> None: ...

    def list_holds(
        self,
        *,
        status: GraceHoldStatus | None = None,
        policy_id: str | None = None,
        record_id: str | None = None,
        rule_id: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[GraceHold]: ...
