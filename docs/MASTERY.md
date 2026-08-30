# Mastery — Derived from reviewStage

**Blueprint §12.1** lists `mastery` per item. Implementation keeps `reviewStage` canonical (0-5) and derives `mastery` via `session.js:masteryLabel(stage)`:

- 0 → baru
- 1 → tahap 1
- 2 → tahap 2
- 3+ → hampir dikuasai / mastered (≥30d)

No separate persisted `mastery` field — avoids redundant state. `progress.js` stores `reviewStage`, `consecutiveCorrect`, `nextReviewAt`; `masteryLabel` is pure projection tested in `tests/unit/session.test.mjs`. Documented as **preferred derived** per traceability.
