"""Tests for in-memory and SQLAlchemy catalog stores."""

from __future__ import annotations

import pytest
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from drpe.adapters.memory_catalog import InMemoryCatalogStore
from drpe.adapters.sqlalchemy_catalog import SqlAlchemyCatalogStore
from drpe.db.base import SCHEMA, Base
from drpe.db.models import (  # noqa: F401
    PolicyProcessLinkRow,
    PolicySystemLinkRow,
    ProcessRow,
    SystemRow,
)
from drpe.models.system import CatalogStatus


@pytest.fixture
def session_factory() -> sessionmaker:  # type: ignore[type-arg]
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def _attach_schema(dbapi_conn, _connection_record):  # type: ignore[no-untyped-def]
        dbapi_conn.execute(f"ATTACH DATABASE ':memory:' AS {SCHEMA}")

    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        conn.commit()

    Base.metadata.create_all(engine)
    return sessionmaker(
        bind=engine, autoflush=False, autocommit=False, expire_on_commit=False
    )


def _exercise_store(store: InMemoryCatalogStore | SqlAlchemyCatalogStore) -> None:
    system = store.create_system(
        name="CRM",
        description="Customer CRM",
        owner="ops",
        source_key="crm_system",
        tags=["prod"],
    )
    assert system.id.startswith("sys_")
    assert system.name == "CRM"
    assert system.source_key == "crm_system"

    process = store.create_process(
        name="Onboarding",
        description="Customer onboarding",
        owner="compliance",
        tags=["gdpr"],
    )
    assert process.id.startswith("proc_")

    fetched = store.get_system(system.id)
    assert fetched is not None
    assert fetched.name == "CRM"

    updated = store.update_system(system.id, status=CatalogStatus.RETIRED)
    assert updated.status == CatalogStatus.ACTIVE or updated.status == CatalogStatus.RETIRED
    assert updated.status == CatalogStatus.RETIRED

    systems = store.set_policy_systems("pol_a", [system.id])
    assert len(systems) == 1
    assert systems[0].id == system.id
    assert store.list_policy_ids_for_system(system.id) == ["pol_a"]

    processes = store.set_policy_processes("pol_a", [process.id])
    assert len(processes) == 1
    assert store.list_processes_for_policy("pol_a")[0].id == process.id

    store.set_system_policies(system.id, ["pol_a", "pol_b"])
    assert store.list_policy_ids_for_system(system.id) == ["pol_a", "pol_b"]

    store.clear_links_for_policy("pol_a")
    assert store.list_systems_for_policy("pol_a") == []
    assert store.list_processes_for_policy("pol_a") == []
    assert store.list_policy_ids_for_system(system.id) == ["pol_b"]

    assert store.delete_system(system.id) is True
    assert store.get_system(system.id) is None
    assert store.list_policy_ids_for_system(system.id) == []

    assert store.delete_process(process.id) is True
    assert store.get_process(process.id) is None


def test_memory_catalog_store() -> None:
    _exercise_store(InMemoryCatalogStore())


def test_sqlalchemy_catalog_store(session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
    _exercise_store(SqlAlchemyCatalogStore(session_factory))


def test_update_missing_raises() -> None:
    store = InMemoryCatalogStore()
    with pytest.raises(KeyError):
        store.update_system("sys_missing", name="x")
    with pytest.raises(KeyError):
        store.update_process("proc_missing", name="x")


def _exercise_bulk_catalog_links(
    store: InMemoryCatalogStore | SqlAlchemyCatalogStore,
) -> None:
    sys_a = store.create_system(name="CRM", source_key="crm")
    sys_b = store.create_system(name="ERP", source_key="erp")
    proc_a = store.create_process(name="Onboarding")
    proc_b = store.create_process(name="Billing")

    store.set_policy_systems("pol_a", [sys_a.id])
    store.set_policy_processes("pol_a", [proc_a.id])
    store.set_policy_systems("pol_b", [sys_b.id])
    store.set_policy_processes("pol_b", [proc_b.id])
    store.set_policy_systems("pol_c", [sys_a.id, sys_b.id])

    # Filter to a subset — pol_c omitted; unknown id omitted
    filtered = store.list_catalog_links_for_policies(["pol_a", "pol_b", "pol_missing"])
    assert set(filtered.keys()) == {"pol_a", "pol_b"}
    assert [s.id for s in filtered["pol_a"][0]] == [sys_a.id]
    assert [p.id for p in filtered["pol_a"][1]] == [proc_a.id]
    assert [s.id for s in filtered["pol_b"][0]] == [sys_b.id]
    assert [p.id for p in filtered["pol_b"][1]] == [proc_b.id]

    # Empty filter → empty result
    assert store.list_catalog_links_for_policies([]) == {}

    # None → all policies that have at least one link
    all_links = store.list_catalog_links_for_policies(None)
    assert set(all_links.keys()) == {"pol_a", "pol_b", "pol_c"}
    assert {s.id for s in all_links["pol_c"][0]} == {sys_a.id, sys_b.id}
    assert all_links["pol_c"][1] == []


def test_memory_bulk_catalog_links() -> None:
    _exercise_bulk_catalog_links(InMemoryCatalogStore())


def test_sqlalchemy_bulk_catalog_links(session_factory: sessionmaker) -> None:  # type: ignore[type-arg]
    _exercise_bulk_catalog_links(SqlAlchemyCatalogStore(session_factory))
