# Review Round 1 Status — Batak Toba Play

**Baseline SHA:** `267e4a6` → `6df44e9` → `267e4a6` (now `267e4a6` is 95a7661? Actually final before this pass was 267e4a6, now 6df44e9) — see `git log`.
- **Current HEAD at report:** `6df44e9` (adversarial fix) → `267e4a6` (future-transition fix) → now this pass will be next.
- **Review packet generated:** `2026-08-30T21:21:00Z` via `npm run review:round1` → `artifacts/review/round-1/` (8 rows: 5 published angka + 3 draft, see `round-1-review.json`)

**Candidate lesson:** `angka` (Angka Batak Toba)
- **Target pool arithmetic:** `5 / 8 need 3` additional source-backed items
- **Exact additional candidate IDs in repo:** **0** (`data/candidates/word-pairs.json` 367 == `published` 367 → 0 notPublished; see `FIRST_LESSON_UNLOCK_PLAN.md` Outcome B)
- **Draft supplements:** 8 (`sada, dua…`) editorial-draft, not counted (no provenance)

**Review status:**
- **Reviewer input received?** **NO** — `data/reviewed/overrides.json` absent (0 overrides), `artifacts/review/` contains only generated queue/round-1, no completed human file.
- **Validation result:** `npm run review:validate` PASS (0 errors, 0 overrides)
- **Publication preview:** `npm run review:preview` → `0 items would change`, `0 lessons eligible`, `sitemap none`, `Lessons 0→0`
- **Publication result:** Not executed (hard gate: `NO_REVIEW_INPUT` → no `human-reviewed`, no new lesson)
- **First lesson result:** `BLOCKED_EXTERNAL — HUMAN REVIEW REQUIRED` + `BLOCKED_CONTENT` (need 3 source-backed candidates)
- **First SEO topic result:** `angka` remains `noindex,follow`, sitemap absent, `BLOCKED_CONTENT`

**Remaining blockers:** Acquire 3 source-backed angka candidates (corpus re-filter or curated human list with `sourceReference`), then genuine review (`reviewer`+`reviewedAt`), then `review:validate`→`review:preview`→`content:publish`→`verify:release`.

No reviewer name stored (none supplied).
