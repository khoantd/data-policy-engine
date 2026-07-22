"""SQLAlchemy-backed PolicyStore adapter (Postgres / SQLite)."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, sessionmaker

from drpe.db.models import PolicyRow, PolicyVersionRow
from drpe.models.enums import PolicyStatus
from drpe.models.policy import Policy
from drpe.models.policy_version import PolicyVersionInfo
from drpe.models.serialization import (
    row_to_stored_policy,
    snapshot_to_stored_policy,
    stored_policy_to_columns,
)
from drpe.models.stored_policy import StoredPolicy, as_retention


class SqlAlchemyPolicyStore:
    """PolicyStore using SQLAlchemy sessions."""

    def __init__(self, session_factory: sessionmaker[Session]) -> None:
        self._session_factory = session_factory

    def list_policies(self, *, status: str | None = None) -> list[StoredPolicy]:
        with self._session_factory() as session:
            stmt = select(PolicyRow).order_by(PolicyRow.id)
            if status is not None:
                stmt = stmt.where(PolicyRow.status == status)
            rows = session.scalars(stmt).all()
            return [row_to_stored_policy(row) for row in rows]

    def get(self, policy_id: str) -> StoredPolicy | None:
        with self._session_factory() as session:
            row = session.get(PolicyRow, policy_id)
            return row_to_stored_policy(row) if row else None

    def upsert(self, policy: StoredPolicy) -> StoredPolicy:
        with self._session_factory() as session:
            existing = session.get(PolicyRow, policy.id)
            stored = policy
            if existing is not None and policy.version == existing.version:
                stored = policy.model_copy(update={"version": existing.version + 1})

            cols = stored_policy_to_columns(stored)
            previous_version = existing.version if existing is not None else None

            if existing is None:
                row = PolicyRow(**cols)
                session.add(row)
            else:
                for key, value in cols.items():
                    setattr(existing, key, value)
                if stored.status != PolicyStatus.DEPRECATED.value:
                    existing.deprecated_at = None
                row = existing

            if previous_version != stored.version:
                version_exists = session.get(
                    PolicyVersionRow, (stored.id, stored.version)
                )
                if version_exists is None:
                    session.add(
                        PolicyVersionRow(
                            policy_id=stored.id,
                            version=stored.version,
                            snapshot=stored.model_dump(mode="json")
                            | {"policy_kind": cols["policy_kind"]},
                        )
                    )

            session.commit()
            session.refresh(row)
            return row_to_stored_policy(row)

    def deprecate(self, policy_id: str) -> StoredPolicy | None:
        return self.set_status(policy_id, PolicyStatus.DEPRECATED)

    def set_status(self, policy_id: str, status: PolicyStatus) -> StoredPolicy | None:
        existing = self.get(policy_id)
        if existing is None:
            return None
        if existing.status == status:
            return existing
        updated = existing.model_copy(
            update={"status": status, "version": existing.version},
        )
        stored = self.upsert(updated)
        if status != PolicyStatus.DEPRECATED:
            return stored
        with self._session_factory() as session:
            row = session.get(PolicyRow, policy_id)
            if row is None:
                return None
            row.deprecated_at = datetime.now(timezone.utc)
            session.commit()
            session.refresh(row)
            return row_to_stored_policy(row)

    def load_many(self, policies: list[StoredPolicy]) -> None:
        """Seed policies without clobbering equal-or-newer DB versions."""
        for policy in policies:
            existing = self.get(policy.id)
            if existing is not None and existing.version >= policy.version:
                continue
            self.upsert(policy)

    def list_versions(self, policy_id: str) -> list[PolicyVersionInfo]:
        """Return version history metadata from immutable snapshots."""
        with self._session_factory() as session:
            stmt = (
                select(PolicyVersionRow)
                .where(PolicyVersionRow.policy_id == policy_id)
                .order_by(PolicyVersionRow.version)
            )
            rows = session.scalars(stmt).all()
            infos: list[PolicyVersionInfo] = []
            for row in rows:
                snap = row.snapshot or {}
                created = row.created_at
                if created is not None and created.tzinfo is None:
                    created = created.replace(tzinfo=timezone.utc)
                infos.append(
                    PolicyVersionInfo(
                        policy_id=row.policy_id,
                        version=row.version,
                        created_at=created,
                        name=snap.get("name"),
                        status=snap.get("status"),
                    )
                )
            return infos

    def get_version(self, policy_id: str, version: int) -> StoredPolicy | None:
        with self._session_factory() as session:
            row = session.get(PolicyVersionRow, (policy_id, version))
            if row is None or not row.snapshot:
                return None
            return snapshot_to_stored_policy(row.snapshot)

    def activate_version(self, policy_id: str, version: int) -> StoredPolicy | None:
        """Restore a historical snapshot as a new head version."""
        with self._session_factory() as session:
            head = session.get(PolicyRow, policy_id)
            snap_row = session.get(PolicyVersionRow, (policy_id, version))
            if head is None or snap_row is None or not snap_row.snapshot:
                return None

            restored = snapshot_to_stored_policy(snap_row.snapshot)
            new_version = head.version + 1
            stored = restored.model_copy(update={"version": new_version})
            cols = stored_policy_to_columns(stored)
            for key, value in cols.items():
                setattr(head, key, value)
            if stored.status != PolicyStatus.DEPRECATED.value:
                head.deprecated_at = None

            version_exists = session.get(PolicyVersionRow, (stored.id, stored.version))
            if version_exists is None:
                session.add(
                    PolicyVersionRow(
                        policy_id=stored.id,
                        version=stored.version,
                        snapshot=stored.model_dump(mode="json")
                        | {"policy_kind": cols["policy_kind"]},
                    )
                )

            session.commit()
            session.refresh(head)
            return row_to_stored_policy(head)

    def list_retention_policies(self, *, status: str | None = None) -> list[Policy]:
        result: list[Policy] = []
        for item in self.list_policies(status=status):
            retention = as_retention(item)
            if retention is not None:
                result.append(retention)
        return result

    def list_classification_policies(
        self, *, status: str | None = None
    ) -> list[Any]:
        from drpe.models.classification_policy import ClassificationPolicy

        return [
            item
            for item in self.list_policies(status=status)
            if isinstance(item, ClassificationPolicy)
        ]
