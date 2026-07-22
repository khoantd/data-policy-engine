"""Initial DRPE schema: policies + policy_versions with RLS.

Revision ID: 001_initial_drpe
Revises:
Create Date: 2026-07-22
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001_initial_drpe"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "drpe"


def upgrade() -> None:
    op.execute(sa.text(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}"))

    op.create_table(
        "policies",
        sa.Column("id", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=512), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("jurisdiction", sa.String(length=128), nullable=False),
        sa.Column("data_classification", sa.String(length=64), nullable=False),
        sa.Column("owner", sa.String(length=255), nullable=True),
        sa.Column("effective_from", sa.Text(), nullable=True),
        sa.Column("expires_at", sa.Text(), nullable=True),
        sa.Column(
            "tags",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "scope",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
        sa.Column("rules", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("dsar", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("audit", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
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
        sa.Column("deprecated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )

    op.create_table(
        "policy_versions",
        sa.Column("policy_id", sa.String(length=255), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("snapshot", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["policy_id"],
            [f"{SCHEMA}.policies.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("policy_id", "version"),
        schema=SCHEMA,
    )

    # RLS on; no policies for anon/authenticated → deny by default via Data API
    op.execute(sa.text(f"ALTER TABLE {SCHEMA}.policies ENABLE ROW LEVEL SECURITY"))
    op.execute(
        sa.text(f"ALTER TABLE {SCHEMA}.policy_versions ENABLE ROW LEVEL SECURITY")
    )
    # Revoke Data API roles from private schema tables (defense in depth)
    op.execute(sa.text(f"REVOKE ALL ON ALL TABLES IN SCHEMA {SCHEMA} FROM anon, authenticated"))
    op.execute(sa.text(f"REVOKE USAGE ON SCHEMA {SCHEMA} FROM anon, authenticated"))
    # Alembic may create version table in this schema; harden if present after first run
    op.execute(
        sa.text(
            f"""
            DO $$
            BEGIN
              IF EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = '{SCHEMA}' AND table_name = 'alembic_version'
              ) THEN
                EXECUTE 'ALTER TABLE {SCHEMA}.alembic_version ENABLE ROW LEVEL SECURITY';
                EXECUTE 'REVOKE ALL ON TABLE {SCHEMA}.alembic_version FROM anon, authenticated';
              END IF;
            END $$;
            """
        )
    )


def downgrade() -> None:
    op.drop_table("policy_versions", schema=SCHEMA)
    op.drop_table("policies", schema=SCHEMA)
    op.execute(sa.text(f"DROP SCHEMA IF EXISTS {SCHEMA} CASCADE"))
