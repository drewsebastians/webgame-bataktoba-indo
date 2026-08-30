# Architecture Note — Batak Toba Play

**Blueprint §21** suggests `src/config/data/game/progress/lessons/...` modular. Current `assets/js/app.js` 2247 lines is monolithic but **SAFE_TO_DEFER**: boundaries already clear (`home`, `dictionary`, `lesson`, `game renderers`, `analytics` wiring), tests cover behavior (`tests/browser`, `tests/unit`), import graph simple (`assets/js/*` via `type:module`), no churn needed now.

Potential future extractions (only if value > risk):
- `assets/js/ui/home.js` (renderHomeDynamic)
- `assets/js/ui/dictionary.js`
- `assets/js/ui/lesson.js`
- `assets/js/game/modes/*.js`

Maintainability materially improves only after 1+ published lessons prove lesson UI churn. Until then, **no broad refactor**.
