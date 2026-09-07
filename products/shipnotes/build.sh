#!/usr/bin/env bash
# ShipNotes — package cli + action + README into dist/
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$ROOT/dist"
VERSION="0.1.0"
OUT="$DIST_DIR/shipnotes-v${VERSION}.zip"

mkdir -p "$DIST_DIR"
rm -f "$OUT"

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "error: required command not found: $1" >&2
    exit 1
  }
}
need_cmd zip

for path in cli action README.md; do
  if [[ ! -e "$ROOT/$path" ]]; then
    echo "error: missing $path" >&2
    exit 1
  fi
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$TMP/shipnotes"
cp -a "$ROOT/cli" "$TMP/shipnotes/"
cp -a "$ROOT/action" "$TMP/shipnotes/"
cp -a "$ROOT/README.md" "$TMP/shipnotes/"

find "$TMP" -name .DS_Store -delete

(
  cd "$TMP"
  zip -r -X "$OUT" shipnotes -x "*.DS_Store" -x "**/.DS_Store"
)

echo "wrote $(basename "$OUT") ($(wc -c < "$OUT" | tr -d ' ') bytes)"
ls -la "$DIST_DIR"
