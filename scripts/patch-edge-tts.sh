#!/bin/bash
# Patch edge-tts-universal's hardcoded Chromium version
# The package uses Chromium 130.x which Microsoft now rejects with 403.
# Python's edge-tts uses 143.x and works. This script patches the Node.js version to match.
#
# This is needed because edge-tts-universal@1.3.3 hasn't been updated since Nov 2025
# and Microsoft's Edge TTS WebSocket endpoint rejects old Chromium user agents.

DIST_DIR="node_modules/edge-tts-universal/dist"

if [ ! -d "$DIST_DIR" ]; then
  # Try pnpm hoisted path
  DIST_DIR=$(find node_modules/.pnpm -path "*/edge-tts-universal/dist" -type d 2>/dev/null | head -1)
fi

if [ -z "$DIST_DIR" ] || [ ! -d "$DIST_DIR" ]; then
  echo "[patch-edge-tts] edge-tts-universal not found, skipping"
  exit 0
fi

OLD_VERSION="130.0.2849.68"
NEW_VERSION="143.0.3650.75"

PATCHED=0
for f in "$DIST_DIR"/*.cjs "$DIST_DIR"/*.js; do
  if [ -f "$f" ] && grep -q "$OLD_VERSION" "$f" 2>/dev/null; then
    sed -i '' "s/$OLD_VERSION/$NEW_VERSION/g" "$f" 2>/dev/null || sed -i "s/$OLD_VERSION/$NEW_VERSION/g" "$f"
    PATCHED=$((PATCHED + 1))
  fi
  # Also ensure zstd in Accept-Encoding
  if [ -f "$f" ] && grep -q '"gzip, deflate, br"' "$f" 2>/dev/null; then
    sed -i '' 's/"gzip, deflate, br"/"gzip, deflate, br, zstd"/g' "$f" 2>/dev/null || sed -i 's/"gzip, deflate, br"/"gzip, deflate, br, zstd"/g' "$f"
  fi
done

if [ "$PATCHED" -gt 0 ]; then
  echo "[patch-edge-tts] Patched $PATCHED files: Chromium $OLD_VERSION → $NEW_VERSION"
else
  echo "[patch-edge-tts] Already up to date or no files to patch"
fi
