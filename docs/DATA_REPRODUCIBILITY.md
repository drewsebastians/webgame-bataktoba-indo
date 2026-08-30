# Data Reproducibility — Batak Toba Play

**Blueprint §24.3.** Generated `data/published/*` is reproducible **iff** external source available.

## Required external source
- **Repo:** `drewsebastians/batak-indo-alignment-engine` (private corpus)
- **Files:** `data/input/bible_batak_indo_v1.db` (31k parallel verses) + `data/processed/master_alignment_bible_only.db` (1.6 GB, rebuild via `python scripts/run_phase2_pipeline.py --rebuild`)
- **Version/checksum:** Record `sha256` of `master_alignment_bible_only.db` in `data/reports/data-quality-report.json:sourceChecksums` (add when rebuilding). Do not commit DB.
- **Licensing:** Bible corpus — verify licensing before redistribution; see `methodology` + `data-source`. Raw source not deleted (Blueprint backup).

## What rebuilds without DB
- Nothing: `tools/build-learning-data.py` fails fast if DB missing (see `content:publish` message). CI validates *committed* `data/published/*` via `check-site` + `tests/data`.

## What cannot
- `data/published/*`, `data/candidates/*`, `data/reports/*`, `topics.json`, `lessons.json` regeneration.

## Why CI validates committed data
1.6 GB DB cannot be in CI; deterministic `stable_id` + `migration map` retained (`data/migration/id-map.json`). Maintainer rebuild: obtain DB → `npm run build:data` → `npm run build:seo` → `npm run build` → `npm run verify:release` → tag `vX.Y.Z`.

## Distribution constraint
Do not commit DB or large raw; keep `data/raw` out of `dist` (artifact test enforces).
