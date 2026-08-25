#!/usr/bin/env python3
from pathlib import Path

p = Path("tools/build-dist.mjs")
s = p.read_text(encoding="utf-8")
old = 'import { join } from "node:path";'
new = 'import { dirname, extname, join } from "node:path";'
assert old in s
p.write_text(s.replace(old, new, 1), encoding="utf-8", newline="\n")
print("imports fixed")
