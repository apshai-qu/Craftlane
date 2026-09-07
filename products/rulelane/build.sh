#!/usr/bin/env bash
# RuleLane Packs — zip each pack + an all-packs bundle into dist/
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKS_DIR="$ROOT/packs"
DIST_DIR="$ROOT/dist"
VERSION="0.1.0"

mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR"/rulelane-*-v"${VERSION}".zip

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "error: required command not found: $1" >&2
    exit 1
  }
}
need_cmd zip

zip_pack() {
  local name="$1"
  local src="$PACKS_DIR/$name"
  local out="$DIST_DIR/rulelane-${name}-v${VERSION}.zip"

  if [[ ! -d "$src" ]]; then
    echo "error: missing pack directory: $src" >&2
    exit 1
  fi

  # Zip contents at archive root (not nested under packs/name/)
  (
    cd "$src"
    zip -r -X "$out" . -x "*.DS_Store" -x "**/.DS_Store"
  )
  echo "wrote $(basename "$out") ($(wc -c < "$out" | tr -d ' ') bytes)"
}

echo "Building RuleLane packs v${VERSION} → $DIST_DIR"

zip_pack nextjs
zip_pack python
zip_pack go

# Bundle: each pack under its own folder inside the zip
ALL_OUT="$DIST_DIR/rulelane-all-v${VERSION}.zip"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for name in nextjs python go; do
  mkdir -p "$TMP/$name"
  cp -a "$PACKS_DIR/$name"/. "$TMP/$name"/
done

# Top-level README for the bundle
cat > "$TMP/README.md" << 'BUNDLE'
# RuleLane Packs — All Bundle

**Version:** 0.1.0

This archive contains three curated editor/agent rule packs:

| Folder | Focus |
|--------|--------|
| `nextjs/` | Next.js App Router · TypeScript · Tailwind |
| `python/` | Modern Python · uv/poetry · FastAPI · pytest |
| `go/` | Idiomatic Go services · testing · errors |

## Install

For each pack you want, copy `.cursorrules` and `AGENTS.md` into the root of the matching project (see that folder's `README.md` for Cursor / VS Code steps).

## Support

admin@craftlane.app
BUNDLE

(
  cd "$TMP"
  zip -r -X "$ALL_OUT" . -x "*.DS_Store" -x "**/.DS_Store"
)
echo "wrote $(basename "$ALL_OUT") ($(wc -c < "$ALL_OUT" | tr -d ' ') bytes)"

echo "Done."
ls -la "$DIST_DIR"
