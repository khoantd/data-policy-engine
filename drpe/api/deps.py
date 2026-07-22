"""FastAPI dependencies."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from drpe.api.settings import Settings
from drpe.core.classifier import ClassificationEngine
from drpe.core.evaluator import PolicyEvaluatorEngine
from drpe.ports.policy_store import PolicyStore

# auto_error=False keeps optional-auth behavior; scheme still appears in OpenAPI.
bearer_scheme = HTTPBearer(
    auto_error=False,
    scheme_name="BearerAuth",
    description="API key as Bearer token (DRPE_API_KEY)",
)


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_store(request: Request) -> PolicyStore:
    return request.app.state.store


def get_engine(request: Request) -> PolicyEvaluatorEngine:
    return request.app.state.engine


async def verify_api_key(
    request: Request,
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ] = None,
) -> None:
    settings: Settings = request.app.state.settings
    if not settings.drpe_require_auth and not settings.drpe_api_key:
        return
    expected = settings.drpe_api_key
    if not expected:
        return
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if credentials.credentials.strip() != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_classifier(request: Request) -> ClassificationEngine:
    return request.app.state.classifier


SettingsDep = Annotated[Settings, Depends(get_settings)]
StoreDep = Annotated[PolicyStore, Depends(get_store)]
EngineDep = Annotated[PolicyEvaluatorEngine, Depends(get_engine)]
ClassifierDep = Annotated[ClassificationEngine, Depends(get_classifier)]
AuthDep = Annotated[None, Depends(verify_api_key)]
