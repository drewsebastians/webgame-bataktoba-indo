#!/usr/bin/env python3
"""Fix remaining relative og:image variants + add OG block to /progres/."""
from pathlib import Path
import re

BASE = "https://webgame-bataktoba-indo.pages.dev/"

for page in Path(".").glob("**/index.html"):
    sp = str(page)
    if "node_modules" in sp or "dist" in sp:
        continue
    s = page.read_text(encoding="utf-8")
    orig = s
    # normalize ANY relative og:image to absolute
    s = re.sub(
        r'(property="og:image" content=")(?:\.\./)*assets/icons/og-image\.png"',
        f'\\1{BASE}assets/icons/og-image.png"',
        s,
    )
    if 'property="og:image"' not in s:
        title = re.search(r"<title>([\s\S]*?)</title>", s).group(1).strip()
        desc = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', s).group(1)
        canonical = re.search(r'<link\s+rel="canonical"\s+href="([^"]*)"', s).group(1)
        block = (
            f'    <meta property="og:title" content="{title}">\n'
            f'    <meta property="og:description" content="{desc}">\n'
            '    <meta property="og:type" content="website">\n'
            f'    <meta property="og:url" content="{canonical}">\n'
            '    <meta property="og:site_name" content="Batak Toba Play">\n'
            '    <meta property="og:locale" content="id_ID">\n'
            f'    <meta property="og:image" content="{BASE}assets/icons/og-image.png">\n'
            '    <meta name="twitter:card" content="summary_large_image">\n'
            f'    <meta name="twitter:title" content="{title}">\n'
            f'    <meta name="twitter:description" content="{desc}">\n'
            f'    <meta name="twitter:image" content="{BASE}assets/icons/og-image.png">'
        )
        s = s.replace('<link rel="stylesheet"', block + '\n    <link rel="stylesheet"', 1)
    if s != orig:
        page.write_text(s, encoding="utf-8", newline="\n")
        print("fixed", sp)
