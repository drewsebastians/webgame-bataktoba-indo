#!/usr/bin/env python3
from pathlib import Path

p = Path("progres/index.html")
s = p.read_text(encoding="utf-8")
if 'name="robots"' not in s:
    s = s.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '    <meta name="robots" content="noindex,follow">',
        1,
    )
    p.write_text(s, encoding="utf-8", newline="\n")
    print("progres noindex added")

# homepage: derive mode count + fix matching copy
h = Path("index.html")
s = h.read_text(encoding="utf-8")
s = s.replace(
    "<p>Pilih arti Indonesia dari kata Batak Toba dengan empat opsi jawaban.</p>",
    "<p>Pasangkan kata Batak Toba dengan artinya (papan 4-8 pasang).</p>",
)
h.write_text(s, encoding="utf-8", newline="\n")
print("matching copy fixed")
