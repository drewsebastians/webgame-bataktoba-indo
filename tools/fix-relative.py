#!/usr/bin/env python3
from pathlib import Path

p = Path("tools/build-dist.mjs")
s = p.read_text(encoding="utf-8")

s = s.replace(
    'import { dirname, extname, join } from "node:path";',
    'import { dirname, extname, join, relative } from "node:path";',
)

old = """      (match, head, spec, quote) => {
        const base = join(dirname(target), spec).slice(distDir.length + 1).replace(/\\\\/g, "/");
        const mapped = manifest.get(base);
        return mapped ? `${head}${specifyRelative(dirname(target), mapped)}${quote}` : match;
      },"""
new = """      (match, head, spec, quote) => {
        const base = join(dirname(target), spec)
          .slice(distDir.length + 1)
          .replace(/\\\\/g, "/");
        const mapped = manifest.get(base);
        if (!mapped) return match;
        let relSpec = relative(dirname(target), join(distDir, mapped)).replace(/\\\\/g, "/");
        if (!relSpec.startsWith(".")) relSpec = "./" + relSpec;
        return `${head}${relSpec}${quote}`;
      },"""
assert old in s, "rewrite block not found"
s = s.replace(old, new, 1)

# drop now-unused helper
start = s.index("  function specifyRelative(")
end = s.index("}\n", s.index("return `${ups ?")) + 2
s = s[:start] + s[end:]

p.write_text(s, encoding="utf-8", newline="\n")
print("relative() strategy applied")
