"""Shared enforcement runtime for Celery workers and API enqueue."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from drpe.adapters.action_dispatchers import (
    HttpWebhookActionDispatcher,
    LoggingActionDispatcher,
)
from drpe.adapters.http_webhook import HttpWebhookSender
from drpe.adapters.memory_audit import InMemoryAuditStore
from drpe.adapters.memory_grace_holds import InMemoryGraceHoldStore
from drpe.adapters.memory_jobs import InMemoryEnforcementJobStore
from drpe.adapters.memory_records import InMemoryRecordSource
from drpe.adapters.memory_store import InMemoryPolicyStore
from drpe.adapters.sqlalchemy_audit import SqlAlchemyAuditStore
from drpe.adapters.sqlalchemy_grace_holds import SqlAlchemyGraceHoldStore
from drpe.adapters.sqlalchemy_jobs import SqlAlchemyEnforcementJobStore
from drpe.adapters.sqlalchemy_store import SqlAlchemyPolicyStore
from drpe.api.settings import Settings
from drpe.core.enforcement import EnforcementRunner
from drpe.core.evaluator import PolicyEvaluatorEngine
from drpe.db.session import create_db_engine, create_session_factory
from drpe.ports.action_dispatcher import ActionDispatcher
from drpe.ports.audit_store import AuditStore
from drpe.ports.grace_hold_store import GraceHoldStore
from drpe.ports.job_store import EnforcementJobStore
from drpe.ports.policy_store import PolicyStore
from drpe.ports.record_source import RecordSource


@dataclass
class EnforcementRuntime:
    settings: Settings
    policy_store: PolicyStore
    engine: PolicyEvaluatorEngine
    job_store: EnforcementJobStore
    audit_store: AuditStore
    dispatcher: ActionDispatcher
    record_source: RecordSource
    grace_hold_store: GraceHoldStore
    runner: EnforcementRunner


_runtime: EnforcementRuntime | None = None


def build_dispatcher(settings: Settings) -> ActionDispatcher:
    if settings.drpe_webhook_url:
        return HttpWebhookActionDispatcher(HttpWebhookSender(settings.drpe_webhook_url))
    return LoggingActionDispatcher()


def build_runtime(
    settings: Settings | None = None,
    *,
    policy_store: PolicyStore | None = None,
    engine: PolicyEvaluatorEngine | None = None,
    job_store: EnforcementJobStore | None = None,
    audit_store: AuditStore | None = None,
    dispatcher: ActionDispatcher | None = None,
    record_source: RecordSource | None = None,
    grace_hold_store: GraceHoldStore | None = None,
) -> EnforcementRuntime:
    settings = settings or Settings()

    if (
        policy_store is None
        or job_store is None
        or audit_store is None
        or grace_hold_store is None
    ):
        if settings.database_url:
            db_engine = create_db_engine(settings.database_url)
            session_factory = create_session_factory(db_engine)
            policy_store = policy_store or SqlAlchemyPolicyStore(session_factory)
            job_store = job_store or SqlAlchemyEnforcementJobStore(session_factory)
            audit_store = audit_store or SqlAlchemyAuditStore(session_factory)
            grace_hold_store = grace_hold_store or SqlAlchemyGraceHoldStore(
                session_factory
            )
        else:
            policy_store = policy_store or InMemoryPolicyStore()
            job_store = job_store or InMemoryEnforcementJobStore()
            audit_store = audit_store or InMemoryAuditStore()
            grace_hold_store = grace_hold_store or InMemoryGraceHoldStore()

    engine = engine or PolicyEvaluatorEngine(policy_store.list_retention_policies())
    dispatcher = dispatcher or build_dispatcher(settings)
    record_source = record_source or InMemoryRecordSource()
    assert grace_hold_store is not None

    runner = EnforcementRunner(
        policy_store=policy_store,
        engine=engine,
        job_store=job_store,
        audit_store=audit_store,
        dispatcher=dispatcher,
        record_source=record_source,
        grace_hold_store=grace_hold_store,
    )
    return EnforcementRuntime(
        settings=settings,
        policy_store=policy_store,
        engine=engine,
        job_store=job_store,
        audit_store=audit_store,
        dispatcher=dispatcher,
        record_source=record_source,
        grace_hold_store=grace_hold_store,
        runner=runner,
    )


def set_enforcement_runtime(runtime: EnforcementRuntime | None) -> None:
    global _runtime
    _runtime = runtime


def get_enforcement_runtime() -> EnforcementRuntime:
    global _runtime
    if _runtime is None:
        _runtime = build_runtime()
        for policy in _runtime.policy_store.list_retention_policies():
            _runtime.engine.add_policy(policy)
    return _runtime


def enqueue_enforcement_job(job_id: str) -> Any:
    from drpe.scheduler.tasks import run_enforcement_job

    return run_enforcement_job.delay(job_id)
