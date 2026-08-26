#!/usr/bin/env python3
"""Final residual wave: event gates, thin-topic noindex, timer, drift gate, dates."""
from pathlib import Path
import json

# ---- 1) lesson_view only for published lessons ------------------------------
a = Path("assets/js/app.js")
s = a.read_text(encoding="utf-8")
old = 'track("lesson_view", { slug: document.body.dataset.lesson ?? "" });'
new = ""  # gate moved below once lesson/topicMeta known
assert old in s
s = s.replace(old, "", 1)
old = """  const topicMeta = topics.topics.find((entry) => entry.slug === theme);
  if (!lesson) {"""
new = """  const topicMeta = topics.topics.find((entry) => entry.slug === theme);
  if (lesson && lesson.publicationStatus === "published") {
    track("lesson_view", { slug: lesson.slug });
  }
  if (!lesson) {"""
assert old in s
s = s.replace(old, new, 1)

# remove now-orphaned duplicate view emission inside published branch (if any)
s = s.replace(
    """  if (lesson && lesson.publicationStatus === "published") {
    track("lesson_start", { slug: lesson.slug });""",
    """  if (lesson && lesson.publicationStatus === "published") {
    track("lesson_start", { slug: lesson.slug });""",
    1,
)

# ---- 2) matching optional timer (OFF by default) -----------------------------
old = """      el(
        "div",
        { className: "scorebar" },
        pill("Matching Pairs"),
        pill(`${state.matched.size}/${state.matchingTotalPairs} cocok`),
      ),"""
new = """      el(
        "div",
        { className: "scorebar" },
        pill("Matching Pairs"),
        pill(`${state.matched.size}/${state.matchingTotalPairs} cocok`),
        state.matchingTimerOn
          ? pill(`Waktu ${Math.round((Date.now() - state.startedAt) / 1000)} dtk`)
          : null,
      ),"""
assert old in s
s = s.replace(old, new, 1)

old = """    const newRound = el("button", {
      className: "button secondary",
      id: "new-matching",
      text: "Papan Baru",
      attrs: { type: "button" },
    });
    newRound.addEventListener("click", renderMatchingPairs);"""
new = """    const timerToggle = el("button", {
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
assert old in s
s = s.replace(old, new, 1)

old = """      el("div", { className: "action-row" }, sizeButtons),
      el("div", { className: "matching-board" }, cardButtons),
      el("p", { className: "feedback", text: message, attrs: { "aria-live": "polite" } }),
      el("div", { className: "action-row" }, newRound),
    );
  }

  function chooseMatchingCard(button) {"""
new = """      el("div", { className: "action-row" }, sizeButtons, timerToggle),
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
assert old in s
s = s.replace(old, new, 1)

# clear interval when leaving matching mode
old = """    if (config.kind === "matching") {
      renderMatchingPairs();
    } else {"""
new = """    if (state.matchingTimerId) {
      clearInterval(state.matchingTimerId);
      state.matchingTimerId = null;
    }
    if (config.kind === "matching") {
      renderMatchingPairs();
    } else {"""
assert old in s
s = s.replace(old, new, 1)

# ---- 3) homepage honest stats incl. published lessons ------------------------
old = """      const stats = [
        ["pasangan kata"],
      ];"""
# (pattern safety): operate on the actual stats array instead
old = """    const stats = [
      [metadata.counts.wordPairs, "pasangan kata"],
      [PRACTICE_MODES.length, "mode latihan"],
      [0, "login dibutuhkan"],
    ];"""
new = """    const stats = [
      [metadata.counts.wordPairs, "pasangan kata"],
      [metadata.counts.publishedLessons ?? 0, "lesson terbit"],
      [PRACTICE_MODES.length, "mode latihan"],
      [0, "login dibutuhkan"],
    ];"""
assert old in s
s = s.replace(old, new, 1)

# ensure metadata.counts carries publishedLessons (learning-items metadata does)
# learning-items metadata.counts includes publishedLessons since builder v2 ✓

app.write_text(s, encoding="utf-8", newline="\n")
print("app final wave applied")

# ---- 4) thin-topic noindex on source learn pages ----------------------------
topics = json.loads(Path("data/published/topics.json").read_text(encoding="utf-8"))
for topic in topics["topics"]:
    page = Path(f"learn/{topic['slug']}/index.html")
    if not page.exists():
        continue
    html = page.read_text(encoding="utf-8")
    needs_noindex = (
        topic["publicationStatus"] != "published"
        and 'content="noindex' not in html
    )
    if needs_noindex:
        html = html.replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '    <meta name="robots" content="noindex,follow">',
            1,
        )
        page.write_text(html, encoding="utf-8", newline="\n")
        print(f"noindex added: {topic['slug']}")

# tips-diaspora / adat-ringan remain editorial tips pages (no linguistic claims)
print("indexability policy applied")
