"""Add grace_holds table for sticky deferred enforcement.

Revision ID: 007_grace_holds
Revises: 006_audit_requester
Create Date: 2026-07-23
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "007_grace_holds"
down_revision: str | None = "006_audit_requester"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"


def upgrade() -> None:
    op.create_table(
        "grace_holds",
        sa.Column("id", sa.String(length=255), primary_key=True),
        sa.Column("policy_id", sa.String(length=255), nullable=False),
        sa.Column("rule_id", sa.String(length=255), nullable=False),
        sa.Column("record_id", sa.String(length=255), nullable=False),
        sa.Column("data_type", sa.String(length=255), nullable=False),
        sa.Column("action", sa.String(length=64), nullable=False),
        sa.Column("grace_period_ends", sa.String(length=64), nullable=False),
        sa.Column("notify_at", sa.String(length=64), nullable=True),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("requester", sa.String(length=255), nullable=True),
        sa.Column("source_job_id", sa.String(length=255), nullable=True),
        sa.Column("evaluation_id", sa.String(length=255), nullable=True),
        sa.UniqueConstraint(
            "policy_id",
            "rule_id",
            "record_id",
            name="uq_grace_holds_policy_rule_record",
        ),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_grace_holds_status",
        "grace_holds",
        ["status"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_grace_holds_record_id",
        "grace_holds",
        ["record_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_grace_holds_policy_id",
        "grace_holds",
        ["policy_id"],
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_index("ix_grace_holds_policy_id", table_name="grace_holds", schema=SCHEMA)
    op.drop_index("ix_grace_holds_record_id", table_name="grace_holds", schema=SCHEMA)
    op.drop_index("ix_grace_holds_status", table_name="grace_holds", schema=SCHEMA)
    op.drop_table("grace_holds", schema=SCHEMA)
