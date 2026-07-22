"""Tests for SqlAlchemyPolicyStore (SQLite in-memory)."""

from __future__ import annotations

import pytest
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from drpe.adapters.sqlalchemy_store import SqlAlchemyPolicyStore
from drpe.db.base import SCHEMA, Base
from drpe.db.models import PolicyRow, PolicyVersionRow  # noqa: F401 — register metadata
from drpe.models.enums import Action, DataClassification, Operator, PolicyStatus
from drpe.models.policy import FieldCondition, Policy, PolicyRule, PolicyScope, ConditionGroup


def _make_policy(**overrides: object) -> Policy:
    base = {
        "id": "pol_test",
        "name": "Test Policy",
        "version": 1,
        "status": PolicyStatus.ACTIVE,
        "jurisdiction": "EU_GDPR",
        "data_classification": DataClassification.PII,
        "scope": PolicyScope(data_types=["customer_profile"]),
        "rules": [
            PolicyRule(
                id="rule_1",
                priority=100,
                condition=ConditionGroup(
                    all=[
                        FieldCondition(
                            field="status", operator=Operator.EQ, value="inactive"
                        )
                    ]
                ),
                action=Action.DELETE,
            )
        ],
    }
    base.update(overrides)
    return Policy.model_validate(base)


@pytest.fixture
def store() -> SqlAlchemyPolicyStore:
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def _attach_schema(dbapi_conn, _connection_record):  # type: ignore[no-untyped-def]
        dbapi_conn.execute(f"ATTACH DATABASE ':memory:' AS {SCHEMA}")

    # Trigger attach on first connect before create_all
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        conn.commit()

    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
    return SqlAlchemyPolicyStore(factory)


def test_upsert_get_list(store: SqlAlchemyPolicyStore) -> None:
    policy = _make_policy()
    saved = store.upsert(policy)
    assert saved.id == "pol_test"
    assert saved.version == 1

    fetched = store.get("pol_test")
    assert fetched is not None
    assert fetched.name == "Test Policy"
    assert fetched.rules[0].action == Action.DELETE

    listed = store.list_policies()
    assert len(listed) == 1
    assert listed[0].id == "pol_test"


def test_upsert_bumps_version_and_writes_history(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy(version=1))
    updated = store.upsert(_make_policy(version=1, name="Updated"))
    assert updated.version == 2
    assert updated.name == "Updated"

    versions = store.list_versions("pol_test")
    assert [v.version for v in versions] == [1, 2]
    assert versions[1].name == "Updated"


def test_get_version_and_activate_rollback(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy(version=1, name="Original"))
    store.upsert(_make_policy(version=1, name="Updated"))

    v1 = store.get_version("pol_test", 1)
    assert v1 is not None
    assert v1.name == "Original"
    assert v1.version == 1

    restored = store.activate_version("pol_test", 1)
    assert restored is not None
    assert restored.name == "Original"
    assert restored.version == 3

    versions = store.list_versions("pol_test")
    assert [v.version for v in versions] == [1, 2, 3]
    assert store.get_version("pol_test", 1) is not None
    assert store.get_version("pol_test", 2) is not None
    assert store.activate_version("missing", 1) is None
    assert store.activate_version("pol_test", 99) is None


def test_deprecate(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy())
    deprecated = store.deprecate("pol_test")
    assert deprecated is not None
    assert deprecated.status == PolicyStatus.DEPRECATED
    assert deprecated.version == 2
    assert store.deprecate("missing") is None


def test_set_status_bumps_version_and_writes_history(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy(status=PolicyStatus.DRAFT))
    published = store.set_status("pol_test", PolicyStatus.ACTIVE)
    assert published is not None
    assert published.status == PolicyStatus.ACTIVE
    assert published.version == 2

    versions = store.list_versions("pol_test")
    assert [v.version for v in versions] == [1, 2]
    assert versions[1].status == "active"


def test_set_status_reactivate_clears_deprecated_at(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy())
    store.set_status("pol_test", PolicyStatus.DEPRECATED)

    with store._session_factory() as session:
        row = session.get(PolicyRow, "pol_test")
        assert row is not None
        assert row.deprecated_at is not None

    reactivated = store.set_status("pol_test", PolicyStatus.ACTIVE)
    assert reactivated is not None
    assert reactivated.status == PolicyStatus.ACTIVE

    with store._session_factory() as session:
        row = session.get(PolicyRow, "pol_test")
        assert row is not None
        assert row.deprecated_at is None


def test_set_status_noop_when_unchanged(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy())
    same = store.set_status("pol_test", PolicyStatus.ACTIVE)
    assert same is not None
    assert same.version == 1


def test_list_filter_by_status(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy(id="pol_a", status=PolicyStatus.ACTIVE))
    store.upsert(_make_policy(id="pol_b", status=PolicyStatus.DRAFT, name="Draft"))
    active = store.list_policies(status="active")
    assert {p.id for p in active} == {"pol_a"}


def test_load_many_skips_newer_or_equal(store: SqlAlchemyPolicyStore) -> None:
    store.upsert(_make_policy(version=3, name="DB wins"))
    store.load_many([_make_policy(version=1, name="YAML old")])
    fetched = store.get("pol_test")
    assert fetched is not None
    assert fetched.version == 3
    assert fetched.name == "DB wins"
