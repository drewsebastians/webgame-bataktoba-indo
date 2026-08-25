#!/usr/bin/env python3
"""Add per-lesson progress (additive, v3-compatible) to progress.js."""
from pathlib import Path

p = Path("assets/js/progress.js")
s = p.read_text(encoding="utf-8")

# 1) empty payload gains lessons map
old = "    items: {},\n    sessions: [],"
new = "    items: {},\n    lessons: {},\n    sessions: [],"
assert old in s
s = s.replace(old, new, 1)

# 2) validate: sanitize lessons entries
anchor = """  if (payload.items && typeof payload.items === "object") {"""
addition = """  if (payload.lessons && typeof payload.lessons === "object") {
    for (const [slug, raw] of Object.entries(payload.lessons).slice(0, 200)) {
      if (!raw || typeof raw !== "object") continue;
      progress.lessons[slug] = {
        startedAt:
          typeof raw.startedAt === "number" && Number.isFinite(raw.startedAt)
            ? raw.startedAt
            : null,
        completedAt:
          typeof raw.completedAt === "number" && Number.isFinite(raw.completedAt)
            ? raw.completedAt
            : null,
        attempts: clampInt(raw.attempts, 0, 1e6, 0),
        mistakesTotal: clampInt(raw.mistakesTotal, 0, 1e6, 0),
        lastMistakeCount: clampInt(raw.lastMistakeCount ?? 0, 0, 1e4, 0),
      };
    }
  }
"""
assert anchor in s
s = s.replace(anchor, addition + anchor, 1)

# 3) public APIs appended near export/reset section
api = '''
/* -------------------------------------------------------------------------
 * Per-lesson progress (blueprint section 9.4 / residual Task 5)
 * ---------------------------------------------------------------------- */

export const LESSON_STATUSES = [
  "not-started",
  "learning",
  "needs-review",
  "nearly-mastered",
  "completed",
];

export function getLessonState(slug) {
  const entry = getProgress().lessons?.[slug];
  if (!entry || !entry.startedAt) return { status: "not-started", attempts: 0 };
  let status = "learning";
  if (entry.completedAt) {
    status =
      entry.lastMistakeCount > 0 ? "needs-review" : "completed";
  } else if (entry.mistakesTotal >= 5) {
    status = "needs-review";
  }
  return { ...entry, status };
}

export function recordLessonStart(slug) {
  if (!slug) return;
  const current = hydrateSync();
  const next = { ...current, lessons: { ...current.lessons } };
  const prev = next.lessons[slug] ?? {};
  next.lessons[slug] = {
    startedAt: prev.startedAt ?? nowMs(),
    completedAt: null,
    attempts: (prev.attempts ?? 0) + 1,
    mistakesTotal: prev.mistakesTotal ?? 0,
    lastMistakeCount: 0,
  };
  cached = next;
  persist(next);
}

export function recordLessonCompletion(slug, { mistakeCount = 0 } = {}) {
  if (!slug) return;
  const current = hydrateSync();
  const timestamp = nowMs();
  const next = { ...current, lessons: { ...current.lessons } };
  const prev = next.lessons[slug] ?? {};
  next.lessons[slug] = {
    startedAt: prev.startedAt ?? timestamp,
    completedAt: timestamp,
    attempts: Math.max(prev.attempts ?? 0, 1),
    mistakesTotal: (prev.mistakesTotal ?? 0) + mistakeCount,
    lastMistakeCount: mistakeCount,
  };
  cached = next;
  persist(next);
}

/** Reset handler support */
function resetLessons(progressObj) {
  progressObj.lessons = {};
}
'''
tail_anchor = "export function resetProgress() {"
assert tail_anchor in s
s = s.replace(tail_anchor, api + "\n" + tail_anchor, 1)

# reset clears lessons too
old_reset = """function resetProgress() {
  const fresh = createEmptyProgress();"""
if old_reset not in s:
    old_reset = """export function resetProgress() {
  const fresh = createEmptyProgress();"""
assert old_reset in s
s = s.replace(
    old_reset,
    old_reset.replace("const fresh = createEmptyProgress();", "const fresh = createEmptyProgress();\n  resetLessons(fresh);"),
    1,
)

p.write_text(s, encoding="utf-8", newline="\n")
print("lesson progress added")
