"""Add audit_logs and enforcement_jobs tables.

Revision ID: 002_enforcement_audit
Revises: 001_initial_drpe
Create Date: 2026-07-22
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "002_enforcement_audit"
down_revision: str | None = "001_initial_drpe"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"


def upgrade() -> None:
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("event_type", sa.String(length=64), nullable=False),
        sa.Column("policy_id", sa.String(length=255), nullable=True),
        sa.Column("rule_id", sa.String(length=255), nullable=True),
        sa.Column("record_id", sa.String(length=255), nullable=True),
        sa.Column("action", sa.String(length=64), nullable=True),
        sa.Column(
            "payload",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
        sa.Column("job_id", sa.String(length=255), nullable=True),
        sa.Column("evaluation_id", sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_logs_policy_id",
        "audit_logs",
        ["policy_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_logs_record_id",
        "audit_logs",
        ["record_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_logs_job_id",
        "audit_logs",
        ["job_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_logs_created_at",
        "audit_logs",
        ["created_at"],
        schema=SCHEMA,
    )

    op.create_table(
        "enforcement_jobs",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column("policy_id", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("trigger", sa.String(length=64), nullable=False),
        sa.Column(
            "requested_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "progress",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column(
            "inline_records",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_enforcement_jobs_status",
        "enforcement_jobs",
        ["status"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_enforcement_jobs_policy_id",
        "enforcement_jobs",
        ["policy_id"],
        schema=SCHEMA,
    )

    op.execute(sa.text(f"ALTER TABLE {SCHEMA}.audit_logs ENABLE ROW LEVEL SECURITY"))
    op.execute(
        sa.text(f"ALTER TABLE {SCHEMA}.enforcement_jobs ENABLE ROW LEVEL SECURITY")
    )
    op.execute(
        sa.text(f"REVOKE ALL ON TABLE {SCHEMA}.audit_logs FROM anon, authenticated")
    )
    op.execute(
        sa.text(
            f"REVOKE ALL ON TABLE {SCHEMA}.enforcement_jobs FROM anon, authenticated"
        )
    )


def downgrade() -> None:
    op.drop_table("enforcement_jobs", schema=SCHEMA)
    op.drop_table("audit_logs", schema=SCHEMA)
