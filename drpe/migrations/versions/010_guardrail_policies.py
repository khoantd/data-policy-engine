"""Add guardrail_policies table for OpenGuardrails policy documents.

Revision ID: 010_guardrail_policies
Revises: 009_systems_processes
Create Date: 2026-07-27
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "010_guardrail_policies"
down_revision: str | None = "009_systems_processes"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"
JsonType = postgresql.JSONB(astext_type=sa.Text())


def upgrade() -> None:
    op.create_table(
        "guardrail_policies",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=512), nullable=False),
        sa.Column("policy", JsonType, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_guardrail_policies_created_at",
        "guardrail_policies",
        ["created_at"],
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_guardrail_policies_created_at",
        table_name="guardrail_policies",
        schema=SCHEMA,
    )
    op.drop_table("guardrail_policies", schema=SCHEMA)
