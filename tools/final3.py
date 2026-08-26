#!/usr/bin/env python3
from pathlib import Path

app = Path("assets/js/app.js")
s = app.read_text(encoding="utf-8")
changed = []

old_stats = '''      [metadata.counts.wordPairs, "pasangan kata"],
      [PRACTICE_MODES.length, "mode latihan"],'''
new_stats = '''      [metadata.counts.wordPairs, "pasangan kata"],
      [metadata.counts.publishedLessons ?? 0, "lesson terbit"],
      [PRACTICE_MODES.length, "mode latihan"],'''
if old_stats in s:
    s = s.replace(old_stats, new_stats, 1)
    changed.append("stats")

if "state.matchingTimerOn" not in s:
    old_score = """        pill("Matching Pairs"),
        pill(`${state.matched.size}/${state.matchingTotalPairs} cocok`),
      ),"""
    new_score = """        pill("Matching Pairs"),
        pill(`${state.matched.size}/${state.matchingTotalPairs} cocok`),
        state.matchingTimerOn
          ? pill(`Waktu ${Math.round((Date.now() - state.startedAt) / 1000)} dtk`)
          : null,
      ),"""
    s = s.replace(old_score, new_score, 1)

    old_btn = '    newRound.addEventListener("click", renderMatchingPairs);'
    new_btn = (
        '    const timerToggle = el("button", {\n'
        '      className: "button secondary",\n'
        '      text: state.matchingTimerOn ? "Timer: aktif" : "Timer: mati",\n'
        '      attrs: { type: "button", "aria-pressed": String(Boolean(state.matchingTimerOn)) },\n'
        "    });\n"
        '    timerToggle.addEventListener("click", () => {\n'
        "      state.matchingTimerOn = !state.matchingTimerOn;\n"
        "      paintMatchingPairs();\n"
        "    });\n\n"
        + old_btn
    )
    s = s.replace(old_btn, new_btn, 1)

    old_tail = '      el("div", { className: "action-row" }, sizeButtons),\n      el("div", { className: "matching-board" }, cardButtons),'
    new_tail = '      el("div", { className: "action-row" }, sizeButtons, timerToggle),\n      el("div", { className: "matching-board" }, cardButtons),'
    s = s.replace(old_tail, new_tail, 1)

    anchor = '    if (config.kind === "memory") {'
    ins = (
        "    if (state.matchingTimerId) {\n"
        "      clearInterval(state.matchingTimerId);\n"
        "      state.matchingTimerId = null;\n"
        "    }\n"
    )
    s = s.replace(anchor, ins + anchor, 1)
    changed.append("timer")

old_lm = 'footer.prepend(el("span", { text: `Diperbarui: ${meta.content.slice(0, 10)}` }));\n}'
if old_lm in s:
    new_lm = (
        "  const date = new Date(meta.content);\n"
        "  if (Number.isNaN(date.getTime())) return;\n"
        '  const long = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });\n'
        "  footer.prepend(\n"
        '    el("span", {}, "Terakhir diperbarui: ",\n'
        '      el("time", { text: long, attrs: { datetime: meta.content } })),\n'
        "  );\n}"
    )
    s = s.replace(old_lm, new_lm, 1)
if 'showLastModified();' not in s.split("async function main")[1]:
    s = s.replace('await initLearn();', 'await initLearn();\n  showLastModified();', 1)
    changed.append("learn-refresh")
if "Terakhir diperbarui" in s and "changed.append" not in s:
    changed.append("visible-date")

app.write_text(s, encoding="utf-8", newline="\n")
print("applied:", changed or "none")
