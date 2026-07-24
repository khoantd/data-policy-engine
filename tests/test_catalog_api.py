"""API tests for systems / processes catalog and policy links."""

from __future__ import annotations

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
        drpe_celery_eager=True,
    )
    app = create_app(settings)
    with TestClient(app) as test_client:
        yield test_client


def test_system_crud_lifecycle(client: TestClient) -> None:
    create_resp = client.post(
        "/api/v1/systems",
        json={
            "name": "CRM",
            "description": "Customer CRM",
            "owner": "ops",
            "source_key": "crm_system",
            "tags": ["prod"],
        },
    )
    assert create_resp.status_code == 201
    body = create_resp.json()
    assert body["id"].startswith("sys_")
    assert body["name"] == "CRM"
    assert body["source_key"] == "crm_system"
    assert body["status"] == "active"
    system_id = body["id"]

    get_resp = client.get(f"/api/v1/systems/{system_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == system_id

    list_resp = client.get("/api/v1/systems")
    assert list_resp.status_code == 200
    assert any(s["id"] == system_id for s in list_resp.json())

    patch_resp = client.patch(
        f"/api/v1/systems/{system_id}",
        json={"status": "retired", "description": "Legacy CRM"},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "retired"
    assert patch_resp.json()["description"] == "Legacy CRM"

    del_resp = client.delete(f"/api/v1/systems/{system_id}")
    assert del_resp.status_code == 204
    assert client.get(f"/api/v1/systems/{system_id}").status_code == 404


def test_process_crud_lifecycle(client: TestClient) -> None:
    create_resp = client.post(
        "/api/v1/processes",
        json={"name": "Onboarding", "owner": "compliance", "tags": ["gdpr"]},
    )
    assert create_resp.status_code == 201
    body = create_resp.json()
    assert body["id"].startswith("proc_")
    process_id = body["id"]

    assert client.get(f"/api/v1/processes/{process_id}").status_code == 200
    patch = client.patch(
        f"/api/v1/processes/{process_id}",
        json={"name": "Customer onboarding"},
    )
    assert patch.status_code == 200
    assert patch.json()["name"] == "Customer onboarding"

    assert client.delete(f"/api/v1/processes/{process_id}").status_code == 204
    assert client.get(f"/api/v1/processes/{process_id}").status_code == 404


def test_policy_system_and_process_links(client: TestClient) -> None:
    policies = client.get("/api/v1/policies").json()
    assert policies
    policy_id = policies[0]["id"]

    system = client.post(
        "/api/v1/systems",
        json={"name": "ERP", "source_key": "erp_system"},
    ).json()
    process = client.post(
        "/api/v1/processes",
        json={"name": "Billing"},
    ).json()

    set_sys = client.put(
        f"/api/v1/policies/{policy_id}/systems",
        json={"system_ids": [system["id"]]},
    )
    assert set_sys.status_code == 200
    assert [s["id"] for s in set_sys.json()] == [system["id"]]

    set_proc = client.put(
        f"/api/v1/policies/{policy_id}/processes",
        json={"process_ids": [process["id"]]},
    )
    assert set_proc.status_code == 200
    assert [p["id"] for p in set_proc.json()] == [process["id"]]

    assert client.get(f"/api/v1/policies/{policy_id}/systems").json()[0]["id"] == system[
        "id"
    ]
    assert (
        client.get(f"/api/v1/systems/{system['id']}/policies").json() == [policy_id]
    )

    reverse = client.put(
        f"/api/v1/systems/{system['id']}/policies",
        json={"policy_ids": [policy_id]},
    )
    assert reverse.status_code == 200
    assert reverse.json() == [policy_id]

    # Bad system id
    bad = client.put(
        f"/api/v1/policies/{policy_id}/systems",
        json={"system_ids": ["sys_missing"]},
    )
    assert bad.status_code == 404

    # Bad policy id on reverse link
    bad_pol = client.put(
        f"/api/v1/systems/{system['id']}/policies",
        json={"policy_ids": ["pol_missing"]},
    )
    assert bad_pol.status_code == 404

    # Cascade: delete system clears links
    assert client.delete(f"/api/v1/systems/{system['id']}").status_code == 204
    assert client.get(f"/api/v1/policies/{policy_id}/systems").json() == []

    # Deprecate policy clears remaining process links
    assert client.delete(f"/api/v1/policies/{policy_id}").status_code == 200
    assert (
        client.get(f"/api/v1/processes/{process['id']}/policies").json() == []
    )


def test_catalog_links_do_not_affect_evaluate(client: TestClient) -> None:
    """Governance links must not change evaluate matching (still uses scope.sources)."""
    policies = client.get("/api/v1/policies").json()
    policy_id = next(p["id"] for p in policies if p["id"] == "pol_gdpr_customer")
    system = client.post(
        "/api/v1/systems",
        json={"name": "Unrelated", "source_key": "unrelated_system"},
    ).json()
    client.put(
        f"/api/v1/policies/{policy_id}/systems",
        json={"system_ids": [system["id"]]},
    )

    resp = client.post(
        "/api/v1/evaluate",
        json={
            "data_type": "customer_profile",
            "source": "crm_system",
            "record_id": "cust_link_test",
            "metadata": {
                "status": "inactive",
                "created_at": "2021-03-15T10:00:00Z",
                "last_activity_at": "2023-06-01T00:00:00Z",
                "legal_hold": False,
                "tags": ["newsletter"],
            },
            "jurisdiction": "EU_GDPR",
        },
    )
    assert resp.status_code == 200
    assert resp.json()["result"]["action"] == "delete"


def test_system_create_validation(client: TestClient) -> None:
    resp = client.post("/api/v1/systems", json={"name": ""})
    assert resp.status_code == 422

    assert client.get("/api/v1/systems/sys_missing").status_code == 404
    assert client.patch(
        "/api/v1/systems/sys_missing", json={"name": "x"}
    ).status_code == 404
