#!/usr/bin/env python3
from pathlib import Path

p = Path("tools/build-dist.mjs")
s = p.read_text(encoding="utf-8")
if "normalizeEol" in s:
    print("already present")
    raise SystemExit(0)

anchor = "console.log(`dist/ built."
ins = (
    "// Normalize text files to LF so committed dist matches Linux CI builds.\n"
    "function normalizeEol(dir) {\n"
    "  const textExt = new Set([\".html\", \".js\", \".css\", \".json\", \".xml\", \".txt\", \".webmanifest\"]);\n"
    "  function walk(d) {\n"
    "    for (const name of readdirSync(d)) {\n"
    "      const full = join(d, name);\n"
    "      if (statSync(full).isDirectory()) walk(full);\n"
    "      else if (textExt.has(extname(full))) {\n"
    "        const buf = readFileSync(full);\n"
    "        const normalized = Buffer.from(buf.toString(\"utf8\").replace(/\\r\\n/g, \"\\n\"), \"utf8\");\n"
    "        if (!buf.equals(normalized)) writeFileSync(full, normalized);\n"
    "      }\n"
    "    }\n"
    "  }\n"
    "  walk(dist);\n"
    "}\n"
    "normalizeEol(dist);\n\n"
)
idx = s.rindex(anchor)
line_start = s.rfind("\n", 0, idx) + 1
s = s[:line_start] + ins + s[line_start:]
p.write_text(s, encoding="utf-8", newline="\n")
print("eol normalize added")
