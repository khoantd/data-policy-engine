"""SQLAlchemy declarative base and schema name."""

from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase

SCHEMA = "drpe"


class Base(DeclarativeBase):
    """Shared declarative base for DRPE ORM models."""
