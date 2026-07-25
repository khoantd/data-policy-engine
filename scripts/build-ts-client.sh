#!/usr/bin/env bash
# Build + pack the TypeScript OpenAPI client for install in other projects.
#
# Usage:
#   ./scripts/build-ts-client.sh
#   ./scripts/build-ts-client.sh --clean
#
# Consume in another project:
#   npm install ./dist/khoadue-drpe-api-client-*.tgz
#   # or path (after build):
#   npm install /path/to/data-policy-engine/clients/typescript
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLIENT="$ROOT/clients/typescript"
OUT_DIR="${OUT_DIR:-$ROOT/dist}"

CLEAN=0
for arg in "$@"; do
  case "$arg" in
    --clean|-c) CLEAN=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

cd "$CLIENT"

if [[ "$CLEAN" -eq 1 ]]; then
  rm -rf dist node_modules
  rm -f "$OUT_DIR"/khoadue-drpe-api-client-*.tgz
  rm -f "$OUT_DIR"/drpe-api-client-*.tgz
  rm -f khoadue-drpe-api-client-*.tgz drpe-api-client-*.tgz
fi

echo "==> Installing client devDependencies…"
npm install

echo "==> Building CJS + ESM…"
npm run build

mkdir -p "$OUT_DIR"

echo "==> Packing tarball…"
# npm pack writes into cwd; move to repo dist/
TARBALL="$(npm pack --pack-destination "$OUT_DIR" | tail -1)"

echo
echo "Artifact:"
ls -lh "$OUT_DIR/$TARBALL"

echo
echo "Install into another project:"
echo "  npm install \"$OUT_DIR/$TARBALL\""
echo "  # or from registry after publish:"
echo "  npm install @khoadue/drpe-api-client"
echo
echo "Or path install (after this build):"
echo "  npm install \"$CLIENT\""
echo
echo "Usage:"
echo "  import { Configuration, PoliciesApi } from \"@khoadue/drpe-api-client\";"
