#!/usr/bin/env bash
# Build ROS Policy Docker images (API and/or Admin).
#
# Usage:
#   ./scripts/docker-build.sh              # build API + Admin images
#   ./scripts/docker-build.sh api          # API image only
#   ./scripts/docker-build.sh admin        # Admin image only
#   ./scripts/docker-build.sh compose      # build via docker compose only
#   TAG=v0.1.0 ./scripts/docker-build.sh  # tag as drpe-api:v0.1.0 / drpe-admin:v0.1.0
#
# Env:
#   TAG          Image tag (default: latest)
#   API_IMAGE    API image name (default: drpe-api)
#   ADMIN_IMAGE  Admin image name (default: drpe-admin)
#   NO_CACHE=1   Pass --no-cache to docker build / compose
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TAG="${TAG:-latest}"
API_IMAGE="${API_IMAGE:-drpe-api}"
ADMIN_IMAGE="${ADMIN_IMAGE:-drpe-admin}"
TARGET="${1:-both}"

CACHE_ARGS=()
if [[ "${NO_CACHE:-}" == "1" ]]; then
  CACHE_ARGS+=(--no-cache)
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "error: docker not found on PATH" >&2
  exit 1
fi

build_api() {
  echo "==> Building ${API_IMAGE}:${TAG}"
  docker build "${CACHE_ARGS[@]}" \
    -f Dockerfile \
    -t "${API_IMAGE}:${TAG}" \
    .
}

build_admin() {
  echo "==> Building ${ADMIN_IMAGE}:${TAG}"
  docker build "${CACHE_ARGS[@]}" \
    -f admin/Dockerfile \
    -t "${ADMIN_IMAGE}:${TAG}" \
    ./admin
}

build_compose() {
  if ! docker compose version >/dev/null 2>&1; then
    echo "error: docker compose plugin not available" >&2
    exit 1
  fi
  echo "==> Building via docker compose"
  docker compose build "${CACHE_ARGS[@]}"
}

case "$TARGET" in
  api)
    build_api
    ;;
  admin)
    build_admin
    ;;
  both|all)
    build_api
    build_admin
    ;;
  compose)
    build_compose
    ;;
  -h|--help|help)
    sed -n '2,16p' "$0"
    exit 0
    ;;
  *)
    echo "error: unknown target '$TARGET' (use: api | admin | both | compose)" >&2
    exit 1
    ;;
esac

echo "Done."
case "$TARGET" in
  compose)
    echo "  Images built by docker compose (see: docker compose images)."
    echo "  Run stack: docker compose up"
    ;;
  api)
    echo "  API: ${API_IMAGE}:${TAG}"
    echo "  Run: docker run --rm -p 8000:8000 ${API_IMAGE}:${TAG}"
    ;;
  admin)
    echo "  Admin: ${ADMIN_IMAGE}:${TAG}"
    echo "  Run: docker run --rm -p 3000:3000 -e DRPE_API_URL=http://host.docker.internal:8000 ${ADMIN_IMAGE}:${TAG}"
    ;;
  *)
    echo "  API:   ${API_IMAGE}:${TAG}"
    echo "  Admin: ${ADMIN_IMAGE}:${TAG}"
    echo "  Run stack: docker compose up"
    ;;
esac
