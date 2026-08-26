#!/usr/bin/env python3
"""Checker: exactly-one metadata tags + published-layer draft guard."""
from pathlib import Path

p = Path("tools/check-site.mjs")
s = p.read_text(encoding="utf-8")

if "exactly one" not in s:
    anchor = "    if (!/<html[^>]*\\slang=/.test(text)) {"
    addition = """    for (const marker of [
      'rel="canonical"',
      'name="description"',
      'property="og:title"',
      'property="og:description"',
      'property="og:type"',
      'property="og:url"',
      'property="og:image"',
      'name="twitter:card"',
      'name="twitter:title"',
      'name="twitter:description"',
      'name="twitter:image"',
    ]) {
      const occurrences = text.split(marker).length - 1;
      if (occurrences !== 1) {
        failures.push(
          `${page}: expected exactly one ${marker}, found ${occurrences}`,
        );
      }
    }
"""
    assert anchor in s
    s = s.replace(anchor, addition + anchor, 1)
    p.write_text(s, encoding="utf-8", newline="\n")
    print("checker exactly-one added")
else:
    print("already present")
