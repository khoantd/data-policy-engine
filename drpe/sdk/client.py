"""Remote DRPE HTTP client and enforce decorator."""

from __future__ import annotations

from functools import wraps
from typing import Any, Callable, TypeVar

import httpx

from drpe.models.classification_policy import ClassificationRequest, ClassificationResponse
from drpe.models.enums import Action
from drpe.models.policy import EvaluationRequest, EvaluationResponse

F = TypeVar("F", bound=Callable[..., Any])


class DRPEClientError(Exception):
    """Raised when the remote DRPE API returns an error."""

    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


class DRPEClient:
    """Remote mode client talking to the DRPE REST API."""

    def __init__(
        self,
        base_url: str,
        api_key: str | None = None,
        timeout: float = 5.0,
        retry_config: dict[str, Any] | None = None,
        transport: httpx.BaseTransport | None = None,
        http_client: httpx.Client | None = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout
        self.retry_config = retry_config or {"max_retries": 3, "backoff_factor": 0.5}
        headers: dict[str, str] = {"Accept": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        self._owns_client = http_client is None
        if http_client is not None:
            self._client = http_client
        else:
            self._client = httpx.Client(
                base_url=self.base_url,
                headers=headers,
                timeout=timeout,
                transport=transport,
            )

    def close(self) -> None:
        if self._owns_client:
            self._client.close()

    def __enter__(self) -> DRPEClient:
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def _request(self, method: str, path: str, **kwargs: Any) -> Any:
        max_retries = int(self.retry_config.get("max_retries", 0))
        backoff = float(self.retry_config.get("backoff_factor", 0.5))
        last_exc: Exception | None = None
        for attempt in range(max_retries + 1):
            try:
                response = self._client.request(method, path, **kwargs)
                if response.status_code >= 400:
                    raise DRPEClientError(
                        response.text or response.reason_phrase,
                        status_code=response.status_code,
                    )
                if response.status_code == 204:
                    return None
                return response.json()
            except (httpx.TransportError, DRPEClientError) as exc:
                last_exc = exc
                if isinstance(exc, DRPEClientError) and exc.status_code and exc.status_code < 500:
                    raise
                if attempt >= max_retries:
                    break
                import time

                time.sleep(backoff * (2**attempt))
        assert last_exc is not None
        raise last_exc

    def evaluate(
        self,
        *,
        data_type: str,
        record_id: str,
        metadata: dict[str, Any] | None = None,
        source: str | None = None,
        jurisdiction: str | None = None,
        context: dict[str, Any] | None = None,
    ) -> EvaluationResponse:
        payload = EvaluationRequest(
            data_type=data_type,
            record_id=record_id,
            metadata=metadata or {},
            source=source,
            jurisdiction=jurisdiction,
            context=context,
        )
        data = self._request("POST", "/api/v1/evaluate", json=payload.model_dump())
        return EvaluationResponse.model_validate(data)

    def evaluate_dry_run(
        self,
        *,
        data_type: str,
        record_id: str,
        metadata: dict[str, Any] | None = None,
        source: str | None = None,
        jurisdiction: str | None = None,
        context: dict[str, Any] | None = None,
    ) -> EvaluationResponse:
        """Evaluate without producing an audit reference."""
        payload = EvaluationRequest(
            data_type=data_type,
            record_id=record_id,
            metadata=metadata or {},
            source=source,
            jurisdiction=jurisdiction,
            context=context,
        )
        data = self._request(
            "POST", "/api/v1/evaluate/dry-run", json=payload.model_dump()
        )
        return EvaluationResponse.model_validate(data)

    def evaluate_batch(
        self, records: list[EvaluationRequest | dict[str, Any]]
    ) -> list[EvaluationResponse]:
        body = []
        for rec in records:
            if isinstance(rec, EvaluationRequest):
                body.append(rec.model_dump())
            else:
                body.append(rec)
        data = self._request("POST", "/api/v1/evaluate/batch", json={"records": body})
        return [EvaluationResponse.model_validate(item) for item in data]

    def classify(
        self,
        *,
        data_type: str,
        record_id: str,
        metadata: dict[str, Any] | None = None,
        source: str | None = None,
        jurisdiction: str | None = None,
        text_fields: list[str] | None = None,
        policy_id: str | None = None,
    ) -> ClassificationResponse:
        payload = ClassificationRequest(
            data_type=data_type,
            record_id=record_id,
            metadata=metadata or {},
            source=source,
            jurisdiction=jurisdiction,
            text_fields=text_fields,
            policy_id=policy_id,
        )
        data = self._request("POST", "/api/v1/classify", json=payload.model_dump())
        return ClassificationResponse.model_validate(data)

    def classify_dry_run(
        self,
        *,
        data_type: str,
        record_id: str,
        metadata: dict[str, Any] | None = None,
        source: str | None = None,
        jurisdiction: str | None = None,
        text_fields: list[str] | None = None,
        policy_id: str | None = None,
    ) -> ClassificationResponse:
        payload = ClassificationRequest(
            data_type=data_type,
            record_id=record_id,
            metadata=metadata or {},
            source=source,
            jurisdiction=jurisdiction,
            text_fields=text_fields,
            policy_id=policy_id,
        )
        data = self._request(
            "POST", "/api/v1/classify/dry-run", json=payload.model_dump()
        )
        return ClassificationResponse.model_validate(data)

    def enforce(
        self,
        *,
        data_type: str,
        on_delete: Callable[..., Any] | None = None,
        on_archive: Callable[..., Any] | None = None,
        metadata_extractor: Callable[..., dict[str, Any]] | None = None,
        record_id_arg: str = "record_id",
    ) -> Callable[[F], F]:
        """Decorator that evaluates the record after the wrapped function returns.

        The wrapped function must accept a record id (default arg name ``record_id``).
        Metadata is taken from ``metadata_extractor(*args, **kwargs)`` or from the
        returned object's ``__dict__`` / mapping.
        """

        def decorator(fn: F) -> F:
            @wraps(fn)
            def wrapper(*args: Any, **kwargs: Any) -> Any:
                result = fn(*args, **kwargs)
                record_id = kwargs.get(record_id_arg)
                if record_id is None and args:
                    # assume first positional is record id when named param missing
                    import inspect

                    sig = inspect.signature(fn)
                    params = list(sig.parameters.keys())
                    if record_id_arg in params:
                        idx = params.index(record_id_arg)
                        if idx < len(args):
                            record_id = args[idx]
                    elif params:
                        record_id = args[0] if args else None

                if metadata_extractor:
                    metadata = metadata_extractor(*args, result=result, **kwargs)
                elif isinstance(result, dict):
                    metadata = result
                elif result is not None and hasattr(result, "__dict__"):
                    metadata = {
                        k: v
                        for k, v in vars(result).items()
                        if not k.startswith("_")
                    }
                else:
                    metadata = {}

                if record_id is None:
                    record_id = str(metadata.get("id", "unknown"))

                evaluation = self.evaluate(
                    data_type=data_type,
                    record_id=str(record_id),
                    metadata=metadata,
                )
                if evaluation.result.action == Action.DELETE and on_delete:
                    on_delete(result, evaluation)
                elif evaluation.result.action == Action.ARCHIVE and on_archive:
                    on_archive(result, evaluation)
                return result

            return wrapper  # type: ignore[return-value]

        return decorator
