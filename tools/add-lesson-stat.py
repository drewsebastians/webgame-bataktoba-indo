#!/usr/bin/env python3
from pathlib import Path

p = Path("assets/js/app.js")
s = p.read_text(encoding="utf-8")
needle = '[learning.metadata.counts.wordPairs, "pasangan kata"],'
assert needle in s
insert = '\n        [learning.metadata.counts.publishedLessons ?? 0, "lesson terbit"],'
s = s.replace(needle, needle + insert, 1)
p.write_text(s, encoding="utf-8", newline="\n")
print("lesson count stat added")
