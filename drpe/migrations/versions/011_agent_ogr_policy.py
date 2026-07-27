"""Add ogr_policy column for agent policies.

Revision ID: 011_agent_ogr_policy
Revises: 010_guardrail_policies
Create Date: 2026-07-27
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "011_agent_ogr_policy"
down_revision: str | None = "010_guardrail_policies"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"
JsonType = postgresql.JSONB(astext_type=sa.Text())


def upgrade() -> None:
    op.add_column(
        "policies",
        sa.Column("ogr_policy", JsonType, nullable=True),
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_column("policies", "ogr_policy", schema=SCHEMA)
