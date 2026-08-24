#!/usr/bin/env python3
"""Check how many published items match each theme keyword list."""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def norm(v):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", str(v or ""))).strip().lower()


keywords = json.loads((ROOT / "content/themes/keywords.json").read_text(encoding="utf-8"))["themes"]
words = json.loads((ROOT / "data/published/word-pairs.json").read_text(encoding="utf-8"))["items"]

for theme, entry in keywords.items():
    kb = {norm(k) for k in entry["batak"]}
    ki = {norm(k) for k in entry["indonesia"]}
    matched_b = [w for w in words if norm(w["batak"]) in kb]
    matched_i = [w for w in words if norm(w["indonesia"]) in ki]
    both = {(w["id"]) for w in matched_b} | {w["id"] for w in matched_i}
    print(f"{theme}: pool={len(both)}")
    for w in [x for x in words if x["id"] in both][:12]:
        print("   ", w["batak"], "->", w["indonesia"])
