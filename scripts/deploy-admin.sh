#!/usr/bin/env bash
# Deploy the ROS Policy Admin UI (Next.js) to Vercel (Royal Platform by default).
# Does not build or deploy the FastAPI backend (use scripts/build-backend.sh for VPS).
#
# Prerequisites:
#   - Vercel CLI (npx vercel or a global `vercel`)
#   - Logged in: vercel login  (or set VERCEL_TOKEN for CI)
#   - Access to the target team (default: royal-platform)
#   - DRPE_API_URL set in the Vercel project (Production / Preview)
#
# Usage:
#   ./scripts/deploy-admin.sh              # preview on Royal Platform
#   ./scripts/deploy-admin.sh --prod       # production
#   ./scripts/deploy-admin.sh --link       # link/create project on Royal Platform, then preview
#   ./scripts/deploy-admin.sh --link --prod
#   ./scripts/deploy-admin.sh --yes --prod # non-interactive (CI / already linked)
#   ./scripts/deploy-admin.sh --scope other-team --project my-admin --link --prod
#   ./scripts/deploy-admin.sh --prebuilt --prod
#
# Env (same as flags):
#   SCOPE        Vercel team slug/id (default: royal-platform)
#   PROJECT      Vercel project name (default: ros-policy-admin)
#   PROD=1       Deploy to production
#   LINK=1       Run `vercel link` before deploy
#   YES=1        Pass --yes (skip prompts; required in CI)
#   PREBUILT=1   Deploy local `.vercel/output` (run `vercel build` first)
#   VERCEL_TOKEN Optional; CI token (never commit)
#   VERCEL_ORG_ID / VERCEL_PROJECT_ID  Optional; used when .vercel is absent in CI
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADMIN_DIR="${ROOT}/admin"
cd "$ROOT"

# Default: Royal Platform team + dedicated Admin project name
SCOPE="${SCOPE:-royal-platform}"
PROJECT="${PROJECT:-ros-policy-admin}"
PROD="${PROD:-0}"
LINK="${LINK:-0}"
YES="${YES:-0}"
PREBUILT="${PREBUILT:-0}"

usage() {
  sed -n '2,28p' "$0"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prod|prod)
      PROD=1
      shift
      ;;
    --preview|preview)
      PROD=0
      shift
      ;;
    --link|link)
      LINK=1
      shift
      ;;
    --yes|-y|yes)
      YES=1
      shift
      ;;
    --prebuilt|prebuilt)
      PREBUILT=1
      shift
      ;;
    --scope=*)
      SCOPE="${1#*=}"
      shift
      ;;
    --scope|scope)
      if [[ $# -lt 2 || "$2" == -* ]]; then
        echo "error: --scope requires a team slug or id (e.g. royal-platform)" >&2
        exit 1
      fi
      SCOPE="$2"
      shift 2
      ;;
    --project=*)
      PROJECT="${1#*=}"
      shift
      ;;
    --project|project)
      if [[ $# -lt 2 || "$2" == -* ]]; then
        echo "error: --project requires a name (e.g. ros-policy-admin)" >&2
        exit 1
      fi
      PROJECT="$2"
      shift 2
      ;;
    -h|--help|help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown argument '$1' (use: --prod | --preview | --link | --yes | --prebuilt | --scope <team> | --project <name> | --help)" >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$ADMIN_DIR" ]]; then
  echo "error: admin directory not found at ${ADMIN_DIR}" >&2
  exit 1
fi

if [[ ! -f "${ADMIN_DIR}/package.json" || ! -f "${ADMIN_DIR}/vercel.json" ]]; then
  echo "error: ${ADMIN_DIR} does not look like the Admin Next.js app (missing package.json or vercel.json)" >&2
  exit 1
fi

resolve_vercel() {
  if command -v vercel >/dev/null 2>&1; then
    echo "vercel"
    return
  fi
  if command -v npx >/dev/null 2>&1; then
    echo "npx vercel"
    return
  fi
  echo ""
}

VERCEL_BIN="$(resolve_vercel)"
if [[ -z "$VERCEL_BIN" ]]; then
  echo "error: vercel CLI not found. Install with: npm i -g vercel  (or ensure npx is available)" >&2
  exit 1
fi

# shellcheck disable=SC2206
VERCEL_CMD=($VERCEL_BIN)

YES_ARGS=()
if [[ "$YES" == "1" ]]; then
  YES_ARGS+=(--yes)
fi

SCOPE_ARGS=()
if [[ -n "$SCOPE" ]]; then
  SCOPE_ARGS+=(--scope "$SCOPE")
fi

echo "==> Admin deploy target: ${ADMIN_DIR}"
echo "==> Vercel CLI: ${VERCEL_CMD[*]}"
echo "==> Scope:   ${SCOPE:-"(default / linked)"}"
echo "==> Project: ${PROJECT}"

if [[ "$LINK" != "1" && -n "$SCOPE" && "$SCOPE" == "royal-platform" && -f "${ADMIN_DIR}/.vercel/project.json" ]]; then
  if ! grep -q '"projectName"[[:space:]]*:[[:space:]]*"'"${PROJECT}"'"' "${ADMIN_DIR}/.vercel/project.json" 2>/dev/null; then
    echo "warning: admin/.vercel is linked to a different project; re-link with --link" >&2
    echo "         ./scripts/deploy-admin.sh --link --yes" >&2
  fi
fi

if [[ "$LINK" == "1" ]]; then
  echo "==> Linking to ${SCOPE:-default}/${PROJECT}"
  (
    cd "$ADMIN_DIR"
    LINK_ARGS=(link --project "$PROJECT")
    LINK_ARGS+=(${SCOPE_ARGS[@]+"${SCOPE_ARGS[@]}"})
    if [[ "$YES" == "1" ]]; then
      LINK_ARGS+=(--yes)
    fi
    "${VERCEL_CMD[@]}" "${LINK_ARGS[@]}"
  )
elif [[ ! -d "${ADMIN_DIR}/.vercel" && -z "${VERCEL_PROJECT_ID:-}" ]]; then
  echo "warning: admin/.vercel is missing and VERCEL_PROJECT_ID is unset." >&2
  echo "         First time: ./scripts/deploy-admin.sh --link --yes" >&2
  echo "         Or import the repo in Vercel (team Royal Platform) with Root Directory = admin." >&2
fi

DEPLOY_ARGS=(deploy --cwd "$ADMIN_DIR")
DEPLOY_ARGS+=(${SCOPE_ARGS[@]+"${SCOPE_ARGS[@]}"})
if [[ "$PROD" == "1" ]]; then
  DEPLOY_ARGS+=(--prod)
  echo "==> Deploying Admin to production (${SCOPE}/${PROJECT})"
else
  echo "==> Deploying Admin preview (${SCOPE}/${PROJECT})"
fi
if [[ "$PREBUILT" == "1" ]]; then
  DEPLOY_ARGS+=(--prebuilt)
  echo "==> Using --prebuilt (expects admin/.vercel/output from prior vercel build)"
fi
DEPLOY_ARGS+=(${YES_ARGS[@]+"${YES_ARGS[@]}"})

# Capture URL from stdout; Vercel prints the deployment URL as the last line.
set +e
DEPLOY_OUT="$("${VERCEL_CMD[@]}" "${DEPLOY_ARGS[@]}" 2>&1)"
DEPLOY_STATUS=$?
set -e
printf '%s\n' "$DEPLOY_OUT"

if [[ $DEPLOY_STATUS -ne 0 ]]; then
  echo "error: vercel deploy failed (exit ${DEPLOY_STATUS})" >&2
  exit "$DEPLOY_STATUS"
fi

DEPLOY_URL="$(printf '%s\n' "$DEPLOY_OUT" | grep -Eo 'https://[^[:space:]"]+\.vercel\.app' | grep -v 'api\.vercel\.com' | tail -n 1 || true)"
if [[ -z "$DEPLOY_URL" ]]; then
  DEPLOY_URL="$(printf '%s\n' "$DEPLOY_OUT" | grep -Eo 'https://[^[:space:]"]+' | grep -v 'api\.vercel\.com' | tail -n 1 || true)"
fi

echo
echo "Done."
if [[ -n "$DEPLOY_URL" ]]; then
  echo "  Deployment URL: ${DEPLOY_URL}"
fi
echo "  Team:           ${SCOPE}"
echo "  Project:        ${PROJECT}"
if [[ "$PROD" == "1" ]]; then
  echo "  Environment:    production"
else
  echo "  Environment:    preview"
fi
echo
echo "Ensure Vercel env DRPE_API_URL points at your public FastAPI base URL (no trailing slash)."
echo "  vercel env add DRPE_API_URL production --scope ${SCOPE} --cwd admin"
echo "Env vars and dashboard notes: admin/README.md#deploy-on-vercel"
echo
echo "Backend (VPS) image build (separate):"
echo "  ./scripts/build-backend.sh --platform linux/amd64 --save"
