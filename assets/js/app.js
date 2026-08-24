import { loadLearningItems, loadLessons, loadSentences, loadWordPairs } from "./data.js";
import { SITE_CONFIG } from "./config.js";
import { getProgress, initProgress, markFlashcard, recordAnswer, saveProgress } from "./progress.js";
import { el, replaceChildren } from "./utils/dom.js";
import { normalizeSearch } from "./utils/normalize.js";
import { buildCorrectionUrl } from "./utils/corrections.js";
import { createQuizRunner } from "./game/question-engine.js";
import { buildDailyQueue, computeStreak, summarizeSession } from "./game/session.js";
import { track } from "./analytics.js";
import { sweepPlaceholders } from "./ads.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[random]] = [copy[random], copy[index]];
  }
  return copy;
}

function sample(items, count) {
  return shuffle(items).slice(0, count);
}

function pill(text, extraClass = "", attrs = {}) {
  return el("span", { className: `pill ${extraClass}`.trim(), text, attrs });
}

function initNavToggle() {
  const toggle = $(".nav-toggle");
  const links = $("#nav-links-list");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  $$("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
  });
}

function updateProgressBadges() {
  const progress = getProgress();
  $$("[data-progress-answered]").forEach((node) => (node.textContent = progress.answered));
  $$("[data-progress-correct]").forEach((node) => (node.textContent = progress.correct));
  $$("[data-progress-known]").forEach((node) => (node.textContent = progress.known.length));
}

async function initHome() {
  const statNode = $("[data-home-stats]");
  if (!statNode) return;
  try {
    const { metadata } = await loadLearningItems();
    const stats = [
      [metadata.counts.wordPairs, "pasangan kata"],
      [5, "mode latihan"],
      [0, "login dibutuhkan"],
    ];
    replaceChildren(
      statNode,
      stats.map(([value, label]) =>
        el("div", { className: "stat" }, el("strong", { text: value }), el("span", { text: label })),
      ),
    );
  } catch {
    replaceChildren(statNode, el("p", { text: "Statistik data belum bisa dimuat." }));
  }
}

function formatQuality(item) {
  if (item.reviewStatus === "beta-unreviewed") {
    return "Beta - sumber corpus keagamaan, belum direview";
  }
  return item.quality || item.reviewStatus || item.sourceType || "corpus-derived";
}

async function initDictionary() {
  const input = $("#dictionary-search");
  const results = $("#dictionary-results");
  const filtersRoot = $("#dictionary-filters");
  if (!input || !results) return;
  const { items } = await loadLearningItems();
  const lessons = await loadLessons();
  const searchable = items.filter((item) => item.type !== "sentence");

  const themes = [...new Set([...lessons.published, ...lessons.drafts].map((l) => l.slug))];
  const filters = { direction: "both", theme: "all" };
  let expandedId = null;

  function buildFilters() {
    if (!filtersRoot) return;
    function select(id, label, options, value, onChange) {
      const wrapper = el("label", { className: "filter-field" }, label + " ");
      const selectEl = el("select", { className: "input filter-select", id });
      for (const [val, text] of options) {
        selectEl.append(el("option", { text, attrs: { value: val } }));
      }
      selectEl.value = value;
      selectEl.addEventListener("change", () => onChange(selectEl.value));
      wrapper.append(selectEl);
      return wrapper;
    }
    replaceChildren(
      filtersRoot,
      select(
        "dict-direction",
        "Arah",
        [
          ["both", "Kedua arah"],
          ["batak", "Batak Toba"],
          ["indonesia", "Indonesia"],
        ],
        filters.direction,
        (v) => {
          filters.direction = v;
          render();
        },
      ),
      select(
        "dict-theme",
        "Tema",
        [["all", "Semua tema"], ...themes.map((t) => [t, t])],
        filters.theme,
        (v) => {
          filters.theme = v;
          render();
        },
      ),
    );
  }

  function matchesQuery(item) {
    const query = normalizeSearch(input.value.trim());
    if (!query) return true;
    if (filters.direction === "batak") return normalizeSearch(item.batak).includes(query);
    if (filters.direction === "indonesia") return normalizeSearch(item.indonesia).includes(query);
    return normalizeSearch(item.batak).includes(query) || normalizeSearch(item.indonesia).includes(query);
  }

  function inSelectedTheme(item) {
    if (filters.theme === "all") return true;
    return (item.themes ?? []).includes(filters.theme);
  }

  function detailNode(item) {
    const container = el("div", { className: "result-detail" });
    container.append(el("p", {}, "Status: ", el("strong", { text: formatQuality(item) })));
    const alternatives = [...(item.indonesianAlternatives ?? []), ...(item.batakAlternatives ?? [])];
    if (alternatives.length > 0) {
      container.append(el("p", { text: `Alternatif tercatat: ${alternatives.join(", ")}` }));
    }
    if (item.confidenceScore != null) {
      container.append(
        el("p", { text: `Confidence corpus: ${item.confidenceScore} (${item.confidenceLabel ?? "-"})` }),
      );
    }

    const saveButton = el("button", {
      className: "button secondary",
      text: "Simpan ke daftar latihan",
      attrs: { type: "button" },
    });
    saveButton.addEventListener("click", () => {
      markFlashcard(item.id, "saved");
      saveButton.textContent = "Tersimpan";
      saveButton.disabled = true;
    });

    const correctionLink = el("a", {
      className: "button secondary",
      text: "Lapor koreksi",
      attrs: {
        href: buildCorrectionUrl({
          itemId: item.id,
          batak: item.batak,
          indonesia: item.indonesia,
          pagePath: "/dictionary/",
        }),
        target: "_blank",
        rel: "noopener noreferrer",
      },
    });

    container.append(el("div", { className: "action-row" }, saveButton, correctionLink));
    return container;
  }

  function resultRow(item) {
    const row = el("article", { className: "result-row" });
    row.append(
      el("strong", { text: item.batak }),
      el("span", { text: item.indonesia }),
      pill(formatQuality(item), "", { "data-source-flag": item.sourceType || "corpus-derived" }),
    );
    row.setAttribute("role", "button");
    row.tabIndex = 0;
    row.setAttribute("aria-expanded", String(expandedId === item.id));
    const toggle = () => {
      expandedId = expandedId === item.id ? null : item.id;
      render();
    };
    row.addEventListener("click", toggle);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
    if (expandedId === item.id) row.append(detailNode(item));
    return row;
  }

  function render() {
    const matchesList = searchable
      .filter((item) => matchesQuery(item) && inSelectedTheme(item))
      .slice(0, 60);

    if (!matchesList.length) {
      expandedId = null;
      replaceChildren(results, el("div", { className: "card", text: "Belum ada hasil untuk pencarian itu." }));
      return;
    }

    replaceChildren(
      results,
      el("p", { className: "feedback", attrs: { role: "status" }, text: `${matchesList.length} hasil ditampilkan.` }),
      matchesList.map(resultRow),
    );
  }

  input.addEventListener("input", () => {
    expandedId = null;
    render();
  });
  buildFilters();
  render();
}

async function initGames() {
  const panel = $("#game-panel");
  if (!panel) return;
  const wordData = await loadWordPairs();
  const sentenceData = await loadSentences();
  const wordPool = wordData.items;
  const sentencePool = sentenceData.items;
  const idLookup = new Map([...wordPool, ...sentencePool].map((item) => [item.id, item]));
  const modes = {
    meaning: { label: "Tebak Arti", prompt: "Pilih arti Indonesia", from: "batak", to: "indonesia", pool: wordPool },
    reverse: { label: "Reverse Quiz", prompt: "Pilih padanan Batak Toba", from: "indonesia", to: "batak", pool: wordPool },
    sentence: { label: "Kalimat Pendek", prompt: "Pilih terjemahan yang paling cocok", from: "batak", to: "indonesia", pool: sentencePool },
  };

  let state = {
    mode: getProgress().lastMode || "meaning",
    answered: 0,
    correct: 0,
    current: null,
    options: [],
    locked: false,
    startedAt: Date.now(),
    matched: new Set(),
    selected: [],
    sessionSize: 10,
    sessionAnswers: [],
    inReviewMode: false,
  };

  const runners = {};
  function getRunner(mode, { fresh = false, poolOverride = null, initialIds = null } = {}) {
    if (fresh || !runners[mode]) {
      const config = modes[mode];
      runners[mode] = createQuizRunner({
        pool: poolOverride ?? config.pool,
        from: config.from,
        to: config.to,
        initialIds,
      });
    }
    return runners[mode];
  }

  function itemById(id) {
    return idLookup.get(id) ?? null;
  }

  function startSession({ mode = state.mode, size = state.sessionSize } = {}) {
    const config = modes[mode];
    if (!config) return;
    state = {
      ...state,
      mode,
      answered: 0,
      correct: 0,
      locked: false,
      matched: new Set(),
      selected: [],
      startedAt: Date.now(),
      sessionSize: size,
      sessionAnswers: [],
      inReviewMode: false,
    };
    getRunner(mode, { fresh: true });
    saveProgress({ lastMode: mode });
    $$(".mode-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
    if (mode === "matching") renderMatching();
    else nextQuestion();
  }

  function setModeWithTracking(mode) {
    track("game_start", { mode });
    startSession({ mode });
  }

  function setMode(mode) {
    startSession({ mode });
  }

  function renderQuiz() {
    const config = modes[state.mode];
    const question = state.current;

    const feedback = el("p", { className: "feedback", id: "feedback", attrs: { "aria-live": "polite" } });
    const nextButton = el("button", {
      className: "button",
      id: "next-question",
      text: "Next",
      attrs: { type: "button", disabled: true },
    });

    const optionButtons = question.options.map((option) => {
      const button = el("button", {
        className: "option",
        text: option.label,
        attrs: { type: "button", "data-answer": option.id },
      });
      button.addEventListener("click", () => answerQuestion(button));
      return button;
    });

    nextButton.addEventListener("click", nextQuestion);

    replaceChildren(
      panel,
      el(
        "div",
        { className: "scorebar" },
        pill(config.label),
        pill(`Ronde ${state.answered + 1}`),
        pill(`Skor ${state.correct}/${state.answered}`),
      ),
      el(
        "div",
        { className: "prompt" },
        el("span", { className: "prompt-kicker", text: config.prompt }),
        el("strong", { className: "prompt-text", text: question.prompt }),
      ),
      el("div", { className: "options" }, optionButtons),
      feedback,
      el(
        "div",
        { className: "action-row" },
        nextButton,
        pill(formatQuality(question), "", {
          "data-source-flag": question.sourceFlag || "corpus-derived",
        }),
      ),
    );
  }

  function answerQuestion(button) {
    if (state.locked) return;
    const runner = getRunner(state.mode);
    const result = runner.answer(button.dataset.answer);
    if (!result.accepted) return;
    state.locked = true;
    state.answered += 1;
    state.correct += result.isCorrect ? 1 : 0;
    state.sessionAnswers = [...state.sessionAnswers, { itemId: result.itemId, isCorrect: result.isCorrect }];
    recordAnswer(result.isCorrect, state.mode, result.itemId);
    $$(".option", panel).forEach((option) => {
      option.disabled = true;
      if (option.dataset.answer === result.correctOptionId) {
        option.classList.add("correct");
        option.dataset.state = "correct";
      }
    });
    if (!result.isCorrect) {
      button.classList.add("wrong");
      button.dataset.state = "wrong";
    }
    const correctLabel = state.current.options.find(
      (option) => option.id === result.correctOptionId,
    )?.label;
    const feedback = $("#feedback", panel);
    feedback.textContent = result.isCorrect
      ? "Benar."
      : `Belum tepat. Jawaban yang dicari: ${correctLabel}.`;

    const nextButton = $("#next-question", panel);
    const sessionLimit = state.inReviewMode ? state.reviewTarget ?? state.sessionSize : state.sessionSize;
    if (state.answered >= sessionLimit) {
      nextButton.textContent = "Lihat Hasil";
    } else if (state.answered + 1 === sessionLimit) {
      nextButton.textContent = "Soal Terakhir";
    }
    nextButton.disabled = false;
    updateProgressBadges();
  }

  function nextQuestion() {
    const sessionLimit = state.inReviewMode ? state.reviewTarget ?? state.sessionSize : state.sessionSize;
    if (state.answered >= sessionLimit) {
      if (state.inReviewMode) {
        renderSummary({ finishedReview: true });
      } else {
        renderSummary();
      }
      return;
    }
    const runner = getRunner(state.mode);
    const { question, error } = runner.nextQuestion();
    if (error || !question) {
      replaceChildren(
        panel,
        el("p", {
          className: "feedback",
          text: "Data soal belum tersedia untuk mode ini. Coba mode lain.",
          attrs: { role: "alert" },
        }),
      );
      return;
    }
    state = { ...state, current: question, locked: false };
    renderQuiz();
    const promptNode = $(".prompt-text", panel);
    if (promptNode && state.answered > 0) {
      promptNode.setAttribute("tabindex", "-1");
      promptNode.focus({ preventScroll: false });
    }
  }

  function handleQuizKeyboard(event) {
    if (state.mode === "matching") return;
    if (!["1", "2", "3", "4"].includes(event.key)) return;
    const target = event.target;
    if (target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) {
      return;
    }
    const options = $$(".option", panel);
    const index = Number(event.key) - 1;
    const option = options[index];
    if (option && !option.disabled && !state.locked) {
      event.preventDefault();
      option.click();
    }
  }

  document.addEventListener("keydown", handleQuizKeyboard);

  function renderMatching() {
    const pairs = sample(wordPool, 5);
    const cards = shuffle([
      ...pairs.map((item) => ({ id: item.id, side: "batak", text: item.batak })),
      ...pairs.map((item) => ({ id: item.id, side: "indonesia", text: item.indonesia })),
    ]);
    state = {
      ...state,
      mode: "matching",
      current: pairs,
      options: cards,
      matched: new Set(),
      selected: [],
      startedAt: Date.now(),
    };
    paintMatching();
  }

  function paintMatching(message = "") {
    const cardButtons = state.options.map((card, index) => {
      const isMatched = state.matched.has(card.id);
      return el("button", {
        className: `match-card${isMatched ? " matched" : ""}`,
        text: card.text,
        attrs: {
          type: "button",
          "data-index": index,
          disabled: isMatched || undefined,
        },
      });
    });
    cardButtons.forEach((button) => button.addEventListener("click", () => chooseMatch(button)));

    const newRound = el("button", {
      className: "button secondary",
      id: "new-match",
      text: "Ronde Baru",
      attrs: { type: "button" },
    });
    newRound.addEventListener("click", renderMatching);

    replaceChildren(
      panel,
      el(
        "div",
        { className: "scorebar" },
        pill("Matching Pairs"),
        pill(`${state.matched.size}/5 cocok`),
      ),
      el("div", { className: "matching-board" }, cardButtons),
      el("p", { className: "feedback", text: message, attrs: { "aria-live": "polite" } }),
      el("div", { className: "action-row" }, newRound),
    );
  }

  function chooseMatch(button) {
    const card = state.options[Number(button.dataset.index)];
    if (state.matched.has(card.id)) return;
    state.selected = [...state.selected, card].slice(-2);
    button.classList.add("selected");
    if (state.selected.length < 2) return;

    const [first, second] = state.selected;
    const isMatch = first.id === second.id && first.side !== second.side;
    if (isMatch) {
      state.matched.add(first.id);
      recordAnswer(true, "matching", first.id);
      if (state.matched.size === 5) {
        const seconds = Math.round((Date.now() - state.startedAt) / 1000);
        paintMatching(`Selesai. Semua pasangan cocok dalam ${seconds} detik.`);
      } else {
        paintMatching("Cocok.");
      }
    } else {
      recordAnswer(false, "matching", first.id);
      paintMatching("Belum cocok. Coba pasangan lain.");
    }
    state.selected = [];
    updateProgressBadges();
  }

  function renderSummary({ finishedReview = false } = {}) {
    const summary = summarizeSession(state.sessionAnswers);
    if (!finishedReview) recordCompletedSession(summary);
    track(finishedReview ? "mistake_review_complete" : "session_complete", {
      mode: state.mode,
      answered: String(summary.answered),
      correct: String(summary.correct),
      meaningful: String(summary.isMeaningful),
    });
    renderSummaryPanel(summary, finishedReview);
  }

  function renderSummaryPanel(summary, finishedReview) {
    const mistakeItems = summary.mistakeIds.map((id) => itemById(id)).filter(Boolean);

    const headline = el("h2", { text: finishedReview ? "Review kesalahan selesai" : "Sesi selesai" });
    const stats = el(
      "div",
      { className: "scorebar" },
      pill(`${summary.answered} soal`),
      pill(`${summary.correct} benar`),
      pill(`${summary.incorrect} salah`),
      pill(summary.accuracy === null ? "Akurasi -" : `Akurasi ${summary.accuracy}%`),
    );

    const children = [headline, stats];

    if (finishedReview) {
      children.push(el("p", { className: "lead", text: "Kesalahan dari sesi terakhir sudah diulang." }));
    } else if (mistakeItems.length > 0) {
      const reviewButton = el("button", {
        className: "button",
        id: "review-mistakes",
        text: `Review Kesalahan (${mistakeItems.length})`,
        attrs: { type: "button" },
      });
      reviewButton.addEventListener("click", () => startMistakeReview(mistakeItems.map((item) => item.id)));
      children.push(reviewButton);
    } else {
      children.push(el("p", { className: "lead", text: "Tidak ada kesalahan. Bagus!" }));
    }

    if (mistakeItems.length > 0) {
      const list = mistakeItems.slice(0, 20).map((item) =>
        el(
          "article",
          { className: "result-row" },
          el("strong", { text: item.batak }),
          el("span", { text: item.indonesia }),
          pill(formatQuality(item), "", {
            "data-source-flag": item.sourceType || "corpus-derived",
          }),
        ),
      );
      children.push(el("h3", { text: "Perlu diulang" }), el("div", {}, list));
    }

    const newSession = el("button", {
      className: "button",
      id: "new-session",
      text: "Sesi Baru",
      attrs: { type: "button" },
    });
    newSession.addEventListener("click", () => startSession());
    const switchHint = el("p", {
      className: "feedback",
      text: `Mode berikutnya yang disarankan: ${
        state.mode === "meaning" ? "Reverse Quiz" : "Tebak Arti"
      }.`,
    });

    children.push(el("div", { className: "action-row" }, newSession), switchHint);

    replaceChildren(panel, children);
  }

  function startMistakeReview(ids) {
    const uniqueIds = [...new Set(ids)];
    state = {
      ...state,
      answered: 0,
      correct: 0,
      locked: false,
      sessionAnswers: [],
      inReviewMode: true,
      reviewTarget: uniqueIds.length,
    };
    getRunner(state.mode, { fresh: true, initialIds: uniqueIds });
    nextQuestion();
  }

  function startDailyPractice() {
    const progressState = getProgress();
    const queueIds = buildDailyQueue(wordPool, progressState.items, {
      size: Math.min(state.sessionSize, wordPool.length),
    }).map((item) => item.id);
    if (!queueIds.length) return;
    state = {
      ...state,
      mode: "meaning",
      answered: 0,
      correct: 0,
      locked: false,
      matched: new Set(),
      selected: [],
      startedAt: Date.now(),
      sessionAnswers: [],
      inReviewMode: false,
    };
    saveProgress({ lastMode: "meaning" });
    $$(".mode-button[data-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === "meaning"));
    });
    getRunner("meaning", { fresh: true, initialIds: queueIds });
    nextQuestion();
  }

  function updateStreakBadge() {
    const progressState = getProgress();
    const streak = computeStreak((progressState.sessions ?? []).map((session) => session.dateKey));
    $$("[data-progress-streak]").forEach((node) => (node.textContent = streak));
  }

  function recordCompletedSession(summary) {
    if (!summary.isMeaningful) return;
    const current = getProgress();
    const sessions = [
      ...(current.sessions ?? []),
      {
        dateKey: new Date().toISOString().slice(0, 10),
        mode: state.mode,
        answered: summary.answered,
        correct: summary.correct,
        completedAt: Date.now(),
      },
    ].slice(-30);
    saveProgress({ sessions });
    updateStreakBadge();
  }

  $$(".mode-button[data-mode]").forEach((button) =>
    button.addEventListener("click", () => setModeWithTracking(button.dataset.mode)),
  );
  $$(".session-size-button").forEach((button) =>
    button.addEventListener("click", () => {
      state.sessionSize = Number(button.dataset.size) || 10;
      $$(".session-size-button").forEach((other) =>
        other.setAttribute("aria-pressed", String(other.dataset.size === String(state.sessionSize))),
      );
      if (state.mode !== "matching") startSession({ size: state.sessionSize });
    }),
  );
  $("#daily-practice")?.addEventListener("click", startDailyPractice);

  $$(".session-size-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.size === String(state.sessionSize)));
  });
  updateStreakBadge();
  setMode(state.mode);
}

async function initFlashcards() {
  const root = $("#flashcard-root");
  if (!root) return;
  const { items } = await loadWordPairs();
  let index = 0;
  let flipped = false;

  function render() {
    const item = items[index % items.length];

    const card = el(
      "button",
      {
        className: "flashcard",
        id: "flashcard",
        attrs: { type: "button" },
      },
      el("strong", { text: flipped ? item.indonesia : item.batak }),
      el("span", { text: `${flipped ? "Indonesia" : "Batak Toba"} - klik untuk balik` }),
    );
    card.addEventListener("click", () => {
      flipped = !flipped;
      render();
    });

    function advance(step, bucket) {
      if (bucket) markFlashcard(item.id, bucket);
      index = (index + step + items.length) % items.length;
      flipped = false;
      render();
    }

    const prevButton = el("button", { className: "button secondary", id: "prev-card", text: "Previous", attrs: { type: "button" } });
    prevButton.addEventListener("click", () => advance(-1));
    const knownButton = el("button", { className: "button", id: "known-card", text: "Saya tahu", attrs: { type: "button" } });
    knownButton.addEventListener("click", () => advance(1, "known"));
    const reviewButton = el("button", { className: "button secondary", id: "review-card", text: "Ulangi lagi", attrs: { type: "button" } });
    reviewButton.addEventListener("click", () => advance(1, "review"));
    const nextButton = el("button", { className: "button secondary", id: "next-card", text: "Next", attrs: { type: "button" } });
    nextButton.addEventListener("click", () => advance(1));

    replaceChildren(
      root,
      el(
        "div",
        { className: "scorebar" },
        pill(`${index + 1}/${items.length}`),
        el(
          "span",
          { className: "pill" },
          "Diketahui ",
          el("span", { text: getProgress().known.length, attrs: { "data-progress-known": "" } }),
        ),
        pill(formatQuality(item), "", { "data-source-flag": item.sourceType || "corpus-derived" }),
      ),
      card,
      el(
        "div",
        { className: "action-row" },
        prevButton,
        knownButton,
        reviewButton,
        nextButton,
      ),
    );
  }

  render();
}

async function initLearn() {
  const root = $("#lesson-root");
  const theme = document.body.dataset.lesson;
  if (!root || !theme) return;

  const [lessons, learning, words] = await Promise.all([loadLessons(), loadLearningItems(), loadWordPairs()]);
  const lesson = [...lessons.published, ...lessons.drafts].find((entry) => entry.slug === theme);
  if (!lesson) {
    replaceChildren(root, el("p", { className: "feedback", text: "Materi untuk tema ini belum tersedia." }));
    return;
  }

  const itemById = new Map(learning.items.map((item) => [item.id, item]));
  const poolItems = lesson.itemIds.map((id) => itemById.get(id)).filter(Boolean);
  const wordPool = words.items;

  function vocabRow(batakText, indonesiaText, statusPill) {
    return el(
      "div",
      { className: "vocab-row" },
      el("strong", { text: batakText }),
      el("span", { text: indonesiaText }),
      statusPill,
    );
  }

  const children = [];

  children.push(
    el("p", {
      className: "feedback",
      text:
        lesson.publicationStatus === "published"
          ? `Lesson latihan aktif: ${lesson.counts.poolItems} item corpus.`
          : `Status: materi pelengkap editorial (draft). Lesson latihan penuh butuh minimal ${lessons.minPoolItemsForPublication} item corpus per tema; tema ini punya ${lesson.counts.poolItems}.`,
    }),
  );

  if (poolItems.length > 0) {
    children.push(el("h2", { text: "Dari corpus (corpus-derived)" }));
    children.push(
      el(
        "div",
        { className: "vocab-table" },
        poolItems.map((item) =>
          vocabRow(item.batak, item.indonesia, pill(formatQuality(item), "", {
            "data-source-flag": item.sourceType || "corpus-derived",
          })),
        ),
      ),
    );
  }

  if (lesson.supplementItems.length > 0) {
    children.push(
      el("div", {
        className: "draft-banner",
        attrs: { role: "note" },
      }, "Editorial draft - menunggu review penutur. Bukan kamus final; laporkan koreksi bila ada yang keliru."),
    );
    children.push(
      el(
        "div",
        { className: "vocab-table" },
        lesson.supplementItems.map((item) =>
          vocabRow(
            item.batak,
            item.indonesia,
            pill("draft - perlu review", "", { "data-source-flag": "editorial-draft" }),
          ),
        ),
      ),
    );
  }

  // Mini practice: only from real corpus items with enough distinct material.
  const practiceRoot = el("section", { className: "mini-practice", id: "mini-practice" });
  children.push(el("h2", { text: "Mini latihan" }), practiceRoot);

  replaceChildren(root, children);

  if (poolItems.length >= 4) {
    renderMiniPractice(practiceRoot, poolItems, wordPool);
  } else {
    replaceChildren(
      practiceRoot,
      el("p", {
        className: "feedback",
        text: "Latihan interaktif untuk tema ini menyusul setelah cukup item corpus tereview.",
      }),
    );
  }
}

function renderMiniPractice(root, themeItems, fullPool) {
  const runner = createQuizRunner({
    pool: fullPool.length >= 4 ? fullPool : themeItems,
    from: "batak",
    to: "indonesia",
    initialIds: themeItems.map((item) => item.id),
  });
  let answered = 0;
  let correct = 0;
  let current = null;

  function renderQuestion() {
    const result = runner.nextQuestion();
    current = result.question ?? null;
    if (!current) {
      replaceChildren(root, el("p", { className: "feedback", text: "Latihan selesai untuk sesi ini." }));
      return;
    }
    const feedback = el("p", { className: "feedback", attrs: { "aria-live": "polite" } });
    const optionButtons = current.options.map((option) => {
      const button = el("button", {
        className: "option",
        text: option.label,
        attrs: { type: "button", "data-answer": option.id },
      });
      button.addEventListener("click", () => {
        if (answered >= themeItems.length || runner.isLocked()) return;
        const outcome = runner.answer(option.id);
        if (!outcome.accepted) return;
        answered += 1;
        correct += outcome.isCorrect ? 1 : 0;
        recordAnswer(outcome.isCorrect, `lesson:${document.body.dataset.lesson}`, outcome.itemId);
        $$(".option", root).forEach((other) => {
          other.disabled = true;
          if (other.dataset.answer === outcome.correctOptionId) other.classList.add("correct");
        });
        if (!outcome.isCorrect) button.classList.add("wrong");
        feedback.textContent = outcome.isCorrect ? "Benar." : "Belum tepat.";
        updateProgressBadges();
        nextButton.disabled = false;
        nextButton.textContent =
          answered >= Math.min(themeItems.length, 5) ? "Lihat Hasil" : "Lanjut";
      });
      return button;
    });

    const nextButton = el("button", {
      className: "button",
      id: "mini-next",
      text: "Lanjut",
      attrs: { type: "button", disabled: true },
    });
    nextButton.addEventListener("click", () => {
      if (answered >= Math.min(themeItems.length, 5)) {
        renderSummaryMini();
      } else {
        renderQuestion();
      }
    });

    replaceChildren(
      root,
      el(
        "div",
        { className: "scorebar" },
        pill(`Mini latihan ${Math.min(answered + 1, themeItems.length)}/${Math.min(themeItems.length, 5)}`),
        pill(formatQuality(current), "", { "data-source-flag": current.sourceFlag || "corpus-derived" }),
      ),
      el(
        "div",
        { className: "prompt" },
        el("span", { className: "prompt-kicker", text: "Pilih arti yang cocok" }),
        el("strong", { className: "prompt-text", text: current.prompt }),
      ),
      el("div", { className: "options" }, optionButtons),
      feedback,
      el("div", { className: "action-row" }, nextButton),
    );
  }

  function renderSummaryMini() {
    replaceChildren(
      root,
      el("p", {
        className: "feedback",
        text: `Mini latihan selesai: ${correct}/${answered} benar. Lanjutkan ke Games untuk latihan penuh.`,
      }),
      (() => {
        const again = el("button", { className: "button secondary", text: "Ulangi", attrs: { type: "button" } });
        again.addEventListener("click", () => {
          answered = 0;
          correct = 0;
          renderQuestion();
        });
        return again;
      })(),
    );
  }

  renderQuestion();
}

async function main() {
  await initProgress();
  initNavToggle();
  setActiveNav();
  updateProgressBadges();
  registerServiceWorker();
  sweepPlaceholders();
  const page = document.body.dataset.page;
  if (page === "home") await initHome();
  if (page === "dictionary") await initDictionary();
  if (page === "games") await initGames();
  if (page === "flashcards") await initFlashcards();
  if (page === "learn-topic") await initLearn();
}

function registerServiceWorker() {
  if (!SITE_CONFIG.features.pwa) return;
  if (!("serviceWorker" in navigator)) return;
  // Resolve relative to this module so the path is correct on every page depth.
  const swUrl = new URL("../../sw.js", import.meta.url);
  navigator.serviceWorker.register(swUrl).catch(() => {
    /* offline support is progressive enhancement; never block the app */
  });
}

main().catch((error) => {
  import("./utils/dom.js").then(({ showError }) => {
    showError($("main"), error && error.message ? error.message : "Kesalahan tidak diketahui.");
  });
});
