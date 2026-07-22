"""API tests for DSAR access and erasure endpoints."""

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from drpe.api.app import create_app
from drpe.api.settings import Settings
from drpe.models.enforcement import RecordRef

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config"


@pytest.fixture
def client() -> TestClient:
    settings = Settings(
        drpe_policies_dir=str(CONFIG),
        drpe_api_key=None,
        database_url=None,
        redis_url=None,
        drpe_celery_eager=True,
    )
    app = create_app(settings)
    with TestClient(app) as test_client:
        yield test_client


def test_dsar_access_inline(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/dsar/access",
        json={
            "subject_id": "subj_api_1",
            "policy_id": "pol_gdpr_customer",
            "identity": {"email": "subject@example.com"},
            "records": [
                {
                    "record_id": "subj_api_1",
                    "data_type": "customer_profile",
                    "metadata": {"status": "active"},
                    "source": "crm_system",
                }
            ],
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"].startswith("dsar_")
    assert body["type"] == "access"
    assert body["status"] == "completed"
    assert len(body["result"]["records"]) == 1
    assert body["due_at"] is not None

    get_resp = client.get(f"/api/v1/dsar/requests/{body['id']}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == body["id"]


def test_dsar_access_from_record_source(client: TestClient) -> None:
    client.app.state.record_source.add(
        RecordRef(
            record_id="r_src",
            data_type="customer_profile",
            metadata={"subject_id": "subj_src"},
            source="crm_system",
        )
    )
    resp = client.post(
        "/api/v1/dsar/access",
        json={"subject_id": "subj_src", "policy_id": "pol_gdpr_customer"},
    )
    assert resp.status_code == 200
    assert resp.json()["result"]["records"][0]["record_id"] == "r_src"


def test_dsar_erasure_dispatches(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/dsar/erasure",
        json={
            "subject_id": "subj_erase",
            "policy_id": "pol_gdpr_customer",
            "records": [
                {
                    "record_id": "subj_erase",
                    "data_type": "customer_profile",
                    "metadata": {"status": "inactive"},
                }
            ],
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "completed"
    assert body["result"]["erased"] == ["subj_erase"]

    audit = client.get("/api/v1/audit/logs", params={"event_type": "dsar_erasure"})
    assert audit.status_code == 200
    assert len(audit.json()) >= 1


def test_dsar_erasure_denied_exception(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/dsar/erasure",
        json={
            "subject_id": "subj_hold",
            "policy_id": "pol_gdpr_customer",
            "records": [
                {
                    "record_id": "subj_hold",
                    "data_type": "customer_profile",
                    "metadata": {"legal_basis": "legal_obligation"},
                }
            ],
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "denied"
    assert body["result"]["denied"][0]["reason"] == "legal_obligation"


def test_dsar_unknown_policy(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/dsar/access",
        json={"subject_id": "x", "policy_id": "does_not_exist"},
    )
    assert resp.status_code == 404


def test_dsar_access_forbidden_when_right_disabled(client: TestClient) -> None:
    from drpe.models.policy import DsarConfig

    policy = client.app.state.store.get("pol_gdpr_customer")
    assert policy is not None
    disabled = policy.model_copy(deep=True)
    disabled.dsar = DsarConfig(right_to_access=False, right_to_erasure=True)
    client.app.state.store.upsert(disabled)

    resp = client.post(
        "/api/v1/dsar/access",
        json={"subject_id": "x", "policy_id": "pol_gdpr_customer"},
    )
    assert resp.status_code == 403


def test_list_dsar_requests(client: TestClient) -> None:
    client.post(
        "/api/v1/dsar/access",
        json={
            "subject_id": "list_subj",
            "policy_id": "pol_gdpr_customer",
            "records": [
                {
                    "record_id": "list_subj",
                    "data_type": "customer_profile",
                    "metadata": {},
                }
            ],
        },
    )
    resp = client.get(
        "/api/v1/dsar/requests",
        params={"subject_id": "list_subj", "type": "access"},
    )
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
