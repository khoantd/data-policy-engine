"""SDK tests — embedded and remote client."""

from pathlib import Path

from fastapi.testclient import TestClient

from drpe import DRPEClient, EvaluationRequest, PolicyEvaluator
from drpe.api.app import create_app
from drpe.api.settings import Settings
from drpe.models.enums import Action

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config"
YAML = (CONFIG / "gdpr_customer.yaml").read_text()


def test_embedded_from_directory() -> None:
    evaluator = PolicyEvaluator.from_directory(CONFIG)
    result = evaluator.evaluate(
        data_type="customer_profile",
        record_id="cust_123",
        source="crm_system",
        metadata={
            "status": "inactive",
            "last_activity_at": "2023-01-01T00:00:00Z",
        },
        jurisdiction="EU_GDPR",
    )
    assert result.should_delete
    assert result.result.matched_rule == "rule_inactive_delete"


def test_embedded_from_yaml() -> None:
    evaluator = PolicyEvaluator.from_yaml(YAML)
    result = evaluator.evaluate_request(
        EvaluationRequest(
            data_type="customer_profile",
            record_id="cust_hold",
            source="crm_system",
            metadata={
                "status": "inactive",
                "last_activity_at": "2023-01-01T00:00:00Z",
                "legal_hold": True,
            },
            jurisdiction="EU_GDPR",
        )
    )
    assert result.is_retained


def test_remote_client_against_asgi() -> None:
    settings = Settings(
        drpe_policies_dir=str(CONFIG),
        database_url=None,
        redis_url=None,
    )
    app = create_app(settings)
    with TestClient(app) as http:
        with DRPEClient(
            base_url="http://testserver",
            http_client=http,
            retry_config={"max_retries": 0},
        ) as client:
            result = client.evaluate(
                data_type="customer_profile",
                record_id="cust_12345",
                source="crm_system",
                metadata={
                    "status": "inactive",
                    "last_activity_at": "2023-01-01T00:00:00Z",
                },
                jurisdiction="EU_GDPR",
            )
    assert result.action == Action.DELETE
    assert result.grace_period_ends is not None


def test_remote_client_dry_run_against_asgi() -> None:
    settings = Settings(
        drpe_policies_dir=str(CONFIG),
        database_url=None,
        redis_url=None,
    )
    app = create_app(settings)
    with TestClient(app) as http:
        with DRPEClient(
            base_url="http://testserver",
            http_client=http,
            retry_config={"max_retries": 0},
        ) as client:
            result = client.evaluate_dry_run(
                data_type="customer_profile",
                record_id="cust_dry",
                source="crm_system",
                metadata={
                    "status": "inactive",
                    "last_activity_at": "2023-01-01T00:00:00Z",
                },
                jurisdiction="EU_GDPR",
            )
    assert result.action == Action.DELETE
    assert result.audit_ref is None


def test_enforce_decorator_calls_on_delete() -> None:
    settings = Settings(
        drpe_policies_dir=str(CONFIG),
        database_url=None,
        redis_url=None,
    )
    app = create_app(settings)
    deleted: list[str] = []

    def handle_delete(record: dict, evaluation: object) -> None:
        deleted.append(record["id"])

    with TestClient(app) as http:
        with DRPEClient(
            base_url="http://testserver",
            http_client=http,
            retry_config={"max_retries": 0},
        ) as client:

            @client.enforce(
                data_type="customer_profile",
                on_delete=handle_delete,
                metadata_extractor=lambda *a, result=None, **k: {
                    "status": "inactive",
                    "last_activity_at": "2023-01-01T00:00:00Z",
                    "id": result["id"],
                },
            )
            def get_customer(record_id: str) -> dict:
                return {"id": record_id, "status": "inactive"}

            out = get_customer("cust_del")
            assert out["id"] == "cust_del"

    assert deleted == ["cust_del"]
