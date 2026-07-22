"""In-memory TTL store for reversible mask mappings (never persisted)."""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass
from threading import Lock
from typing import Any


@dataclass(frozen=True)
class MappingEntry:
    mapping: dict[str, str]
    expires_at: float


class MappingStore:
    """Thread-safe in-process mapping cache keyed by opaque tokens."""

    def __init__(self, ttl_seconds: int = 300) -> None:
        self._ttl_seconds = ttl_seconds
        self._entries: dict[str, MappingEntry] = {}
        self._lock = Lock()

    def issue(self, mapping: dict[str, str]) -> str:
        self._purge_expired()
        token = uuid.uuid4().hex
        expires_at = time.monotonic() + self._ttl_seconds
        with self._lock:
            self._entries[token] = MappingEntry(mapping=mapping, expires_at=expires_at)
        return token

    def consume(self, token: str) -> dict[str, str] | None:
        """Return mapping and delete token (single-use)."""
        self._purge_expired()
        with self._lock:
            entry = self._entries.pop(token, None)
        if entry is None:
            return None
        if time.monotonic() > entry.expires_at:
            return None
        return entry.mapping

    def peek(self, token: str) -> dict[str, str] | None:
        """Return mapping without deleting (for multi-step unmask within one request)."""
        self._purge_expired()
        with self._lock:
            entry = self._entries.get(token)
        if entry is None:
            return None
        if time.monotonic() > entry.expires_at:
            with self._lock:
                self._entries.pop(token, None)
            return None
        return entry.mapping

    def delete(self, token: str) -> None:
        with self._lock:
            self._entries.pop(token, None)

    def _purge_expired(self) -> None:
        now = time.monotonic()
        with self._lock:
            expired = [k for k, v in self._entries.items() if now > v.expires_at]
            for key in expired:
                del self._entries[key]


_store: MappingStore | None = None


def get_mapping_store(ttl_seconds: int = 300) -> MappingStore:
    global _store
    if _store is None or _store._ttl_seconds != ttl_seconds:
        _store = MappingStore(ttl_seconds=ttl_seconds)
    return _store


def count_entities(mapping: dict[str, Any]) -> int:
    return len(mapping)
