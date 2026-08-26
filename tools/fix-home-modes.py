#!/usr/bin/env python3
from pathlib import Path

c = Path("assets/js/config.js")
s = c.read_text(encoding="utf-8")
if "PRACTICE_MODES" not in s:
    modes = 'export const PRACTICE_MODES = Object.freeze(["meaning", "reverse", "typed", "truefalse", "matching", "memory", "daily", "sentence"]);\n\n'
    s = s.replace("export function absoluteUrl", modes + "export function absoluteUrl", 1)
    c.write_text(s, encoding="utf-8", newline="\n")
    print("config modes added")

a = Path("assets/js/app.js")
s = a.read_text(encoding="utf-8")
s = s.replace(
    'import { SITE_CONFIG } from "./config.js";',
    'import { PRACTICE_MODES, SITE_CONFIG } from "./config.js";',
    1,
)
s = s.replace('[5, "mode latihan"],', "[PRACTICE_MODES.length, 'mode latihan'],".replace("'", '"'), 1)
s = s.replace('        track("lesson_start", { kind: "onboarding" });\n', "")
a.write_text(s, encoding="utf-8", newline="\n")
print("app home/onboarding fixed")
