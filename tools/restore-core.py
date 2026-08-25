#!/usr/bin/env python3
"""Re-add core blocks (main/localDateKey/initProgressPage) to app.js."""
from pathlib import Path
import sys

app = Path("assets/js/app.js")
block = Path(r"C:\Users\ANDREW~1.SEB\AppData\Local\Temp\opencode\core-blocks.js").read_text(encoding="utf-8")
src = app.read_text(encoding="utf-8")

if "async function main()" in src:
    print("main already present")
    sys.exit(0)

anchor = "function registerServiceWorker()"
idx = src.index(anchor)
src = src[:idx] + block + src[idx:]

old = 'import { track } from "./analytics.js";'
new = (
    'import { track, hasAnalyticsConsent, grantAnalyticsConsent, revokeAnalyticsConsent } from "./analytics.js";\n'
    'import { sweepPlaceholders, readAdsConsent, grantAdsConsent, revokeAdsConsent } from "./ads.js";'
)
assert old in src
src = src.replace(old, new, 1)
src = src.replace('import { sweepPlaceholders } from "./ads.js";\n', "", 1)

app.write_text(src, encoding="utf-8", newline="\n")
print("core blocks restored")
