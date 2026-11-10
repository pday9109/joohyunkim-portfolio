#!/usr/bin/env python3
"""Run gdown with a clean environment (no injected HTTP_PROXY)."""
import os
import sys

def clean_environ():
    home = os.environ.get("HOME", "")
    user = os.environ.get("USER", "")
    tmp = os.environ.get("TMPDIR", "/tmp")
    path = "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/Users/dayoungpark/Library/Python/3.9/bin"
    return {
        "HOME": home,
        "USER": user,
        "PATH": path,
        "TMPDIR": tmp,
    }

def main():
    if len(sys.argv) < 2:
        print("usage: exec_gdown.py <gdown args...>", file=sys.stderr)
        sys.exit(2)
    env = clean_environ()
    os.execvpe(
        sys.executable,
        [sys.executable, "-m", "gdown", *sys.argv[1:]],
        env,
    )

if __name__ == "__main__":
    main()
