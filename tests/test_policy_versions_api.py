"""API tests for policy version list, get, diff, and activate (rollback)."""

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from drpe.api.app import create_app
from drpe.api.settings import Settings

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config"

POLICY_YAML_V1 = """
policy:
  id: pol_version_test
  name: Version Test Original
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

POLICY_YAML_V2 = """
policy:
  id: pol_version_test
  name: Version Test Updated
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
      action: archive
"""


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


def _seed_two_versions(client: TestClient) -> None:
    create = client.post("/api/v1/policies", json={"yaml": POLICY_YAML_V1})
    assert create.status_code == 201
    assert create.json()["version"] == 1
    update = client.put(
        "/api/v1/policies/pol_version_test", json={"yaml": POLICY_YAML_V2}
    )
    assert update.status_code == 200
    assert update.json()["version"] == 2
    assert update.json()["name"] == "Version Test Updated"


def test_list_and_get_versions(client: TestClient) -> None:
    _seed_two_versions(client)

    listed = client.get("/api/v1/policies/pol_version_test/versions")
    assert listed.status_code == 200
    versions = listed.json()
    assert [v["version"] for v in versions] == [1, 2]
    assert versions[0]["name"] == "Version Test Original"
    assert versions[1]["name"] == "Version Test Updated"

    v1 = client.get("/api/v1/policies/pol_version_test/versions/1")
    assert v1.status_code == 200
    assert v1.json()["name"] == "Version Test Original"
    assert v1.json()["rules"][0]["action"] == "delete"


def test_diff_versions(client: TestClient) -> None:
    _seed_two_versions(client)

    resp = client.post(
        "/api/v1/policies/pol_version_test/diff",
        json={"from_version": 1, "to_version": 2},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["policy_id"] == "pol_version_test"
    assert body["from_version"] == 1
    assert body["to_version"] == 2
    by_path = {c["path"]: c for c in body["changes"]}
    assert by_path["name"]["op"] == "replace"
    assert by_path["name"]["old"] == "Version Test Original"
    assert by_path["name"]["new"] == "Version Test Updated"
    assert by_path["rules.0.action"]["op"] == "replace"
    assert by_path["rules.0.action"]["old"] == "delete"
    assert by_path["rules.0.action"]["new"] == "archive"


def test_activate_rollback(client: TestClient) -> None:
    _seed_two_versions(client)

    activate = client.post("/api/v1/policies/pol_version_test/versions/1/activate")
    assert activate.status_code == 200
    body = activate.json()
    assert body["name"] == "Version Test Original"
    assert body["version"] == 3
    assert body["rules"][0]["action"] == "delete"

    head = client.get("/api/v1/policies/pol_version_test")
    assert head.json()["version"] == 3
    assert head.json()["name"] == "Version Test Original"

    versions = client.get("/api/v1/policies/pol_version_test/versions").json()
    assert [v["version"] for v in versions] == [1, 2, 3]


def test_version_endpoints_404(client: TestClient) -> None:
    assert client.get("/api/v1/policies/missing/versions").status_code == 404
    assert client.get("/api/v1/policies/missing/versions/1").status_code == 404
    assert (
        client.post("/api/v1/policies/missing/versions/1/activate").status_code == 404
    )
    assert (
        client.post(
            "/api/v1/policies/missing/diff",
            json={"from_version": 1, "to_version": 2},
        ).status_code
        == 404
    )

    _seed_two_versions(client)
    assert (
        client.get("/api/v1/policies/pol_version_test/versions/99").status_code == 404
    )
    assert (
        client.post(
            "/api/v1/policies/pol_version_test/versions/99/activate"
        ).status_code
        == 404
    )
    assert (
        client.post(
            "/api/v1/policies/pol_version_test/diff",
            json={"from_version": 1, "to_version": 99},
        ).status_code
        == 404
    )
