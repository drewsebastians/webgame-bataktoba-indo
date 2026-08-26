#!/usr/bin/env python3
from pathlib import Path

p = Path("tools/build-dist.mjs")
s = p.read_text(encoding="utf-8")
old = "      else if (textExt.has(extname(full))) {"
new = '      else if (name === "_redirects" || name === ".nojekyll" || textExt.has(extname(full))) {'
assert old in s
p.write_text(s.replace(old, new, 1), encoding="utf-8", newline="\n")
print("patched")
