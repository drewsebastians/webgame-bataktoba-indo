#!/usr/bin/env python3
from pathlib import Path

p = Path("games/index.html")
s = p.read_text(encoding="utf-8")

anchor = '<button class="mode-button" type="button" data-mode="memory">'
insert = (
    '<button class="mode-button" type="button" data-mode="matching">'
    'Matching Pairs <span>pasangkan</span></button>\n            '
)
if 'data-mode="matching"' in s:
    print("already present")
else:
    assert anchor in s
    s = s.replace(anchor, insert + anchor, 1)
    p.write_text(s, encoding="utf-8", newline="\n")
    print("matching button added")
