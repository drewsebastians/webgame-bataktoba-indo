# Manual Accessibility Acceptance — Batak Toba Play

**Blueprint §19 + §21.** Automated `axe` (6 pages serious 0) is not sufficient.

## For each release, manually verify (record PASS/FAIL per route)
- [ ] Keyboard-only: Tab through `/, /games/, /flashcards/, /dictionary/, /learn/angka/, /progres/` — all interactive reachable, no trap
- [ ] Skip link `Langsung ke konten` visible on focus, moves to `#main-content`
- [ ] Focus order logical, visible focus ring
- [ ] 1–4 shortcuts in games (quiz) without hijacking inputs
- [ ] Screen-reader labels: `aria-pressed` on mode/timer, `aria-live` feedback, `aria-expanded` nav, `aria-label` on icon cards
- [ ] Live regions announce `Benar/Salah` + score
- [ ] Mobile nav `Menu` toggles `nav-open`, `aria-expanded`
- [ ] 200% zoom (Ctrl +) no loss, 320 CSS px (DevTools 320×568) no horizontal scroll, grid collapses to 1 col
- [ ] Reduced motion `prefers-reduced-motion` disables animation
- [ ] Touch targets ≥44px (`option`, `match-card`, `mode-button`, `button`)
- [ ] Color-independent states: `correct`/`wrong` have ✓/✗ + border, not only color
- [ ] Optional timer never mandatory (Matching)
- [ ] Responsive tables `vocab-table` stack at 820px
- [ ] Forms/errors: import file too large, invalid JSON messages announced via `role=status`

**Automated via Playwright:** `core.spec` covers keyboard, skip, axe, non-color, touch, reduced-motion, mobile nav. Manual items above must be ticked per release and filed in `test-results/`.

*Not claimed as performed this release unless ticked.*
