"""Add webhooks table.

Revision ID: 004_webhooks
Revises: 003_dsar_requests
Create Date: 2026-07-22
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "004_webhooks"
down_revision: str | None = "003_dsar_requests"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"


def upgrade() -> None:
    op.create_table(
        "webhooks",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column(
            "events",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column("secret", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
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
        "ix_webhooks_active",
        "webhooks",
        ["active"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_webhooks_created_at",
        "webhooks",
        ["created_at"],
        schema=SCHEMA,
    )

    op.execute(sa.text(f"ALTER TABLE {SCHEMA}.webhooks ENABLE ROW LEVEL SECURITY"))
    op.execute(
        sa.text(f"REVOKE ALL ON TABLE {SCHEMA}.webhooks FROM anon, authenticated")
    )


def downgrade() -> None:
    op.drop_table("webhooks", schema=SCHEMA)
