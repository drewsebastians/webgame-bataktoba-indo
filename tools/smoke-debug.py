#!/usr/bin/env python3
"""Make smoke-test child stderr visible for debugging."""
from pathlib import Path

p = Path("tools/e2e-smoke.mjs")
s = p.read_text(encoding="utf-8")
needle = "child.stderr.resume();"
replacement = 'child.stderr.on("data", (d) => console.error(String(d).trim()));'
assert needle in s
p.write_text(s.replace(needle, replacement, 1), encoding="utf-8", newline="\n")
print("stderr visible")
