#!/usr/bin/env python3
from pathlib import Path

p = Path("assets/js/app.js")
s = p.read_text(encoding="utf-8")

old = "  const poolItems = lesson.itemIds.map((id) => itemById.get(id)).filter(Boolean);"
new = """  const poolItemIds = lesson
    ? lesson.itemIds
    : (topicMeta?.itemIds ?? []);
  const poolItems = poolItemIds.map((id) => itemById.get(id)).filter(Boolean);"""
assert old in s
s = s.replace(old, new, 1)

p.write_text(s, encoding="utf-8", newline="\n")
print("draft-topic pool derived from themes")
