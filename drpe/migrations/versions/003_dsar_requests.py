"""Add dsar_requests table.

Revision ID: 003_dsar_requests
Revises: 002_enforcement_audit
Create Date: 2026-07-22
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "003_dsar_requests"
down_revision: str | None = "002_enforcement_audit"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"


def upgrade() -> None:
    op.create_table(
        "dsar_requests",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("subject_id", sa.String(length=255), nullable=False),
        sa.Column("policy_id", sa.String(length=255), nullable=False),
        sa.Column(
            "identity",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            "requested_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("due_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "inline_records",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            "result",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
        sa.Column("error", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_dsar_requests_type",
        "dsar_requests",
        ["type"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_dsar_requests_status",
        "dsar_requests",
        ["status"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_dsar_requests_subject_id",
        "dsar_requests",
        ["subject_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_dsar_requests_policy_id",
        "dsar_requests",
        ["policy_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_dsar_requests_requested_at",
        "dsar_requests",
        ["requested_at"],
        schema=SCHEMA,
    )

    op.execute(sa.text(f"ALTER TABLE {SCHEMA}.dsar_requests ENABLE ROW LEVEL SECURITY"))
    op.execute(
        sa.text(f"REVOKE ALL ON TABLE {SCHEMA}.dsar_requests FROM anon, authenticated")
    )


def downgrade() -> None:
    op.drop_table("dsar_requests", schema=SCHEMA)
