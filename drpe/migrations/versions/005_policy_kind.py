"""Add policy_kind and classification columns to policies.

Revision ID: 005_policy_kind
Revises: 004_webhooks
Create Date: 2026-07-22
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "005_policy_kind"
down_revision: str | None = "004_webhooks"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"
JsonType = postgresql.JSONB(astext_type=sa.Text())


def upgrade() -> None:
    op.add_column(
        "policies",
        sa.Column(
            "policy_kind",
            sa.String(length=32),
            nullable=False,
            server_default="retention",
        ),
        schema=SCHEMA,
    )
    op.add_column(
        "policies",
        sa.Column("entities", JsonType, nullable=True),
        schema=SCHEMA,
    )
    op.add_column(
        "policies",
        sa.Column("text_fields", JsonType, nullable=True),
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_column("policies", "text_fields", schema=SCHEMA)
    op.drop_column("policies", "entities", schema=SCHEMA)
    op.drop_column("policies", "policy_kind", schema=SCHEMA)
