"""API tests for grace hold force / cancel."""

from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from drpe.api.app import create_app
from drpe.api.settings import Settings
from drpe.scheduler.runtime import set_enforcement_runtime

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config"

INLINE_RECORD = {
    "record_id": "cust_api_1",
    "data_type": "customer_profile",
    "source": "crm_system",
    "metadata": {
        "status": "inactive",
        "created_at": "2021-03-15T10:00:00Z",
        "last_activity_at": "2023-06-01T00:00:00Z",
        "legal_hold": False,
        "tags": ["newsletter"],
    },
}


def _client() -> TestClient:
    set_enforcement_runtime(None)
    app = create_app(
        Settings(
            drpe_policies_dir=str(CONFIG),
            drpe_api_key=None,
            database_url=None,
            redis_url=None,
            drpe_celery_eager=True,
        )
    )
    return TestClient(app)


def test_grace_hold_cancel_and_force_conflict() -> None:
    client = _client()
    res = client.post(
        "/api/v1/enforce",
        json={"policy_id": "pol_gdpr_customer", "records": [INLINE_RECORD]},
    )
    assert res.status_code == 200
    job = client.get(f"/api/v1/enforce/jobs/{res.json()['job_id']}").json()
    assert job["status"] == "succeeded"
    assert job["progress"]["pending_grace"] >= 1

    holds = client.get(
        "/api/v1/grace-holds?status=active&record_id=cust_api_1"
    ).json()
    assert len(holds) == 1
    hold_id = holds[0]["id"]
    assert holds[0]["grace_period_ends"]

    cancel = client.post(
        f"/api/v1/grace-holds/{hold_id}/cancel",
        json={"requester": "ops@example.com"},
    )
    assert cancel.status_code == 200
    assert cancel.json()["status"] == "cancelled"

    conflict = client.post(
        f"/api/v1/grace-holds/{hold_id}/force",
        json={"requester": "ops@example.com"},
    )
    assert conflict.status_code == 409


def test_grace_hold_force_dispatch() -> None:
    client = _client()
    # Seed record source so force can resolve metadata
    from drpe.models.enforcement import RecordRef
    from drpe.scheduler.runtime import get_enforcement_runtime

    runtime = get_enforcement_runtime()
    runtime.record_source.add(RecordRef.model_validate(INLINE_RECORD))

    res = client.post(
        "/api/v1/enforce",
        json={"policy_id": "pol_gdpr_customer", "records": [INLINE_RECORD]},
    )
    assert res.status_code == 200
    holds = client.get(
        "/api/v1/grace-holds?status=active&record_id=cust_api_1"
    ).json()
    assert len(holds) == 1
    hold_id = holds[0]["id"]

    forced = client.post(
        f"/api/v1/grace-holds/{hold_id}/force",
        json={"requester": "ops@example.com"},
    )
    assert forced.status_code == 200, forced.text
    assert forced.json()["status"] == "forced"

    audit = client.get("/api/v1/audit/logs?event_type=action&limit=20").json()
    forced_rows = [a for a in audit if (a.get("payload") or {}).get("forced")]
    assert forced_rows
