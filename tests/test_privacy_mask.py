"""Privacy masking API tests."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from drpe.api.app import create_app
from drpe.api.settings import Settings
from drpe.privacy.mapping_store import get_mapping_store
from drpe.privacy.masker import reset_masker_for_tests


@pytest.fixture
def client() -> TestClient:
    settings = Settings(
        drpe_policies_dir="config",
        drpe_api_key="test-key",
        drpe_require_auth=True,
        database_url=None,
        redis_url=None,
        privacy_mask_enabled=True,
    )
    app = create_app(settings)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def reset_state() -> None:
    reset_masker_for_tests()
    get_mapping_store(300)
    yield
    reset_masker_for_tests()


def test_privacy_status_unavailable_without_package(client: TestClient) -> None:
    with patch("drpe.privacy.service.is_privalyse_available", return_value=False):
        resp = client.get(
            "/api/v1/privacy/status",
            headers={"Authorization": "Bearer test-key"},
        )
    assert resp.status_code == 200
    body = resp.json()
    assert body["available"] is False
    assert body["enabled"] is True


def test_privacy_mask_requires_auth() -> None:
    settings = Settings(
        drpe_policies_dir="config",
        drpe_api_key="test-key",
        drpe_require_auth=True,
        database_url=None,
        redis_url=None,
    )
    app = create_app(settings)
    with TestClient(app) as test_client:
        resp = test_client.post(
            "/api/v1/privacy/mask",
            json={"text": "Contact sarah@example.com"},
        )
    assert resp.status_code == 401


def test_privacy_mask_unavailable_returns_503(client: TestClient) -> None:
    with patch("drpe.privacy.service.is_privalyse_available", return_value=False):
        resp = client.post(
            "/api/v1/privacy/mask",
            json={"text": "Contact sarah@example.com"},
            headers={"Authorization": "Bearer test-key"},
        )
    assert resp.status_code == 503


def test_privacy_mask_and_unmask_round_trip(client: TestClient) -> None:
    mock_masker = MagicMock()
    mapping = {"{Email_1}": "sarah@example.com"}
    mock_masker.mask.return_value = ("Contact {Email_1}", mapping)
    mock_masker.unmask.return_value = "Contact sarah@example.com"

    with patch("drpe.privacy.service.is_privalyse_available", return_value=True):
        with patch("drpe.privacy.service.get_masker", return_value=mock_masker):
            mask_resp = client.post(
                "/api/v1/privacy/mask",
                json={"text": "Contact sarah@example.com"},
                headers={"Authorization": "Bearer test-key"},
            )
            assert mask_resp.status_code == 200
            mask_body = mask_resp.json()
            assert mask_body["masked_text"] == "Contact {Email_1}"
            assert mask_body["entity_count"] == 1
            assert "mapping_token" in mask_body
            assert "sarah@example.com" not in str(mask_body)

            unmask_resp = client.post(
                "/api/v1/privacy/unmask",
                json={
                    "text": "Contact {Email_1}",
                    "mapping_token": mask_body["mapping_token"],
                },
                headers={"Authorization": "Bearer test-key"},
            )
            assert unmask_resp.status_code == 200
            assert unmask_resp.json()["text"] == "Contact sarah@example.com"


def test_privacy_unmask_invalid_token(client: TestClient) -> None:
    with patch("drpe.privacy.service.is_privalyse_available", return_value=True):
        with patch("drpe.privacy.service.get_masker", return_value=MagicMock()):
            resp = client.post(
                "/api/v1/privacy/unmask",
                json={"text": "hello", "mapping_token": "not-a-real-token"},
                headers={"Authorization": "Bearer test-key"},
            )
    assert resp.status_code == 400


def test_privacy_mask_requires_exactly_one_input(client: TestClient) -> None:
    with patch("drpe.privacy.service.is_privalyse_available", return_value=True):
        resp = client.post(
            "/api/v1/privacy/mask",
            json={},
            headers={"Authorization": "Bearer test-key"},
        )
    assert resp.status_code == 422
