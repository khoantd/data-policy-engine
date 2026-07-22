#!/usr/bin/env python3
"""Export FastAPI OpenAPI schema to openapi/openapi.json (offline, no DB/Redis)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Repo root on sys.path when run as `python scripts/export_openapi.py`
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from drpe.api.app import create_app
from drpe.api.settings import Settings


def main() -> None:
    # Force in-memory wiring; ignore local .env DATABASE_URL / REDIS_URL.
    settings = Settings(
        _env_file=None,
        database_url=None,
        redis_url=None,
        celery_broker_url=None,
        drpe_seed_yaml=False,
        drpe_api_key=None,
        drpe_require_auth=False,
    )
    app = create_app(settings)
    schema = app.openapi()
    # FastAPI omits servers by default; pin a local default for generated clients.
    schema["servers"] = [{"url": "http://localhost:8000", "description": "Local DRPE API"}]
    out = ROOT / "openapi" / "openapi.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(schema, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out.relative_to(ROOT)} ({len(schema.get('paths', {}))} paths)")


if __name__ == "__main__":
    main()
