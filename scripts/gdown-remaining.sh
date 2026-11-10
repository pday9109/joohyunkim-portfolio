#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
GDOWN=(env -i HOME="$HOME" USER="$USER" PATH="/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/Users/dayoungpark/Library/Python/3.9/bin" TMPDIR="${TMPDIR:-/tmp}" python3)
LOG="${TMPDIR:-/tmp}/gdown-remaining.log"

dl() {
  local name="$1" id="$2" out="$3"
  echo "=== START $name $(date) ===" | tee -a "$LOG"
  "${GDOWN[@]}" scripts/resilient_gdown_folder.py "$id" "$out" 2>&1 | tee -a "$LOG" || true
  echo "=== END $name $(date) ===" | tee -a "$LOG"
  sleep 20
}

# 2026 already complete (~22 files); resume rest with per-file downloader
dl "2025" "1LztB5pYTYWRo8ZdBDDqn-dUAEGayMzik" "_materials/03_work/2025"
dl "2024" "1kpmmfEldYHeWfC-Iz6znAmxI05IsCQMp" "_materials/03_work/2024"
dl "2023" "1gxE5QqL6u5agGX2eFQAjeimnAfH4yQUU" "_materials/03_work/2023"
dl "2022" "1EJMoA7qDDGxFYCXccAVgqIv3EMut8xFd" "_materials/03_work/2022"
dl "solo" "1mHu7UxSTMuWByBxy9nXtPXGRnYVqm4WX" "_materials/04_exhibition/solo"
dl "group" "1lGfxz8XgnWPeXe6pkXllj6CO5b2jNo-0" "_materials/04_exhibition/group"
echo "ALL_DOWNLOADS_DONE" | tee -a "$LOG"
