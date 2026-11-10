#!/usr/bin/env python3
"""Download a Drive folder file-by-file (tolerates per-file gdown failures)."""
from __future__ import annotations

import os
import sys
import time

_ALLOWED = {"HOME", "USER", "PATH", "TMPDIR"}
for key in list(os.environ):
    if key not in _ALLOWED:
        del os.environ[key]
os.environ.setdefault(
    "PATH",
    "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/Users/dayoungpark/Library/Python/3.9/bin",
)

import gdown  # noqa: E402
from gdown.download_folder import download_folder  # noqa: E402


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: resilient_gdown_folder.py <folder_id> <output_dir>", file=sys.stderr)
        return 2
    folder_id, output = sys.argv[1], sys.argv[2]
    os.makedirs(output, exist_ok=True)
    files = download_folder(
        id=folder_id,
        output=output,
        quiet=False,
        remaining_ok=True,
        skip_download=True,
    )
    if not files:
        print("No files listed in folder", file=sys.stderr)
        return 1
    failed: list[str] = []
    for i, item in enumerate(files):
        dest = item.local_path
        os.makedirs(os.path.dirname(dest) or output, exist_ok=True)
        if os.path.isfile(dest) and os.path.getsize(dest) > 0:
            continue
        try:
            gdown.download(id=item.id, output=dest, quiet=False, resume=True)
        except Exception as exc:  # noqa: BLE001
            failed.append(f"{item.path} ({item.id}): {exc}")
            print(f"FAILED {item.path}: {exc}", file=sys.stderr)
        if i + 1 < len(files):
            time.sleep(2)
    if failed:
        print(f"\n{len(failed)} file(s) failed:", file=sys.stderr)
        for line in failed:
            print(f"  - {line}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
