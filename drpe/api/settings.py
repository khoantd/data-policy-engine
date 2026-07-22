"""Application settings."""

from __future__ import annotations

from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        populate_by_name=True,
    )

    drpe_api_key: str | None = None
    drpe_policies_dir: str = "config"
    drpe_require_auth: bool = False
    drpe_cors_origins: str = ""
    database_url: str | None = Field(
        default=None,
        validation_alias=AliasChoices("DATABASE_URL", "DRPE_DATABASE_URL"),
    )
    drpe_seed_yaml: bool = False
    redis_url: str | None = Field(
        default=None,
        validation_alias=AliasChoices("REDIS_URL", "DRPE_REDIS_URL"),
    )
    drpe_redis_ttl_seconds: int = 300
    drpe_redis_key_prefix: str = "drpe"
    celery_broker_url: str | None = Field(
        default=None,
        validation_alias=AliasChoices("CELERY_BROKER_URL", "DRPE_CELERY_BROKER_URL"),
    )
    drpe_enforce_interval_seconds: int = 3600
    drpe_webhook_url: str | None = Field(
        default=None,
        validation_alias=AliasChoices("DRPE_WEBHOOK_URL", "WEBHOOK_URL"),
    )
    drpe_celery_eager: bool = False

    privacy_mask_enabled: bool = True
    privalyse_model_size: str = "sm"
    privalyse_languages: str = "en"
    privalyse_allow_list: str = ""
    privacy_mapping_ttl_seconds: int = 300

    @property
    def privalyse_languages_list(self) -> list[str]:
        if not self.privalyse_languages.strip():
            return ["en"]
        return [lang.strip() for lang in self.privalyse_languages.split(",") if lang.strip()]

    @property
    def privalyse_allow_list_items(self) -> list[str]:
        if not self.privalyse_allow_list.strip():
            return []
        return [item.strip() for item in self.privalyse_allow_list.split(",") if item.strip()]

    @property
    def policies_path(self) -> Path:
        return Path(self.drpe_policies_dir)

    @property
    def cors_origins_list(self) -> list[str]:
        if not self.drpe_cors_origins.strip():
            return []
        return [o.strip() for o in self.drpe_cors_origins.split(",") if o.strip()]

    @property
    def effective_celery_broker_url(self) -> str | None:
        return self.celery_broker_url or self.redis_url
