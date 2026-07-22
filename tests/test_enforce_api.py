"""API + Celery eager tests for enforcement and audit."""

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from drpe.api.app import create_app
from drpe.api.settings import Settings
from drpe.models.enforcement import RecordRef
from drpe.scheduler.tasks import scan_due_policies

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


def test_enforce_inline_records(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/enforce",
        json={
            "policy_id": "pol_gdpr_customer",
            "records": [
                {
                    "record_id": "cust_api_1",
                    "data_type": "customer_profile",
                    "metadata": {
                        "status": "inactive",
                        "last_activity_at": "2020-01-01T00:00:00Z",
                    },
                    "source": "crm_system",
                    "jurisdiction": "EU_GDPR",
                }
            ],
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["job_id"].startswith("job_")
    # Eager mode should complete
    assert body["status"] in ("succeeded", "queued", "running")

    job_resp = client.get(f"/api/v1/enforce/jobs/{body['job_id']}")
    assert job_resp.status_code == 200
    job = job_resp.json()
    assert job["status"] == "succeeded"
    assert job["progress"]["scanned"] >= 1

    audit = client.get("/api/v1/audit/logs", params={"job_id": body["job_id"]})
    assert audit.status_code == 200
    logs = audit.json()
    assert len(logs) >= 1
    assert any(e["event_type"] == "evaluation" for e in logs)


def test_list_jobs(client: TestClient) -> None:
    client.post(
        "/api/v1/enforce",
        json={
            "records": [
                {
                    "record_id": "cust_list",
                    "data_type": "customer_profile",
                    "metadata": {"status": "active", "created_at": "2020-01-01T00:00:00Z"},
                }
            ]
        },
    )
    resp = client.get("/api/v1/enforce/jobs")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_enforce_unknown_policy(client: TestClient) -> None:
    resp = client.post("/api/v1/enforce", json={"policy_id": "does_not_exist"})
    assert resp.status_code == 404


def test_scan_due_policies_task(client: TestClient) -> None:
    # client fixture sets enforcement runtime
    runtime = client.app.state.enforcement_runtime
    runtime.record_source.add(
        RecordRef(
            record_id="cust_sched",
            data_type="customer_profile",
            metadata={
                "status": "inactive",
                "last_activity_at": "2020-01-01T00:00:00Z",
            },
            source="crm_system",
        )
    )
    result = scan_due_policies(policy_id="pol_gdpr_customer")
    assert "job_id" in result
    job = runtime.job_store.get(result["job_id"])
    assert job is not None
    assert job.status.value == "succeeded"
    assert job.trigger.value == "schedule"
