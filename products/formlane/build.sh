#!/usr/bin/env bash
# FormLane Worker — zip template into dist/ (no secrets, no node_modules)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$ROOT/dist"
VERSION="0.1.0"
OUT="$DIST_DIR/formlane-worker-v${VERSION}.zip"

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "error: required command not found: $1" >&2
    exit 1
  }
}
need_cmd zip

mkdir -p "$DIST_DIR"
rm -f "$OUT"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

STAGE="$TMP/formlane-worker"
mkdir -p "$STAGE/worker/src" "$STAGE/embed"

cp -a "$ROOT/worker/src/index.ts" "$STAGE/worker/src/"
cp -a "$ROOT/worker/package.json" "$STAGE/worker/"
cp -a "$ROOT/worker/tsconfig.json" "$STAGE/worker/"
cp -a "$ROOT/wrangler.toml.example" "$STAGE/"
cp -a "$ROOT/.dev.vars.example" "$STAGE/"
cp -a "$ROOT/README.md" "$STAGE/"
cp -a "$ROOT/CHANGELOG.md" "$STAGE/"
cp -a "$ROOT/embed/snippet.html" "$STAGE/embed/"

# Ensure no secrets / junk sneak in
rm -f "$STAGE/worker/.dev.vars" "$STAGE/worker/wrangler.toml" 2>/dev/null || true
rm -rf "$STAGE/worker/node_modules" "$STAGE/worker/.wrangler" 2>/dev/null || true

(
  cd "$TMP"
  zip -r -X "$OUT" formlane-worker \
    -x "*.DS_Store" \
    -x "**/.DS_Store" \
    -x "**/node_modules/**" \
    -x "**/.dev.vars" \
    -x "**/wrangler.toml" \
    -x "**/.wrangler/**"
)

echo "wrote $(basename "$OUT") ($(wc -c < "$OUT" | tr -d ' ') bytes)"
ls -la "$DIST_DIR"
