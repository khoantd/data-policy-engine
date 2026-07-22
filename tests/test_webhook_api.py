"""API tests for webhook registration CRUD."""

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


def test_webhook_crud_lifecycle(client: TestClient) -> None:
    create_resp = client.post(
        "/api/v1/webhooks",
        json={
            "url": "https://hooks.example.com/drpe",
            "events": ["enforcement.delete", "dsar.access"],
            "description": "Primary",
        },
    )
    assert create_resp.status_code == 201
    body = create_resp.json()
    assert body["id"].startswith("wh_")
    assert body["url"] == "https://hooks.example.com/drpe"
    assert body["events"] == ["enforcement.delete", "dsar.access"]
    assert body["active"] is True
    assert body["secret"]  # auto-generated when omitted
    webhook_id = body["id"]
    secret = body["secret"]

    get_resp = client.get(f"/api/v1/webhooks/{webhook_id}")
    assert get_resp.status_code == 200
    got = get_resp.json()
    assert got["id"] == webhook_id
    assert "secret" not in got  # secret only returned on create
    assert got["secret_set"] is True

    list_resp = client.get("/api/v1/webhooks")
    assert list_resp.status_code == 200
    listed = list_resp.json()
    assert any(w["id"] == webhook_id for w in listed)
    assert all("secret" not in w for w in listed)

    patch_resp = client.patch(
        f"/api/v1/webhooks/{webhook_id}",
        json={"active": False, "events": ["*"], "description": "Paused"},
    )
    assert patch_resp.status_code == 200
    patched = patch_resp.json()
    assert patched["active"] is False
    assert patched["events"] == ["*"]
    assert patched["description"] == "Paused"
    assert "secret" not in patched

    # Explicit secret on create is echoed once
    create2 = client.post(
        "/api/v1/webhooks",
        json={
            "url": "https://hooks.example.com/other",
            "events": ["enforcement.archive"],
            "secret": "whsec_custom",
        },
    )
    assert create2.status_code == 201
    assert create2.json()["secret"] == "whsec_custom"

    del_resp = client.delete(f"/api/v1/webhooks/{webhook_id}")
    assert del_resp.status_code == 204

    assert client.get(f"/api/v1/webhooks/{webhook_id}").status_code == 404
    assert client.delete(f"/api/v1/webhooks/{webhook_id}").status_code == 404

    # Original auto secret was generated (sanity: non-empty, not the custom one)
    assert secret != "whsec_custom"


def test_webhook_list_filter_active(client: TestClient) -> None:
    client.post(
        "/api/v1/webhooks",
        json={"url": "https://a.example.com/h", "events": ["*"], "active": True},
    )
    client.post(
        "/api/v1/webhooks",
        json={"url": "https://b.example.com/h", "events": ["*"], "active": False},
    )
    active = client.get("/api/v1/webhooks", params={"active": True})
    assert active.status_code == 200
    assert all(w["active"] is True for w in active.json())
    inactive = client.get("/api/v1/webhooks", params={"active": False})
    assert inactive.status_code == 200
    assert all(w["active"] is False for w in inactive.json())


def test_webhook_create_validation(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/webhooks",
        json={"url": "not-a-url", "events": ["enforcement.delete"]},
    )
    assert resp.status_code == 422

    resp2 = client.post(
        "/api/v1/webhooks",
        json={"url": "https://hooks.example.com/x", "events": []},
    )
    assert resp2.status_code == 422


def test_webhook_update_not_found(client: TestClient) -> None:
    resp = client.patch(
        "/api/v1/webhooks/wh_missing",
        json={"active": False},
    )
    assert resp.status_code == 404
