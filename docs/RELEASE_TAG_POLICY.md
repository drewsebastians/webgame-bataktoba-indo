# Release Tag Policy — Batak Toba Play

**Blueprint §24.3.** Tags are `vMAJOR.MINOR.PATCH` (semver). Only tag after:

- `npm run verify:release` green (includes lighthouse-check)
- `git diff --exit-code -- dist` clean
- Manual `docs/RELEASE_CHECKLIST.md` Lighthouse items ticked
- `data/reports/data-quality-report.json` inspected
- `dist` not leaked

Command:
```bash
git tag -a v0.1.0 -m "v0.1.0 — deterministic dist, bounded topics, traceability"
git push origin v0.1.0
```
Do not tag dirty tree. CI does not require tags; they are operational backup/reproducibility markers.
