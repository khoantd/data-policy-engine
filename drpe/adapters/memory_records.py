"""In-memory RecordSource for tests and local demos."""

from __future__ import annotations

from collections.abc import Iterable

from drpe.models.enforcement import RecordRef


class InMemoryRecordSource:
    def __init__(self, records: list[RecordRef] | None = None) -> None:
        self._records: list[RecordRef] = list(records or [])

    def add(self, record: RecordRef) -> None:
        self._records.append(record)

    def clear(self) -> None:
        self._records.clear()

    def iter_records(
        self,
        data_type: str,
        *,
        source: str | None = None,
        cursor: str | None = None,
    ) -> Iterable[RecordRef]:
        del cursor  # pagination not implemented for in-memory source
        for rec in self._records:
            if rec.data_type != data_type:
                continue
            if source is not None and rec.source is not None and rec.source != source:
                continue
            yield rec
