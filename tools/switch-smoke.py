#!/usr/bin/env python3
"""Switch e2e-smoke to the headers-aware node server serving dist/."""
from pathlib import Path

p = Path("tools/e2e-smoke.mjs")
s = p.read_text(encoding="utf-8")

if "e2e-server.mjs" in s:
    print("already switched")
    raise SystemExit(0)

s = s.replace(
    'import { spawn } from "node:child_process";',
    'import { spawn } from "node:child_process";\n'
    'import { fileURLToPath } from "node:url";\n'
    'import { join } from "node:path";',
    1,
)

old_start = """function startServer() {
  const child = spawn("python", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
    stdio: ["ignore", "ignore", "pipe"],
  });
  child.stderr.resume();
  return child;
}"""
new_start = """function startServer() {
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  const child = spawn(process.execPath, [join("tools", "e2e-server.mjs"), String(PORT)], {
    cwd,
    stdio: ["ignore", "ignore", "pipe"],
  });
  child.stderr.resume();
  return child;
}"""
assert old_start in s, "startServer block not found"
s = s.replace(old_start, new_start, 1)

p.write_text(s, encoding="utf-8", newline="\n")
print("smoke switched to dist server")
