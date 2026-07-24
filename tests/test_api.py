"""API integration tests."""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from drpe.api.app import create_app
from drpe.api.settings import Settings

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config"


@pytest.fixture
def client() -> TestClient:
    settings = Settings(
        drpe_policies_dir=str(CONFIG),
        drpe_api_key=None,
        database_url=None,
        redis_url=None,
    )
    app = create_app(settings)
    with TestClient(app) as test_client:
        yield test_client


def test_health(client: TestClient) -> None:
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_ready_loads_policies(client: TestClient) -> None:
    resp = client.get("/api/v1/health/ready")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ready"
    assert body["policies_loaded"] >= 1


def test_list_jurisdictions(client: TestClient) -> None:
    resp = client.get("/api/v1/jurisdictions")
    assert resp.status_code == 200
    codes = {j["code"] for j in resp.json()}
    assert "EU_GDPR" in codes
    assert "GLOBAL" in codes


def test_validate_policy(client: TestClient) -> None:
    yaml_text = (CONFIG / "gdpr_customer.yaml").read_text()
    resp = client.post("/api/v1/policies/validate", json={"yaml": yaml_text})
    assert resp.status_code == 200
    body = resp.json()
    assert body["valid"] is True
    assert body["policy"]["id"] == "pol_gdpr_customer"


def test_evaluate_inactive_customer(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/evaluate",
        json={
            "data_type": "customer_profile",
            "source": "crm_system",
            "record_id": "cust_12345",
            "metadata": {
                "status": "inactive",
                "created_at": "2021-03-15T10:00:00Z",
                "last_activity_at": "2023-06-01T00:00:00Z",
                "legal_hold": False,
                "tags": ["newsletter"],
            },
            "jurisdiction": "EU_GDPR",
            "context": {"requester": "crm_cleanup_job", "reason": "scheduled_review"},
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["record_id"] == "cust_12345"
    assert body["result"]["action"] == "delete"
    assert body["result"]["matched_policy"] == "pol_gdpr_customer"
    assert body["result"]["matched_rule"] == "rule_inactive_delete"
    assert body["result"]["grace_period_ends"] is not None
    assert body["result"]["confidence"] == "definitive"
    assert body["jurisdiction_applied"] == "EU_GDPR"
    assert body["audit_ref"]


def test_evaluate_dry_run_omits_audit(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/evaluate/dry-run",
        json={
            "data_type": "customer_profile",
            "source": "crm_system",
            "record_id": "cust_x",
            "metadata": {
                "status": "inactive",
                "last_activity_at": "2023-01-01T00:00:00Z",
            },
            "jurisdiction": "EU_GDPR",
        },
    )
    assert resp.status_code == 200
    assert resp.json()["audit_ref"] is None


def test_evaluate_batch(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/evaluate/batch",
        json={
            "records": [
                {
                    "data_type": "customer_profile",
                    "source": "crm_system",
                    "record_id": "a",
                    "metadata": {
                        "status": "inactive",
                        "last_activity_at": "2023-01-01T00:00:00Z",
                    },
                    "jurisdiction": "EU_GDPR",
                },
                {
                    "data_type": "customer_profile",
                    "source": "crm_system",
                    "record_id": "b",
                    "metadata": {"status": "active", "created_at": "2024-01-01T00:00:00Z"},
                    "jurisdiction": "EU_GDPR",
                },
            ]
        },
    )
    assert resp.status_code == 200
    results = resp.json()
    assert len(results) == 2
    assert results[0]["result"]["action"] == "delete"
    assert results[1]["result"]["action"] == "retain"


def test_create_and_get_policy(client: TestClient) -> None:
    yaml_text = """
policy:
  id: pol_test_create
  name: Test Create
  status: active
  jurisdiction: GLOBAL
  data_classification: operational
  scope:
    data_types: [event_log]
  rules:
    - id: r1
      priority: 10
      condition:
        all:
          - field: age_days
            operator: gt
            value: 30
      action: delete
"""
    resp = client.post("/api/v1/policies", json={"yaml": yaml_text})
    assert resp.status_code == 201
    assert resp.json()["id"] == "pol_test_create"

    got = client.get("/api/v1/policies/pol_test_create")
    assert got.status_code == 200
    assert got.json()["name"] == "Test Create"

    deleted = client.delete("/api/v1/policies/pol_test_create")
    assert deleted.status_code == 200
    assert deleted.json()["status"] == "deprecated"


def test_change_policy_status(client: TestClient) -> None:
    yaml_text = """
policy:
  id: pol_test_status
  name: Status Test
  status: draft
  jurisdiction: GLOBAL
  data_classification: operational
  scope:
    data_types: [event_log]
  rules:
    - id: r1
      priority: 10
      condition:
        all:
          - field: age_days
            operator: gt
            value: 30
      action: delete
"""
    created = client.post("/api/v1/policies", json={"yaml": yaml_text})
    assert created.status_code == 201
    assert created.json()["status"] == "draft"
    assert created.json()["version"] == 1

    published = client.post(
        "/api/v1/policies/pol_test_status/status",
        json={"status": "active"},
    )
    assert published.status_code == 200
    body = published.json()
    assert body["status"] == "active"
    assert body["version"] == 2

    archived = client.post(
        "/api/v1/policies/pol_test_status/status",
        json={"status": "archived"},
    )
    assert archived.status_code == 200
    assert archived.json()["status"] == "archived"
    assert archived.json()["version"] == 3

    missing = client.post(
        "/api/v1/policies/pol_missing/status",
        json={"status": "active"},
    )
    assert missing.status_code == 404


def test_list_policies(client: TestClient) -> None:
    resp = client.get("/api/v1/policies")
    assert resp.status_code == 200
    ids = {p["id"] for p in resp.json()}
    assert "pol_gdpr_customer" in ids
    assert resp.json()[0]["policy_kind"] == "retention"


def test_validate_and_classify_classification_policy(client: TestClient) -> None:
    yaml = """
classification_policy:
  id: pol_cls_test
  name: Test Classification
  status: active
  jurisdiction: EU_GDPR
  scope:
    data_types: [customer_profile]
  entities:
    - id: ent_email
      label: Email
      classification: PII
      sensitivity: medium
      detection:
        field_names: [email]
  rules:
    - id: rule_flag
      priority: 1
      condition:
        all:
          - field: _entity_count
            operator: gt
            value: 0
      action: flag
"""
    val = client.post("/api/v1/policies/validate", json={"yaml": yaml})
    assert val.status_code == 200
    body = val.json()
    assert body["valid"] is True
    assert body["policy_kind"] == "classification"

    imp = client.post("/api/v1/policies/import", json={"yaml": yaml})
    assert imp.status_code == 200

    cls = client.post(
        "/api/v1/classify/dry-run",
        json={
            "data_type": "customer_profile",
            "record_id": "cust_cls_1",
            "metadata": {"email": "test@example.com"},
            "jurisdiction": "EU_GDPR",
            "policy_id": "pol_cls_test",
        },
    )
    assert cls.status_code == 200
    result = cls.json()
    assert len(result["detected_entities"]) == 1
    assert result["result"]["action"] == "flag"
    assert result["diagnostics"]["applicable_policy_count"] == 1
    assert result["diagnostics"]["selected_policy_applied"] is True
    assert result["diagnostics"]["out_of_scope_reason"] == "none"


def test_classify_reports_scope_mismatch_reason(client: TestClient) -> None:
    yaml = """
classification_policy:
  id: pol_cls_scope
  name: Scope Classification
  status: active
  jurisdiction: VN_PDPD
  scope:
    data_types: [customer_profile, support_ticket]
  entities:
    - id: ent_cmnd
      label: CMND
      classification: SPII
      sensitivity: critical
      detection:
        field_names: [cmnd]
  rules:
    - id: rule_flag
      priority: 1
      condition:
        all:
          - field: _has_spii
            operator: eq
            value: true
      action: flag
      handling: require_encryption
"""
    imp = client.post("/api/v1/policies/import", json={"yaml": yaml})
    assert imp.status_code == 200

    cls = client.post(
        "/api/v1/classify/dry-run",
        json={
            "data_type": "employee_record",
            "record_id": "emp_cls_1",
            "metadata": {"cmnd": "001234567890"},
            "jurisdiction": "VN_PDPD",
            "policy_id": "pol_cls_scope",
        },
    )
    assert cls.status_code == 200
    result = cls.json()
    assert result["detected_entities"] == []
    assert result["result"]["action"] == "allow"
    assert result["diagnostics"]["applicable_policy_count"] == 0
    assert result["diagnostics"]["selected_policy_applied"] is False
    assert result["diagnostics"]["out_of_scope_reason"] == "data_type"
    assert result["diagnostics"]["policy_scope_summary"]["data_types"] == [
        "customer_profile",
        "support_ticket",
    ]


def test_ready_with_redis_ok(monkeypatch: pytest.MonkeyPatch) -> None:
    import fakeredis

    fake = fakeredis.FakeRedis(decode_responses=True)
    monkeypatch.setattr(
        "drpe.api.app.create_redis_client", lambda _url, **_kwargs: fake
    )
    settings = Settings(
        drpe_policies_dir=str(CONFIG),
        drpe_api_key=None,
        database_url=None,
        redis_url="redis://localhost:6379/0",
    )
    app = create_app(settings)
    assert app.state.policy_cache is not None
    with TestClient(app) as test_client:
        resp = test_client.get("/api/v1/health/ready")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ready"


def test_ready_redis_unavailable_returns_503(monkeypatch: pytest.MonkeyPatch) -> None:
    import fakeredis

    fake = fakeredis.FakeRedis(decode_responses=True)
    monkeypatch.setattr(
        "drpe.api.app.create_redis_client", lambda _url, **_kwargs: fake
    )
    settings = Settings(
        drpe_policies_dir=str(CONFIG),
        drpe_api_key=None,
        database_url=None,
        redis_url="redis://localhost:6379/0",
    )
    app = create_app(settings)

    def _fail_ping() -> None:
        raise ConnectionError("redis down")

    app.state.policy_cache.check_connection = _fail_ping  # type: ignore[method-assign]
    with TestClient(app) as test_client:
        resp = test_client.get("/api/v1/health/ready")
        assert resp.status_code == 503
        assert "cache unavailable" in resp.json()["detail"]


def test_uvicorn_lazy_app_attr_is_fastapi(monkeypatch: pytest.MonkeyPatch) -> None:
    """uvicorn does getattr(module, 'app'); app=None skips __getattr__ and 500s."""
    from fastapi import FastAPI

    import drpe.api.app as app_module

    real_create = app_module.create_app

    def offline_create(settings=None):
        return real_create(
            Settings(
                drpe_policies_dir=str(CONFIG),
                database_url=None,
                redis_url=None,
            )
        )

    monkeypatch.setattr(app_module, "create_app", offline_create)
    monkeypatch.setattr(app_module, "_app", None)
    app_module.__dict__.pop("app", None)

    assert "app" not in app_module.__dict__
    app = getattr(app_module, "app")
    assert isinstance(app, FastAPI)
    assert callable(app)


_REF_SOURCE = {
    "id": 1,
    "title": "GDPR Art. 5",
    "url": "https://gdpr.eu/article-5-how-to-process-personal-data/",
    "snippet": "Principles relating to processing of personal data.",
    "domain": "gdpr.eu",
}

_IMPORT_YAML = """
policy:
  id: pol_ai_refs
  name: AI Refs Policy
  status: draft
  jurisdiction: EU_GDPR
  data_classification: PII
  scope:
    data_types: [customer_profile]
  rules:
    - id: rule_retain
      priority: 1
      condition:
        all:
          - field: status
            operator: eq
            value: active
      action: retain
"""


def test_import_persists_reference_sources(client: TestClient) -> None:
    imp = client.post(
        "/api/v1/policies/import",
        json={"yaml": _IMPORT_YAML, "reference_sources": [_REF_SOURCE]},
    )
    assert imp.status_code == 200
    assert imp.json()["imported"] == ["pol_ai_refs"]

    got = client.get("/api/v1/policies/pol_ai_refs")
    assert got.status_code == 200
    body = got.json()
    assert body["reference_sources"] == [_REF_SOURCE]


def test_import_without_reference_sources_defaults_empty(client: TestClient) -> None:
    yaml = _IMPORT_YAML.replace("pol_ai_refs", "pol_ai_refs_empty")
    imp = client.post("/api/v1/policies/import", json={"yaml": yaml})
    assert imp.status_code == 200
    got = client.get("/api/v1/policies/pol_ai_refs_empty")
    assert got.status_code == 200
    assert got.json()["reference_sources"] == []


def test_yaml_update_preserves_reference_sources(client: TestClient) -> None:
    imp = client.post(
        "/api/v1/policies/import",
        json={"yaml": _IMPORT_YAML, "reference_sources": [_REF_SOURCE]},
    )
    assert imp.status_code == 200

    updated_yaml = _IMPORT_YAML.replace("AI Refs Policy", "AI Refs Policy v2")
    put = client.put(
        "/api/v1/policies/pol_ai_refs",
        json={"yaml": updated_yaml},
    )
    assert put.status_code == 200
    body = put.json()
    assert body["name"] == "AI Refs Policy v2"
    assert body["reference_sources"] == [_REF_SOURCE]


def test_import_rejects_non_https_reference_url(client: TestClient) -> None:
    bad = {**_REF_SOURCE, "url": "http://example.com/insecure"}
    imp = client.post(
        "/api/v1/policies/import",
        json={
            "yaml": _IMPORT_YAML.replace("pol_ai_refs", "pol_ai_refs_bad"),
            "reference_sources": [bad],
        },
    )
    assert imp.status_code == 422
