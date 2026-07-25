#!/usr/bin/env bash
# Build installable Python SDK artifacts (wheel + sdist) into dist/.
#
# Usage:
#   ./scripts/build-sdk.sh
#   ./scripts/build-sdk.sh --clean
#
# Consume in another project:
#   pip install ./dist/drpe-*-py3-none-any.whl
#   # or path install without building:
#   pip install /path/to/data-policy-engine
#   # API server extras:
#   pip install "./dist/drpe-*-py3-none-any.whl[api]"
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CLEAN=0
for arg in "$@"; do
  case "$arg" in
    --clean|-c) CLEAN=1 ;;
    -h|--help)
      sed -n '2,14p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

if [[ "$CLEAN" -eq 1 ]]; then
  rm -rf dist/ build/ *.egg-info drpe.egg-info
fi

PYTHON="${PYTHON:-}"
if [[ -z "$PYTHON" ]]; then
  if [[ -x "$ROOT/.venv/bin/python" ]]; then
    PYTHON="$ROOT/.venv/bin/python"
  else
    PYTHON="python3"
  fi
fi

echo "==> Ensuring build frontend (pip install build)…"
"$PYTHON" -m pip install -q build

echo "==> Building sdist + wheel…"
"$PYTHON" -m build

echo
echo "Artifacts:"
ls -lh dist/drpe-*.whl dist/drpe-*.tar.gz 2>/dev/null || ls -lh dist/

WHEEL="$(ls -1 dist/drpe-*-py3-none-any.whl | sort | tail -1)"
echo
echo "Install into another project:"
echo "  pip install \"$WHEEL\""
echo "  # with API server:"
echo "  pip install \"${WHEEL}[api]\""
echo
echo "Or editable from this repo (SDK only):"
echo "  pip install -e \"$ROOT\""
echo "  # with API + tests:"
echo "  pip install -e \"$ROOT[dev]\""
