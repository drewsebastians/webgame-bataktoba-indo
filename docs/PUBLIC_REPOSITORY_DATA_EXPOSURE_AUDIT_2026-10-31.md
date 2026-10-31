# Public repository data exposure audit — 2026-10-31

## Finding

The PUBLIC repository had zero learning records in the published dataset, but its source tree also tracked raw, candidate, legacy, editorial-draft, and quality-report snapshots. Those files were not in the website runtime, yet were browseable on GitHub. The build allowlist excluded most from dist; it did not protect the public source tree.

## Current-tree containment

This checkpoint deletes tracked snapshots under data/raw, data/candidates, data/legacy, and data/reports, plus content/curated/draft-vocabulary.json, content/themes/keywords.json, and data/sources/alignment-engine-manifest.json. Public pools remain empty and topic pages noindex. The browser progress ID map remains because it contains identifiers only and supports local progress migration. Source registry metadata remains and contains no lexical records.

Public corpus build/import/review/report/publish entry points fail closed. The release build rejects non-empty pools, lessons, or indexable empty topics. Ignore rules cover local raw/candidate/review data and private staging.

## Git-history limit

The snapshots first appeared in public commits in August 2026; quality reports were added in September. This normal PR removes current-tree copies but does not rewrite history, so older public commits may still contain former files. No destructive history operation is authorized.

## Evidence

- Baseline public main: 6b563267ed4973375ea8031910552d61ae324250; tree 0b855047ca141d5178018787ea316b2047d271c5.
- Baseline Actions Verify run 41163350076 succeeded.
- Published word, phrase, sentence, learning-item, and lesson arrays were empty.
- Synthetic test data stays in tests/fixtures; it is not copied into data/published or dist.
- Historical Git objects and production deployment are not claimed to be cleared or re-verified.

Next work is the schema-validated Engine adapter and synthetic browser flows, preserving rights, provenance, alternatives, senses, topic mapping, and game eligibility.
