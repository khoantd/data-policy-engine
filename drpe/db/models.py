"""ORM models for policy persistence."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from drpe.db.base import SCHEMA, Base
from drpe.models.enums import PolicyKind

JsonType = JSON().with_variant(JSONB(), "postgresql")


class PolicyRow(Base):
    __tablename__ = "policies"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    name: Mapped[str] = mapped_column(String(512), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="draft")
    jurisdiction: Mapped[str] = mapped_column(String(128), nullable=False)
    data_classification: Mapped[str] = mapped_column(String(64), nullable=False)
    policy_kind: Mapped[str] = mapped_column(
        String(32), nullable=False, default=PolicyKind.RETENTION.value
    )
    owner: Mapped[str | None] = mapped_column(String(255), nullable=True)
    effective_from: Mapped[str | None] = mapped_column(Text, nullable=True)
    expires_at: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[list[Any]] = mapped_column(JsonType, nullable=False, default=list)
    scope: Mapped[dict[str, Any]] = mapped_column(JsonType, nullable=False, default=dict)
    rules: Mapped[list[Any]] = mapped_column(JsonType, nullable=False)
    entities: Mapped[list[Any] | None] = mapped_column(JsonType, nullable=True)
    text_fields: Mapped[list[Any] | None] = mapped_column(JsonType, nullable=True)
    dsar: Mapped[dict[str, Any] | None] = mapped_column(JsonType, nullable=True)
    audit: Mapped[dict[str, Any] | None] = mapped_column(JsonType, nullable=True)
    reference_sources: Mapped[list[Any]] = mapped_column(
        JsonType, nullable=False, default=list
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    deprecated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    versions: Mapped[list[PolicyVersionRow]] = relationship(
        back_populates="policy",
        cascade="all, delete-orphan",
        order_by="PolicyVersionRow.version",
    )


class PolicyVersionRow(Base):
    __tablename__ = "policy_versions"
    __table_args__ = {"schema": SCHEMA}

    policy_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey(f"{SCHEMA}.policies.id", ondelete="CASCADE"),
        primary_key=True,
    )
    version: Mapped[int] = mapped_column(Integer, primary_key=True)
    snapshot: Mapped[dict[str, Any]] = mapped_column(JsonType, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    policy: Mapped[PolicyRow] = relationship(back_populates="versions")


class AuditLogRow(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)
    policy_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rule_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    record_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    action: Mapped[str | None] = mapped_column(String(64), nullable=True)
    payload: Mapped[dict[str, Any]] = mapped_column(JsonType, nullable=False, default=dict)
    job_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    evaluation_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    requester: Mapped[str | None] = mapped_column(String(255), nullable=True)


class EnforcementJobRow(Base):
    __tablename__ = "enforcement_jobs"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    policy_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="queued")
    trigger: Mapped[str] = mapped_column(String(64), nullable=False, default="api")
    requested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    finished_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    progress: Mapped[dict[str, Any]] = mapped_column(
        JsonType, nullable=False, default=dict
    )
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    inline_records: Mapped[list[Any] | None] = mapped_column(JsonType, nullable=True)


class DsarRequestRow(Base):
    __tablename__ = "dsar_requests"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    type: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="received")
    subject_id: Mapped[str] = mapped_column(String(255), nullable=False)
    policy_id: Mapped[str] = mapped_column(String(255), nullable=False)
    identity: Mapped[dict[str, Any] | None] = mapped_column(JsonType, nullable=True)
    requested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    due_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    inline_records: Mapped[list[Any] | None] = mapped_column(JsonType, nullable=True)
    result: Mapped[dict[str, Any]] = mapped_column(
        JsonType, nullable=False, default=dict
    )
    error: Mapped[str | None] = mapped_column(Text, nullable=True)


class WebhookRow(Base):
    __tablename__ = "webhooks"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    events: Mapped[list[Any]] = mapped_column(JsonType, nullable=False, default=list)
    secret: Mapped[str | None] = mapped_column(Text, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class GraceHoldRow(Base):
    __tablename__ = "grace_holds"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    policy_id: Mapped[str] = mapped_column(String(255), nullable=False)
    rule_id: Mapped[str] = mapped_column(String(255), nullable=False)
    record_id: Mapped[str] = mapped_column(String(255), nullable=False)
    data_type: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    grace_period_ends: Mapped[str] = mapped_column(String(64), nullable=False)
    notify_at: Mapped[str | None] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    closed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    requester: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source_job_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    evaluation_id: Mapped[str | None] = mapped_column(String(255), nullable=True)


class SystemRow(Base):
    __tablename__ = "systems"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    name: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    owner: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="active")
    source_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tags: Mapped[list[Any]] = mapped_column(JsonType, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class ProcessRow(Base):
    __tablename__ = "processes"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    name: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    owner: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="active")
    tags: Mapped[list[Any]] = mapped_column(JsonType, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class PolicySystemLinkRow(Base):
    __tablename__ = "policy_system_links"
    __table_args__ = {"schema": SCHEMA}

    policy_id: Mapped[str] = mapped_column(String(255), primary_key=True)
    system_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey(f"{SCHEMA}.systems.id", ondelete="CASCADE"),
        primary_key=True,
    )


class PolicyProcessLinkRow(Base):
    __tablename__ = "policy_process_links"
    __table_args__ = {"schema": SCHEMA}

    policy_id: Mapped[str] = mapped_column(String(255), primary_key=True)
    process_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey(f"{SCHEMA}.processes.id", ondelete="CASCADE"),
        primary_key=True,
    )
