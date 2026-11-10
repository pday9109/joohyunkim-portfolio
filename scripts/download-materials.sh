#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MATERIALS="$ROOT/_materials"
GDOWN="python3 -m gdown"

mkdir -p "$MATERIALS"

echo "Downloading Artist_Website_Materials from Google Drive..."
$GDOWN --folder "https://drive.google.com/drive/folders/1JzhtbWAXmn_fLltQAncHws0bqbwj_Wp5" \
  -O "$MATERIALS" \
  --remaining-ok

echo "Importing into public/ and content/..."
cd "$ROOT"
npm run import:materials
npm run validate:content

echo "Done."
