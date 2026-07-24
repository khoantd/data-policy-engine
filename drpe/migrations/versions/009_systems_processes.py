"""Add systems, processes, and policy link tables.

Revision ID: 009_systems_processes
Revises: 008_policy_reference_sources
Create Date: 2026-07-24
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "009_systems_processes"
down_revision: str | None = "008_policy_reference_sources"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"
JsonType = postgresql.JSONB(astext_type=sa.Text())


def upgrade() -> None:
    op.create_table(
        "systems",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=512), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("owner", sa.String(length=255), nullable=True),
        sa.Column(
            "status",
            sa.String(length=64),
            nullable=False,
            server_default=sa.text("'active'"),
        ),
        sa.Column("source_key", sa.String(length=255), nullable=True),
        sa.Column(
            "tags",
            JsonType,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
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
    op.create_index("ix_systems_status", "systems", ["status"], schema=SCHEMA)
    op.create_index(
        "ix_systems_created_at", "systems", ["created_at"], schema=SCHEMA
    )

    op.create_table(
        "processes",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=512), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("owner", sa.String(length=255), nullable=True),
        sa.Column(
            "status",
            sa.String(length=64),
            nullable=False,
            server_default=sa.text("'active'"),
        ),
        sa.Column(
            "tags",
            JsonType,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
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
    op.create_index("ix_processes_status", "processes", ["status"], schema=SCHEMA)
    op.create_index(
        "ix_processes_created_at", "processes", ["created_at"], schema=SCHEMA
    )

    op.create_table(
        "policy_system_links",
        sa.Column("policy_id", sa.String(length=255), nullable=False),
        sa.Column("system_id", sa.String(length=255), nullable=False),
        sa.ForeignKeyConstraint(
            ["system_id"],
            [f"{SCHEMA}.systems.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("policy_id", "system_id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_policy_system_links_system_id",
        "policy_system_links",
        ["system_id"],
        schema=SCHEMA,
    )

    op.create_table(
        "policy_process_links",
        sa.Column("policy_id", sa.String(length=255), nullable=False),
        sa.Column("process_id", sa.String(length=255), nullable=False),
        sa.ForeignKeyConstraint(
            ["process_id"],
            [f"{SCHEMA}.processes.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("policy_id", "process_id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_policy_process_links_process_id",
        "policy_process_links",
        ["process_id"],
        schema=SCHEMA,
    )

    for table in (
        "systems",
        "processes",
        "policy_system_links",
        "policy_process_links",
    ):
        op.execute(
            sa.text(f"ALTER TABLE {SCHEMA}.{table} ENABLE ROW LEVEL SECURITY")
        )
        op.execute(
            sa.text(
                f"REVOKE ALL ON TABLE {SCHEMA}.{table} FROM anon, authenticated"
            )
        )


def downgrade() -> None:
    op.drop_table("policy_process_links", schema=SCHEMA)
    op.drop_table("policy_system_links", schema=SCHEMA)
    op.drop_table("processes", schema=SCHEMA)
    op.drop_table("systems", schema=SCHEMA)
