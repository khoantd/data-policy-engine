"""FastAPI REST API package."""

from drpe.api.app import create_app

__all__ = ["app", "create_app"]


def __getattr__(name: str):
    if name == "app":
        import drpe.api.app as app_module

        return getattr(app_module, "app")
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
