"""FastAPI application factory and ASGI entrypoint."""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.engine import Engine

from drpe.adapters.memory_audit import InMemoryAuditStore
from drpe.adapters.memory_dsar import InMemoryDsarStore
from drpe.adapters.memory_grace_holds import InMemoryGraceHoldStore
from drpe.adapters.memory_jobs import InMemoryEnforcementJobStore
from drpe.adapters.memory_records import InMemoryRecordSource
from drpe.adapters.memory_store import InMemoryPolicyStore
from drpe.adapters.memory_catalog import InMemoryCatalogStore
from drpe.adapters.memory_webhooks import InMemoryWebhookStore
from drpe.adapters.redis_cache import (
    CachingPolicyStore,
    RedisPolicyCache,
    create_redis_client,
)
from drpe.adapters.sqlalchemy_audit import SqlAlchemyAuditStore
from drpe.adapters.sqlalchemy_catalog import SqlAlchemyCatalogStore
from drpe.adapters.sqlalchemy_dsar import SqlAlchemyDsarStore
from drpe.adapters.sqlalchemy_grace_holds import SqlAlchemyGraceHoldStore
from drpe.adapters.sqlalchemy_jobs import SqlAlchemyEnforcementJobStore
from drpe.adapters.sqlalchemy_store import SqlAlchemyPolicyStore
from drpe.adapters.sqlalchemy_webhooks import SqlAlchemyWebhookStore
from drpe.api.routes_audit import router as audit_router
from drpe.api.routes_dsar import router as dsar_router
from drpe.api.routes_enforce import router as enforce_router
from drpe.api.routes_evaluate import router as evaluate_router
from drpe.api.routes_grace_holds import router as grace_holds_router
from drpe.api.routes_misc import health_router, jurisdictions_router
from drpe.api.routes_classify import router as classify_router
from drpe.api.routes_policies import router as policies_router
from drpe.api.routes_privacy import router as privacy_router
from drpe.api.routes_processes import router as processes_router
from drpe.api.routes_systems import router as systems_router
from drpe.api.routes_webhooks import router as webhooks_router
from drpe.api.settings import Settings
from drpe.core.dsar import DsarService
from drpe.core.classifier import ClassificationEngine
from drpe.core.evaluator import PolicyEvaluatorEngine
from drpe.db.session import create_db_engine, create_session_factory
from drpe.dsl.parser import PolicyParseError, parse_directory
from drpe.models.stored_policy import as_retention, is_classification_policy
from drpe.ports.policy_store import PolicyStore
from drpe.scheduler.celery_app import create_celery_app
from drpe.scheduler.runtime import build_dispatcher, build_runtime, set_enforcement_runtime


def _seed_from_yaml(store: Any, path: Path) -> None:
    if not path.is_dir():
        return
    try:
        policies = parse_directory(path)
    except PolicyParseError:
        return
    if hasattr(store, "load_many"):
        store.load_many(policies)
    else:
        for policy in policies:
            store.upsert(policy)


def _bootstrap_store(
    store: PolicyStore,
    engine: PolicyEvaluatorEngine,
    classifier: ClassificationEngine,
    path: Path,
    *,
    force_seed: bool,
) -> None:
    existing = store.list_policies()
    if force_seed or len(existing) == 0:
        _seed_from_yaml(store, path)
    for policy in store.list_policies():
        if is_classification_policy(policy):
            classifier.add_policy(policy)  # type: ignore[arg-type]
            continue
        retention = as_retention(policy)
        if retention is not None:
            engine.add_policy(retention)


def _build_inner_store(
    settings: Settings,
) -> tuple[PolicyStore, Engine | None, Any]:
    if settings.database_url:
        db_engine = create_db_engine(settings.database_url)
        session_factory = create_session_factory(db_engine)
        return SqlAlchemyPolicyStore(session_factory), db_engine, session_factory
    return InMemoryPolicyStore(), None, None


def _build_store(
    settings: Settings,
) -> tuple[PolicyStore, Engine | None, RedisPolicyCache | None, Any, Any]:
    inner, db_engine, session_factory = _build_inner_store(settings)
    if not settings.redis_url:
        return inner, db_engine, None, None, session_factory

    redis_client = create_redis_client(settings.redis_url)
    cache = RedisPolicyCache(
        redis_client,
        ttl_seconds=settings.drpe_redis_ttl_seconds,
        key_prefix=settings.drpe_redis_key_prefix,
    )
    return CachingPolicyStore(inner, cache), db_engine, cache, redis_client, session_factory


def _attach_engine_sync(
    engine: PolicyEvaluatorEngine,
    classifier: ClassificationEngine,
    store: PolicyStore,
    cache: RedisPolicyCache | None,
) -> None:
    """Reload in-process policies when Redis generation changes (multi-worker)."""
    if cache is None:
        return

    def sync() -> None:
        gen = cache.get_generation()
        if gen == engine._cache_gen:
            return
        engine.policies = store.list_retention_policies()
        classifier.load_policies(store.list_classification_policies())
        engine._cache_gen = gen
        classifier._cache_gen = gen

    engine.on_before_evaluate = sync
    classifier.on_before_classify = sync
    engine._cache_gen = cache.get_generation()
    classifier._cache_gen = cache.get_generation()


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    store, db_engine, policy_cache, redis_client, session_factory = _build_store(settings)
    engine = PolicyEvaluatorEngine()
    classifier = ClassificationEngine()
    # Eager load so ASGI test clients work without waiting on lifespan
    _bootstrap_store(
        store,
        engine,
        classifier,
        settings.policies_path,
        force_seed=settings.drpe_seed_yaml or db_engine is None,
    )
    _attach_engine_sync(engine, classifier, store, policy_cache)

    if session_factory is not None:
        job_store = SqlAlchemyEnforcementJobStore(session_factory)
        audit_store = SqlAlchemyAuditStore(session_factory)
        dsar_store = SqlAlchemyDsarStore(session_factory)
        webhook_store = SqlAlchemyWebhookStore(session_factory)
        grace_hold_store = SqlAlchemyGraceHoldStore(session_factory)
        catalog_store = SqlAlchemyCatalogStore(session_factory)
    else:
        job_store = InMemoryEnforcementJobStore()
        audit_store = InMemoryAuditStore()
        dsar_store = InMemoryDsarStore()
        webhook_store = InMemoryWebhookStore()
        grace_hold_store = InMemoryGraceHoldStore()
        catalog_store = InMemoryCatalogStore()

    record_source = InMemoryRecordSource()
    dispatcher = build_dispatcher(settings)
    runtime = build_runtime(
        settings,
        policy_store=store,
        engine=engine,
        job_store=job_store,
        audit_store=audit_store,
        dispatcher=dispatcher,
        record_source=record_source,
        grace_hold_store=grace_hold_store,
    )
    set_enforcement_runtime(runtime)

    dsar_service = DsarService(
        policy_store=store,
        dsar_store=dsar_store,
        audit_store=audit_store,
        dispatcher=dispatcher,
        record_source=record_source,
    )

    celery = create_celery_app(settings)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        yield
        set_enforcement_runtime(None)

    app = FastAPI(
        title="ROS Policy",
        version="0.1.0",
        description="Define, evaluate, and enforce data retention policies",
        lifespan=lifespan,
    )
    origins = settings.cors_origins_list
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    app.state.settings = settings
    app.state.store = store
    app.state.engine = engine
    app.state.classifier = classifier
    app.state.db_engine = db_engine
    app.state.policy_cache = policy_cache
    app.state.redis_client = redis_client
    app.state.job_store = job_store
    app.state.audit_store = audit_store
    app.state.dsar_store = dsar_store
    app.state.dsar_service = dsar_service
    app.state.webhook_store = webhook_store
    app.state.catalog_store = catalog_store
    app.state.record_source = record_source
    app.state.dispatcher = dispatcher
    app.state.grace_hold_store = grace_hold_store
    app.state.enforcement_runtime = runtime
    app.state.celery = celery

    app.include_router(policies_router, prefix="/api/v1")
    app.include_router(systems_router, prefix="/api/v1")
    app.include_router(processes_router, prefix="/api/v1")
    app.include_router(classify_router, prefix="/api/v1")
    app.include_router(evaluate_router, prefix="/api/v1")
    app.include_router(enforce_router, prefix="/api/v1")
    app.include_router(grace_holds_router, prefix="/api/v1")
    app.include_router(dsar_router, prefix="/api/v1")
    app.include_router(webhooks_router, prefix="/api/v1")
    app.include_router(audit_router, prefix="/api/v1")
    app.include_router(health_router, prefix="/api/v1")
    app.include_router(jurisdictions_router, prefix="/api/v1")
    app.include_router(privacy_router, prefix="/api/v1")

    return app


# Lazy ASGI entry for `uvicorn drpe.api.app:app` — avoids connecting to
# DATABASE_URL/REDIS_URL at import time (tests import create_app only).
# Must NOT bind `app = None`: uvicorn does getattr(module, "app"), and a
# real None attribute skips PEP 562 __getattr__, yielding this error:
# TypeError: 'NoneType' object is not callable (ASGI2 wrapper).
_app: FastAPI | None = None


def __getattr__(name: str) -> FastAPI:
    global _app
    if name == "app":
        if _app is None:
            _app = create_app()
        return _app
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def main() -> None:
    import uvicorn

    uvicorn.run("drpe.api.app:app", host="0.0.0.0", port=8000, reload=False)


if __name__ == "__main__":
    main()
