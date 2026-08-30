# First Topic SEO Unlock Plan — Batak Toba Play

**Candidate:** `angka` (substantive but thin) → first indexable substantive topic. Alternatively `adat-ringan`/`tips-diaspora` already indexable but not lesson-linked.

## Current (recalculated 2026-08-30)
`angka`: pool 5/8, noindex,follow, sitemap absent, components: intro + generic prose + table 5 + status + mini quiz (≥4) + dictionary + correction + source + modified (visible time) — but **actual material** limited (5), not yet lesson.
`keluarga` 0/8, `sapaan` 0/8, `makanan` 2/8, `waktu` 4/8, `alam` 2/8 — all thin, all noindex.

Recalc: `data/candidates/word-pairs.json` 367 == `data/published/word-pairs.json` 367 → **0 candidate-but-not-published**. Draft supplements 8 for angka are `editorial-draft` without corpus provenance, not counted.

## Unlock requires — blocked by source, not just review
- **At least 3 genuinely additional source-backed angka items must be acquired** (see FIRST_LESSON_UNLOCK_PLAN Outcome B). Reviewing existing 5 alone keeps 5.
- When 3 exist and are `human-reviewed` (reviewer+reviewedAt), lesson `angka` published (as above) → topic lesson link appears
- Material list 8 with review badges
- Mini quiz 8 (already eligible)
- Dictionary relation 8
- Source block + correction + modified date already present
- Structured data: currently `BreadcrumbList` only; after lesson → `LearningResource` + possible `Article` for `adat-ringan` (see `article-schema.test`)
- Indexability promotion: `pageStatus public-indexable` + `sitemap` + `<lastmod>` + `site.config` update — **automatic** via `generate-sitemap` when pool≥8.

**Do not index early:** Keep noindex until `pool>=8` + human review + substantive lesson + source provenance. Current `0 additional candidates` ⇒ `BLOCKED_CONTENT` + `BLOCKED_HUMAN_REVIEW` + external source acquisition required.

