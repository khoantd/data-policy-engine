"""Tests for Redis client factory connection pool limits."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from drpe.adapters.redis_cache import create_redis_client


def test_create_redis_client_caps_pool_by_default() -> None:
    mock_redis = MagicMock()
    with patch("redis.Redis") as redis_cls:
        redis_cls.from_url.return_value = mock_redis
        client = create_redis_client("redis://localhost:6379/0")

    assert client is mock_redis
    redis_cls.from_url.assert_called_once_with(
        "redis://localhost:6379/0",
        decode_responses=True,
        max_connections=20,
        socket_connect_timeout=5,
        socket_timeout=5,
        health_check_interval=30,
    )


def test_create_redis_client_respects_max_connections_override() -> None:
    mock_redis = MagicMock()
    with patch("redis.Redis") as redis_cls:
        redis_cls.from_url.return_value = mock_redis
        create_redis_client("redis://localhost:6379/1", max_connections=8)

    kwargs = redis_cls.from_url.call_args.kwargs
    assert kwargs["max_connections"] == 8
