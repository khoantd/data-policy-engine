#!/usr/bin/env bash
# Build the ROS Policy FastAPI backend only (for VPS / API host deploy).
# Does not build the Admin UI (deploy Admin on Vercel separately).
#
# Usage:
#   ./scripts/build-backend.sh
#   ./scripts/build-backend.sh --save
#   ./scripts/build-backend.sh --platform linux/amd64
#   ./scripts/build-backend.sh --platform linux/amd64 --registry docker.io/myuser --push
#   ./scripts/build-backend.sh --registry docker.io/myuser --push --save
#   TAG=v0.1.0 ./scripts/build-backend.sh --registry docker.io/myuser --push
#   NO_CACHE=1 ./scripts/build-backend.sh
#
# Env (same as flags):
#   TAG          Image tag (default: latest)
#   API_IMAGE    Local image name (default: drpe-api)
#   REGISTRY     Registry prefix, e.g. docker.io/myuser
#   PLATFORM     Target platform, e.g. linux/amd64 or linux/arm64
#   PUSH=1       Push tagged image to REGISTRY after build
#   SAVE=1       Write dist/drpe-api-<tag>.tar.gz after build
#   OUT_DIR      Tarball directory (default: dist)
#   NO_CACHE=1   Pass --no-cache to docker build
#   INSTALL_AI=0 Skip privalyse-mask / spaCy (smaller image; privacy mask 503)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TAG="${TAG:-latest}"
API_IMAGE="${API_IMAGE:-drpe-api}"
OUT_DIR="${OUT_DIR:-dist}"
REGISTRY="${REGISTRY:-}"
PLATFORM="${PLATFORM:-}"
SAVE="${SAVE:-0}"
PUSH="${PUSH:-0}"
INSTALL_AI="${INSTALL_AI:-1}"

usage() {
  sed -n '2,22p' "$0"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --save|save)
      SAVE=1
      shift
      ;;
    --push|push)
      PUSH=1
      shift
      ;;
    --registry=*)
      REGISTRY="${1#*=}"
      shift
      ;;
    --registry|registry)
      if [[ $# -lt 2 || "$2" == -* ]]; then
        echo "error: --registry requires a value (e.g. docker.io/myuser)" >&2
        exit 1
      fi
      REGISTRY="$2"
      shift 2
      ;;
    --platform=*)
      PLATFORM="${1#*=}"
      shift
      ;;
    --platform|platform)
      if [[ $# -lt 2 || "$2" == -* ]]; then
        echo "error: --platform requires a value (e.g. linux/amd64)" >&2
        exit 1
      fi
      PLATFORM="$2"
      shift 2
      ;;
    -h|--help|help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown argument '$1' (use: --save | --registry <host> | --platform <os/arch> | --push | --help)" >&2
      exit 1
      ;;
  esac
done

CACHE_ARGS=()
if [[ "${NO_CACHE:-}" == "1" ]]; then
  CACHE_ARGS+=(--no-cache)
fi

PLATFORM_ARGS=()
if [[ -n "$PLATFORM" ]]; then
  PLATFORM_ARGS+=(--platform "$PLATFORM")
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "error: docker not found on PATH" >&2
  exit 1
fi

if [[ "$PUSH" == "1" && -z "$REGISTRY" ]]; then
  echo "error: --push requires --registry <prefix> (or REGISTRY=...)" >&2
  exit 1
fi

# Strip trailing slash from registry prefix
REGISTRY="${REGISTRY%/}"

LOCAL_REF="${API_IMAGE}:${TAG}"
REMOTE_REF=""
if [[ -n "$REGISTRY" ]]; then
  REMOTE_REF="${REGISTRY}/${API_IMAGE}:${TAG}"
fi

if [[ -n "$PLATFORM" ]]; then
  echo "==> Building backend ${LOCAL_REF} (${PLATFORM}, INSTALL_AI=${INSTALL_AI})"
else
  echo "==> Building backend ${LOCAL_REF} (INSTALL_AI=${INSTALL_AI})"
fi

AI_BUILD_ARGS=(--build-arg "INSTALL_AI=${INSTALL_AI}")

# Cross-platform builds need buildx so the image can be loaded/pushed reliably
# (e.g. Apple Silicon → linux/amd64 VPS).
if [[ -n "$PLATFORM" ]]; then
  if [[ "$PUSH" == "1" ]]; then
    # Only tag the registry ref when pushing — bare names like drpe-api:latest
    # resolve to docker.io/library/* and fail with insufficient_scope.
    echo "==> Pushing ${REMOTE_REF}"
    docker buildx build \
      ${CACHE_ARGS[@]+"${CACHE_ARGS[@]}"} \
      ${PLATFORM_ARGS[@]+"${PLATFORM_ARGS[@]}"} \
      "${AI_BUILD_ARGS[@]}" \
      -f Dockerfile \
      -t "${REMOTE_REF}" \
      --push \
      .
  else
    TAG_ARGS=(-t "${LOCAL_REF}")
    if [[ -n "$REMOTE_REF" ]]; then
      TAG_ARGS+=(-t "${REMOTE_REF}")
    fi
    docker buildx build \
      ${CACHE_ARGS[@]+"${CACHE_ARGS[@]}"} \
      ${PLATFORM_ARGS[@]+"${PLATFORM_ARGS[@]}"} \
      "${AI_BUILD_ARGS[@]}" \
      -f Dockerfile \
      "${TAG_ARGS[@]}" \
      --load \
      .
  fi
else
  docker build \
    ${CACHE_ARGS[@]+"${CACHE_ARGS[@]}"} \
    "${AI_BUILD_ARGS[@]}" \
    -f Dockerfile \
    -t "${LOCAL_REF}" \
    .

  if [[ -n "$REMOTE_REF" ]]; then
    echo "==> Tagging ${REMOTE_REF}"
    docker tag "${LOCAL_REF}" "${REMOTE_REF}"
  fi

  if [[ "$PUSH" == "1" ]]; then
    echo "==> Pushing ${REMOTE_REF}"
    docker push "${REMOTE_REF}"
  fi
fi

ARTIFACT=""
if [[ "$SAVE" == "1" ]]; then
  if [[ -n "$PLATFORM" && "$PUSH" == "1" ]]; then
    echo "==> Pulling ${REMOTE_REF} for --save (buildx --push does not leave a local image)"
    docker pull \
      ${PLATFORM_ARGS[@]+"${PLATFORM_ARGS[@]}"} \
      "${REMOTE_REF}"
  fi
  mkdir -p "$OUT_DIR"
  ARTIFACT="${OUT_DIR}/${API_IMAGE}-${TAG}.tar.gz"
  echo "==> Saving image to ${ARTIFACT}"
  # Prefer remote ref when set so the loaded image keeps the registry name
  SAVE_REF="${REMOTE_REF:-$LOCAL_REF}"
  docker save "${SAVE_REF}" | gzip > "$ARTIFACT"
  ls -lh "$ARTIFACT"
fi

echo
echo "Done. Backend image: ${LOCAL_REF}"
if [[ -n "$PLATFORM" ]]; then
  echo "       Platform:     ${PLATFORM}"
fi
if [[ -n "$REMOTE_REF" ]]; then
  echo "       Registry:     ${REMOTE_REF}"
fi
echo
echo "Local smoke test:"
echo "  docker run --rm -p 8000:8000 --env-file .env ${LOCAL_REF}"
echo "  # If .env has REDIS_URL/CELERY_BROKER_URL without DRPE_CELERY_EAGER=true,"
echo "  # also run worker (+ beat) or enforce jobs stay queued."
echo

RUN_REF="${REMOTE_REF:-$LOCAL_REF}"
print_vps_run() {
  local ref="$1"
  echo "  docker run -d --name drpe-api --restart unless-stopped \\"
  echo "    -p 8000:8000 --env-file /path/to/.env ${ref}"
  echo "  # With DB: docker exec drpe-api alembic upgrade head"
  echo "  # When REDIS_URL / CELERY_BROKER_URL is set (and DRPE_CELERY_EAGER is not true):"
  echo "  docker run -d --name drpe-worker --restart unless-stopped \\"
  echo "    --env-file /path/to/.env ${ref} \\"
  echo "    celery -A drpe.scheduler.celery_app.celery_app worker -l info"
  echo "  docker run -d --name drpe-beat --restart unless-stopped \\"
  echo "    --env-file /path/to/.env ${ref} \\"
  echo "    celery -A drpe.scheduler.celery_app.celery_app beat -l info"
}

if [[ -n "$ARTIFACT" ]]; then
  echo "Transfer to VPS:"
  echo "  scp ${ARTIFACT} user@vps:/tmp/"
  echo
  echo "On the VPS:"
  echo "  gunzip -c /tmp/$(basename "$ARTIFACT") | docker load"
  print_vps_run "${RUN_REF}"
elif [[ "$PUSH" == "1" ]]; then
  echo "On the VPS:"
  echo "  docker pull ${REMOTE_REF}"
  print_vps_run "${REMOTE_REF}"
else
  echo "Package for VPS transfer:"
  echo "  ./scripts/build-backend.sh --platform linux/amd64 --save"
  echo
  echo "Or push to a registry and pull on the VPS:"
  echo "  ./scripts/build-backend.sh --platform linux/amd64 --registry docker.io/myuser --push"
fi
