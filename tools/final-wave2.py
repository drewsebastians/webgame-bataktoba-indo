#!/usr/bin/env python3
"""Final wave v2 - all remaining edits, idempotent."""
from pathlib import Path
import json

app = Path("assets/js/app.js")
s = app.read_text(encoding="utf-8")

# 1) gate lesson_view to published lessons only
old = '  track("lesson_view", { slug: document.body.dataset.lesson ?? "" });\n  const theme = document.body.dataset.lesson;'
if old in s:
    s = s.replace(old, "  const theme = document.body.dataset.lesson;", 1)

anchor2 = '  const topicMeta = topics.topics.find((entry) => entry.slug === theme);\n  if (!lesson) {'
gate = (
    '  const topicMeta = topics.topics.find((entry) => entry.slug === theme);\n'
    '  if (lesson && lesson.publicationStatus === "published") {\n'
    '    track("lesson_view", { slug: lesson.slug });\n'
    "  }\n"
    "  if (!lesson) {"
)
if "track(\"lesson_view\", { slug: lesson.slug })" not in s:
    assert anchor2 in s
    s = s.replace(anchor2, gate, 1)

# 2) homepage stats + published lesson count
old_stats = '''      [metadata.counts.wordPairs, "pasangan kata"],
      [PRACTICE_MODES.length, "mode latihan"],'''
new_stats = '''      [metadata.counts.wordPairs, "pasangan kata"],
      [metadata.counts.publishedLessons ?? 0, "lesson terbit"],
      [PRACTICE_MODES.length, "mode latihan"],'''
assert old_stats in s
s = s.replace(old_stats, new_stats, 1)
# ensure learning-items metadata carries publishedLessons (builder writes counts there ✓)

# 3) matching optional timer (OFF default) -------------------------------------
old_score = """        pill("Matching Pairs"),
        pill(`${state.matched.size}/${state.matchingTotalPairs} cocok`),
      ),"""
new_score = """        pill("Matching Pairs"),
        pill(`${state.matched.size}/${state.matchingTotalPairs} cocok`),
        state.matchingTimerOn
          ? pill(`Waktu ${Math.round((Date.now() - state.startedAt) / 1000)} dtk`)
          : null,
      ),"""
assert old_score in s
s = s.replace(old_score, new_score, 1)

old_btn = """    const newRound = el("button", {
      className: "button secondary",
      id: "new-matching",
      text: "Papan Baru",
      attrs: { type: "button" },
    });
    newRound.addEventListener("click", renderMatchingPairs);"""
new_btn = """    const timerToggle = el("button", {
      className: "button secondary",
      text: state.matchingTimerOn ? "Timer: aktif" : "Timer: mati",
      attrs: { type: "button", "aria-pressed": String(Boolean(state.matchingTimerOn)) },
    });
    timerToggle.addEventListener("click", () => {
      state.matchingTimerOn = !state.matchingTimerOn;
      paintMatchingPairs();
    });

    const newRound = el("button", {
      className: "button secondary",
      id: "new-matching",
      text: "Papan Baru",
      attrs: { type: "button" },
    });
    newRound.addEventListener("click", renderMatchingPairs);"""
assert old_btn in s
s = s.replace(old_btn, new_btn, 1)

old_tail = """      el("div", { className: "action-row" }, sizeButtons),
      el("div", { className: "matching-board" }, cardButtons),
      el("p", { className: "feedback", text: message, attrs: { "aria-live": "polite" } }),
      el("div", { className: "action-row" }, newRound),
    );
  }

  function chooseMatchingCard(button) {"""
new_tail = """      el("div", { className: "action-row" }, sizeButtons, timerToggle),
      el("div", { className: "matching-board" }, cardButtons),
      el("p", { className: "feedback", text: message, attrs: { "aria-live": "polite" } }),
      el("div", { className: "action-row" }, newRound),
    );

    if (state.matchingTimerId) clearInterval(state.matchingTimerId);
    if (state.matchingTimerOn && state.matched.size < state.matchingTotalPairs) {
      state.matchingTimerId = setInterval(() => {
        const timePill = [...panel.querySelectorAll(".pill")].find((p) =>
          p.textContent.startsWith("Waktu "),
        );
        if (timePill)
          timePill.textContent = `Waktu ${Math.round((Date.now() - state.startedAt) / 1000)} dtk`;
      }, 1000);
    }
  }

  function chooseMatchingCard(button) {"""
assert old_tail in s
s = s.replace(old_tail, new_tail, 1)

old_route = """    if (config.kind === "memory") {
      renderMemory();
    } else {"""
new_route = """    if (state.matchingTimerId) {
      clearInterval(state.matchingTimerId);
      state.matchingTimerId = null;
    }
    if (config.kind === "memory") {
      renderMemory();
    } else {"""
assert old_route in s
s = s.replace(old_route, new_route, 1)

# 4) visible <time> last-modified ----------------------------------------------
old_lm = """function showLastModified() {
  const meta = document.querySelector('meta[name="last-modified"]');
  const footer = document.querySelector(".footer-inner");
  if (!meta || !footer) return;
  footer.prepend(el("span", { text: `Diperbarui: ${meta.content.slice(0, 10)}` }));
}"""
new_lm = """function showLastModified() {
  const meta = document.querySelector('meta[name="last-modified"]');
  const footer = document.querySelector(".footer-inner");
  if (!meta || !footer) return;
  const date = new Date(meta.content);
  if (Number.isNaN(date.getTime())) return;
  const long = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  footer.prepend(
    el("span", {}, "Terakhir diperbarui: ",
      el("time", { text: long, attrs: { datetime: meta.content } })),
  );
}"""
assert old_lm in s
s = s.replace(old_lm, new_lm, 1)
# also refresh after learn render
s = s.replace("  if (page === \"learn-topic\") await initLearn();", "  if (page === \"learn-topic\") await initLearn();\n  showLastModified();", 1)

app.write_text(s, encoding="utf-8", newline="\n")
print("app final edits ok")

# ---- 5) fixture 8 items -------------------------------------------------------
r = Path("tests/browser/residual.spec.mjs")
rs = r.read_text(encoding="utf-8")
rs = rs.replace("data.items.slice(0, 6)", "data.items.slice(0, 8)")
r.write_text(rs, encoding="utf-8", newline="\n")

# ---- 6) MIN threshold to 8 ----------------------------------------------------
c = Path("assets/js/config.js")
cs = c.read_text(encoding="utf-8").replace("MIN_LESSON_POOL_ITEMS = 6", "MIN_LESSON_POOL_ITEMS = 8")
c.write_text(cs, encoding="utf-8", newline="\n")

b = Path("tools/build-learning-data.py")
bs = b.read_text(encoding="utf-8").replace("MIN_LESSON_POOL_ITEMS = 6", "MIN_LESSON_POOL_ITEMS = 8")
b.write_text(bs, encoding="utf-8", newline="\n")

# ---- 7) drift gate script ------------------------------------------------------
pkg = Path("package.json")
pj = pkg.read_text(encoding="utf-8")
if '"verify:drift"' not in pj:
    pj = pj.replace(
        '"verify":',
        '"verify:drift": "npm run build && git diff --exit-code -- dist",\n    "verify":',
        1,
    )
    pkg.write_text(pj, encoding="utf-8", newline="\n")

ci = Path(".github/workflows/verify.yml")
cis = ci.read_text(encoding="utf-8")
if "git diff --exit-code -- dist" not in cis:
    cis = cis.replace(
        "      - name: Full verification (check + unit + build + smoke + browser + axe)\n        run: npm run verify",
        "      - name: Full verification (check + unit + build + smoke + browser + axe)\n        run: npm run verify\n\n"
        "      - name: Committed dist drift gate\n        run: git diff --exit-code -- dist",
    )
    ci.write_text(cis, encoding="utf-8", newline="\n")

print("final wave complete")
