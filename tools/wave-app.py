#!/usr/bin/env python3
"""Wave: matching mode, lesson progress APIs usage, analytics wiring."""
from pathlib import Path

app = Path("assets/js/app.js")
s = app.read_text(encoding="utf-8")

# --- 1) modes registry: add matching ----------------------------------------
old = '    memory: { label: "Memory Game", prompt: "Cocokkan pasangan kartu", from: "batak", to: "indonesia", pool: wordPool, kind: "memory" },'
new = (
    '    matching: { label: "Matching Pairs", prompt: "Pasangkan kata dengan artinya", '
    'from: "batak", to: "indonesia", pool: wordPool, kind: "matching" },\n    '
    + old
)
assert old in s
s = s.replace(old, new, 1)

# --- 2) startSession routes matching -----------------------------------------
old = """    if (config.kind === "memory") {
      renderMemory();
    } else {"""
new = """    if (config.kind === "memory") {
      renderMemory();
    } else if (config.kind === "matching") {
      renderMatchingPairs();
    } else {"""
assert old in s
s = s.replace(old, new, 1)

# --- 3) keyboard guard: memory OR matching -----------------------------------
s = s.replace(
    'if (state.mode === "memory") return;',
    'if (state.mode === "memory" || state.mode === "matching") return;',
    1,
)

# --- 4) implement open Matching Pairs (before renderSummary definition) ------
matching_impl = '''
  /* ---- Matching Pairs (open pairs, distinct from Memory) ---------------- */

  function renderMatchingPairs() {
    const pairCount = state.matchingPairs ?? 6;
    const { cards, pairs } = buildMemoryBoard(wordPool, { pairCount });
    state = {
      ...state,
      mode: "matching",
      options: cards,
      matched: new Set(),
      selected: [],
      matchingTotalPairs: pairs,
      startedAt: Date.now(),
    };
    paintMatchingPairs();
  }

  function paintMatchingPairs(message = "") {
    const sizeButtons = [4, 6, 8].map((n) => {
      const button = el("button", {
        className: "mode-button matching-size-button",
        text: `${n} pasang`,
        attrs: {
          type: "button",
          "aria-pressed": String((state.matchingPairs ?? 6) === n),
        },
      });
      button.addEventListener("click", () => {
        state.matchingPairs = n;
        renderMatchingPairs();
      });
      return button;
    });

    const cardButtons = state.options.map((card, index) => {
      const isMatched = state.matched.has(card.id);
      const button = el("button", {
        className: `match-card${isMatched ? " matched" : ""}`,
        text: card.text,
        attrs: {
          type: "button",
          "data-index": index,
          disabled: isMatched || undefined,
        },
      });
      button.addEventListener("click", () => chooseMatchingCard(button));
      return button;
    });

    const newRound = el("button", {
      className: "button secondary",
      id: "new-matching",
      text: "Papan Baru",
      attrs: { type: "button" },
    });
    newRound.addEventListener("click", renderMatchingPairs);

    replaceChildren(
      panel,
      el(
        "div",
        { className: "scorebar" },
        pill("Matching Pairs"),
        pill(`${state.matched.size}/${state.matchingTotalPairs} cocok`),
      ),
      el("div", { className: "action-row" }, sizeButtons),
      el("div", { className: "matching-board" }, cardButtons),
      el("p", { className: "feedback", text: message, attrs: { "aria-live": "polite" } }),
      el("div", { className: "action-row" }, newRound),
    );
  }

  function chooseMatchingCard(button) {
    const card = state.options[Number(button.dataset.index)];
    if (state.matched.has(card.id)) return; // rapid re-click cannot double-score
    state.selected = [...state.selected, card].slice(-2);
    button.classList.add("selected");
    if (state.selected.length < 2) return;

    const [first, second] = state.selected;
    const isMatch = first.id === second.id && first.side !== second.side;
    if (isMatch) {
      state.matched.add(first.id);
      recordAnswer(true, "matching", first.id);
      track("answer_correct", { mode: "matching" });
      if (state.matched.size === state.matchingTotalPairs) {
        paintMatchingPairs(`Selesai. ${state.matchingTotalPairs} pasangan cocok.`);
      } else {
        paintMatchingPairs("Cocok.");
      }
    } else {
      recordAnswer(false, "matching", first.id);
      track("answer_incorrect", { mode: "matching" });
      paintMatchingPairs("Belum cocok.");
    }
    state.selected = [];
    updateProgressBadges();
  }

'''
anchor = "  function renderSummary({ finishedReview = false } = {}) {"
assert anchor in s
s = s.replace(anchor, matching_impl + anchor, 1)

# --- 5) analytics wiring additions -------------------------------------------
# quiz answerQuestion: question_answered + correct/incorrect
old = """    state.sessionAnswers = [...state.sessionAnswers, { itemId: result.itemId, isCorrect: result.isCorrect }];
    recordAnswer(result.isCorrect, state.mode, result.itemId);"""
new = """    state.sessionAnswers = [...state.sessionAnswers, { itemId: result.itemId, isCorrect: result.isCorrect }];
    recordAnswer(result.isCorrect, state.mode, result.itemId);
    track("question_answered", { mode: state.mode });
    track(result.isCorrect ? "answer_correct" : "answer_incorrect", { mode: state.mode });"""
assert old in s
s = s.replace(old, new, 1)

# mistake review start/complete
old = """    getRunner(state.mode, { fresh: true, initialIds: uniqueIds });
    nextQuestion();
  }"""
new = """    track("mistake_review_start", { count: String(uniqueIds.length) });
    getRunner(state.mode, { fresh: true, initialIds: uniqueIds });
    nextQuestion();
  }"""
assert old in s
s = s.replace(old, new, 1)

# daily practice complete instead of session_complete when daily origin
old = """    track(finishedReview ? "mistake_review_complete" : "session_complete", {"""
new = """    if (!finishedReview && state.startedViaDaily) {
      track("daily_practice_complete", { answered: String(summary.answered) });
    } else {
      track(finishedReview ? "mistake_review_complete" : "session_complete", {
        mode: state.mode,
        answered: String(summary.answered),
      });
    }
    void summary;
    if (false) {
      track("session_complete_unused", {"""
assert old in s
s = s.replace(old, new, 1)
# repair: the original call had its own argument list; close properly
old_tail = """      meaningful: String(summary.isMeaningful),
    });
    renderSummaryPanel(summary, finishedReview);"""
new_tail = """      meaningful: String(summary.isMeaningful),
      });
    }
    renderSummaryPanel(summary, finishedReview);"""
assert old_tail in s
s = s.replace(old_tail, new_tail, 1)

# startedViaDaily flag
s = s.replace(
    "  function startDailyPractice() {\n    const progressState = getProgress();",
    "  function startDailyPractice() {\n    state.startedViaDaily = true;\n    const progressState = getProgress();",
    1,
)

# dictionary search / no-result / word_saved / correction_opened
old = """  function render() {
    const matchesList = searchable
      .filter((item) => matchesQuery(item) && inSelectedTheme(item))
      .slice(0, 60);

    if (!matchesList.length) {
      expandedId = null;
      replaceChildren(results, el("div", { className: "card", text: "Belum ada hasil untuk pencarian itu." }));
      return;
    }"""
new = """  function render() {
    const matchesList = searchable
      .filter((item) => matchesQuery(item) && inSelectedTheme(item))
      .slice(0, 60);

    const query = normalizeSearch(input.value.trim());
    if (query.length >= 2) {
      // privacy: only the outcome bucket is sent, never the raw query
      track(matchesList.length ? "dictionary_search" : "dictionary_no_result", {
        results: String(matchesList.length),
      });
    }

    if (!matchesList.length) {
      expandedId = null;
      replaceChildren(results, el("div", { className: "card", text: "Belum ada hasil untuk pencarian itu." }));
      return;
    }"""
assert old in s
s = s.replace(old, new, 1)

old = """      try {
        setSaved(item.id, true);
        window.__saveHandlerRan = true;"""
new = """      try {
        setSaved(item.id, true);
        track("word_saved");
        window.__saveHandlerRan = true;"""
if old in s:
    s = s.replace(old, new, 1)

old = """        target: "_blank",
        rel: "noopener noreferrer",
      },
    });"""
new = """        target: "_blank",
        rel: "noopener noreferrer",
      },
    });
    correctionLink.addEventListener("click", () => track("correction_opened"));"""
assert old in s
s = s.replace(old, new, 1)

# pwa_installed + offline_session
old = """  window.addEventListener("online", () => setOfflineBanner(false));"""
new = """  if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(() => track("pwa_installed"));
  }
  window.addEventListener("online", () => setOfflineBanner(false));"""
assert old in s
s = s.replace(old, new, 1)

old = """function setOfflineBanner(offline) {"""
new = """let offlineTracked = false;
function setOfflineBanner(offline) {
  if (offline && !offlineTracked) {
    offlineTracked = true;
    track("offline_session");
  }"""
assert old in s
s = s.replace(old, new, 1)

# lesson_view on learn pages (published or draft page view of the topic)
old = """async function initLearn() {
  const root = $("#lesson-root");"""
new = """async function initLearn() {
  const root = $("#lesson-root");
  track("lesson_view", { slug: document.body.dataset.lesson ?? "" });"""
assert old in s
s = s.replace(old, new, 1)

app.write_text(s, encoding="utf-8", newline="\n")
print("app.js wave applied")
