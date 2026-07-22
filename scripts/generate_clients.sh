#!/usr/bin/env bash
# Regenerate OpenAPI clients from committed (or freshly exported) schema.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run openapi
