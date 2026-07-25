"""Console entry point for the ROS Policy API server."""

from __future__ import annotations


def main() -> None:
    """Start the FastAPI server (requires the ``api`` extra)."""
    try:
        from drpe.api.app import main as api_main
    except ImportError as exc:  # pragma: no cover - exercised when extras missing
        raise SystemExit(
            "The API server needs optional dependencies.\n"
            'Install with:  pip install "drpe[api]"\n'
            "Or from this repo:  pip install -e \".[api]\""
        ) from exc
    api_main()


if __name__ == "__main__":
    main()
