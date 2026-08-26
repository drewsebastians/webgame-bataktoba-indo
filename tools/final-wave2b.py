#!/usr/bin/env python3
"""Final wave v2b - idempotent remainder."""
from pathlib import Path

app = Path("assets/js/app.js")
s = app.read_text(encoding="utf-8")

# homepage stats
old_stats = '''      [metadata.counts.wordPairs, "pasangan kata"],
      [PRACTICE_MODES.length, "mode latihan"],'''
new_stats = '''      [metadata.counts.wordPairs, "pasangan kata"],
      [metadata.counts.publishedLessons ?? 0, "lesson terbit"],
      [PRACTICE_MODES.length, "mode latihan"],'''
if old_stats in s:
    s = s.replace(old_stats, new_stats, 1)

# matching timer
if 'state.matchingTimerOn' not in s:
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

    old_btn = """    newRound.addEventListener("click", renderMatchingPairs);"""
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
      el("div", { className: "matching-board" }, cardButtons),"""
    new_tail = """      el("div", { className: "action-row" }, sizeButtons, timerToggle),
      el("div", { className: "matching-board" }, cardButtons),"""
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

# visible <time> date
old_lm = """  footer.prepend(el("span", { text: `Diperbarui: ${meta.content.slice(0, 10)}` }));
}"""
new_lm = """  const date = new Date(meta.content);
  if (Number.isNaN(date.getTime())) return;
  const long = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  footer.prepend(
    el("span", {}, "Terakhir diperbarui: ",
      el("time", { text: long, attrs: { datetime: meta.content } })),
  );
}
function _unused_showLastModified_end() {}"""
assert old_lm in s
s = s.replace(old_lm, new_lm, 1)
s = s.replace('  if (page === "learn-topic") await initLearn();',
              '  if (page === "learn-topic") await initLearn();\n  showLastModified();', 1)

app.write_text(s, encoding="utf-8", newline="\n")

# fixture 8 items
r = Path("tests/browser/residual.spec.mjs")
rs = r.read_text(encoding="utf-8").replace("slice(0, 6)", "slice(0, 8)")
r.write_text(rs, encoding="utf-8", newline="\n")

# threshold 8
for f in ["assets/js/config.js", "tools/build-learning-data.py"]:
    fp = Path(f)
    fs = fp.read_text(encoding="utf-8").replace("MIN_LESSON_POOL_ITEMS = 6", "MIN_LESSON_POOL_ITEMS = 8")
    fp.write_text(fs, encoding="utf-8", newline="\n")

# drift gate
pkg = Path("package.json")
pj = pkg.read_text(encoding="utf-8")
if '"verify:drift"' not in pj:
    pj = pj.replace('"verify":', '"verify:drift": "npm run build && git diff --exit-code -- dist",\n    "verify":', 1)
    pkg.write_text(pj, encoding="utf-8", newline="\n")

ci = Path(".github/workflows/verify.yml")
cis = ci.read_text(encoding="utf-8")
if "git diff --exit-code -- dist" not in cis:
    cis = cis.replace(
        "        run: npm run verify",
        "        run: npm run verify\n\n"
        "      - name: Committed dist drift gate\n"
        "        run: git diff --exit-code -- dist",
        1,
    )
    ci.write_text(cis, encoding="utf-8", newline="\n")

print("final wave v2b complete")
