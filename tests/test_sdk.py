"""SDK tests — embedded and remote client."""

from pathlib import Path

from fastapi.testclient import TestClient

from drpe import (
    ClassificationRequest,
    ClassificationResponse,
    DRPEClient,
    EvaluationRequest,
    PolicyEvaluator,
)
from drpe.api.app import create_app
from drpe.api.settings import Settings
from drpe.models.enums import Action, PolicyKind

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config"
YAML = (CONFIG / "gdpr_customer.yaml").read_text()
CLASSIFY_YAML = (CONFIG / "gdpr_pii_classification.yaml").read_text()


def _offline_settings(**overrides: object) -> Settings:
    base = {
        "_env_file": None,
        "drpe_policies_dir": str(CONFIG),
        "database_url": None,
        "redis_url": None,
        "drpe_api_key": None,
        "drpe_require_auth": False,
        "drpe_seed_yaml": False,
    }
    base.update(overrides)
    return Settings(**base)  # type: ignore[arg-type]


def test_embedded_from_directory() -> None:
    evaluator = PolicyEvaluator.from_directory(CONFIG)
    assert all(p.policy_kind == PolicyKind.RETENTION for p in evaluator.policies)
    assert len(evaluator.classification_policies) >= 1
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


def test_embedded_classify_from_directory() -> None:
    evaluator = PolicyEvaluator.from_directory(CONFIG)
    result = evaluator.classify(
        data_type="customer_profile",
        record_id="cust_pii",
        source="crm_system",
        metadata={"email": "user@example.com", "ssn": "123-45-6789"},
        jurisdiction="EU_GDPR",
    )
    assert isinstance(result, ClassificationResponse)
    assert result.detected_entities
    assert result.diagnostics.applicable_policy_count >= 1


def test_embedded_classify_from_yaml() -> None:
    evaluator = PolicyEvaluator.from_yaml(CLASSIFY_YAML)
    assert evaluator.policies == []
    assert len(evaluator.classification_policies) == 1
    result = evaluator.classify_dry_run(
        data_type="customer_profile",
        record_id="cust_dry",
        source="crm_system",
        metadata={"email": "user@example.com"},
        jurisdiction="EU_GDPR",
    )
    assert result.audit_ref is None
    assert any(e.label.lower().startswith("email") for e in result.detected_entities)


def test_remote_client_against_asgi() -> None:
    app = create_app(_offline_settings())
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
    app = create_app(_offline_settings())
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


def test_remote_client_applies_api_key_with_injected_http_client() -> None:
    app = create_app(_offline_settings(drpe_api_key="test-secret"))
    with TestClient(app) as http:
        with DRPEClient(
            base_url="http://testserver",
            api_key="test-secret",
            http_client=http,
            retry_config={"max_retries": 0},
        ) as client:
            result = client.evaluate(
                data_type="customer_profile",
                record_id="cust_auth",
                source="crm_system",
                metadata={
                    "status": "inactive",
                    "last_activity_at": "2023-01-01T00:00:00Z",
                },
                jurisdiction="EU_GDPR",
            )
    assert result.action == Action.DELETE


def test_remote_client_classify_and_batch() -> None:
    app = create_app(_offline_settings())
    with TestClient(app) as http:
        with DRPEClient(
            base_url="http://testserver",
            http_client=http,
            retry_config={"max_retries": 0},
        ) as client:
            one = client.classify(
                data_type="customer_profile",
                record_id="cust_cls",
                source="crm_system",
                metadata={"email": "user@example.com"},
                jurisdiction="EU_GDPR",
            )
            dry = client.classify_dry_run(
                data_type="customer_profile",
                record_id="cust_cls_dry",
                source="crm_system",
                metadata={"email": "user@example.com"},
                jurisdiction="EU_GDPR",
            )
            batch = client.classify_batch(
                [
                    ClassificationRequest(
                        data_type="customer_profile",
                        record_id="cust_a",
                        source="crm_system",
                        metadata={"email": "a@example.com"},
                        jurisdiction="EU_GDPR",
                    ),
                    {
                        "data_type": "customer_profile",
                        "record_id": "cust_b",
                        "source": "crm_system",
                        "metadata": {"email": "b@example.com"},
                        "jurisdiction": "EU_GDPR",
                    },
                ]
            )
    assert one.detected_entities
    assert one.diagnostics.out_of_scope_reason == "none"
    assert dry.audit_ref is None
    assert len(batch) == 2
    assert batch[0].record_id == "cust_a"
    assert batch[1].record_id == "cust_b"


def test_enforce_decorator_calls_on_delete() -> None:
    app = create_app(_offline_settings())
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
