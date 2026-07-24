"""Add reference_sources column for AI research provenance.

Revision ID: 008_policy_reference_sources
Revises: 007_grace_holds
Create Date: 2026-07-24
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "008_policy_reference_sources"
down_revision: str | None = "007_grace_holds"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"
JsonType = postgresql.JSONB(astext_type=sa.Text())


def upgrade() -> None:
    op.add_column(
        "policies",
        sa.Column(
            "reference_sources",
            JsonType,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_column("policies", "reference_sources", schema=SCHEMA)
