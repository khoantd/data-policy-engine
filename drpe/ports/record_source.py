"""Record source port — integrators supply records for enforcement scans."""

from __future__ import annotations

from collections.abc import Iterable
from typing import Protocol

from drpe.models.enforcement import RecordRef


class RecordSource(Protocol):
    def iter_records(
        self,
        data_type: str,
        *,
        source: str | None = None,
        cursor: str | None = None,
    ) -> Iterable[RecordRef]: ...
