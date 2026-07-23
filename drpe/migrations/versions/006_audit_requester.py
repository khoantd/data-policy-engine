"""Add requester column to audit_logs.

Revision ID: 006_audit_requester
Revises: 005_policy_kind
Create Date: 2026-07-23
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "006_audit_requester"
down_revision: str | None = "005_policy_kind"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"


def upgrade() -> None:
    op.add_column(
        "audit_logs",
        sa.Column("requester", sa.String(length=255), nullable=True),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_logs_requester",
        "audit_logs",
        ["requester"],
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_index("ix_audit_logs_requester", table_name="audit_logs", schema=SCHEMA)
    op.drop_column("audit_logs", "requester", schema=SCHEMA)
