import { loadLearningItems, loadLessons, loadSentences, loadWordPairs } from "./data.js";
import { SITE_CONFIG } from "./config.js";
import {
  exportProgress,
  getBucketIds,
  getDifficultIds,
  getDueItems,
  getItemStats,
  getProgress,
  getSavedIds,
  importProgress,
  initProgress,
  markFlashcard,
  recordAnswer,
  resetProgress,
  saveProgress,
  setDifficult,
  setSaved,
} from "./progress.js";
import { el, replaceChildren } from "./utils/dom.js";
import { normalizeSearch } from "./utils/normalize.js";
import { buildCorrectionUrl } from "./utils/corrections.js";
import { createQuizRunner, shuffleWith } from "./game/question-engine.js";
import { buildDailyQueue, computeStreak, masteryLabel, summarizeSession } from "./game/session.js";
import { getOnboarding, saveOnboarding, shouldOfferOnboarding } from "./onboarding.js";
import {
  buildMemoryBoard,
  buildTrueFalse,
  checkTypedAnswer,
  dailySeed,
  mulberry32,
  todayDateKey,
} from "./game/modes.js";
import { track, hasAnalyticsConsent, grantAnalyticsConsent, revokeAnalyticsConsent } from "./analytics.js";
import { sweepPlaceholders, readAdsConsent, grantAdsConsent, revokeAdsConsent } from "./ads.js";

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
  $$("[data-progress-known]").forEach((node) => (node.textContent = getBucketIds("known").length));
}

async function initHome() {
  const statNode = $("[data-home-stats]");
  const dynamicNode = $("#home-dynamic");
  try {
    const [learning, words] = await Promise.all([loadLearningItems(), loadWordPairs()]);
    if (statNode) {
      const stats = [
        [learning.metadata.counts.wordPairs, "pasangan kata"],
        [5, "mode latihan"],
        [0, "login dibutuhkan"],
      ];
      replaceChildren(
        statNode,
        stats.map(([value, label]) =>
          el("div", { className: "stat" }, el("strong", { text: value }), el("span", { text: label })),
        ),
      );
    }
    if (dynamicNode) {
      renderHomeDynamic(dynamicNode, words.items);
    }
  } catch {
    if (statNode) replaceChildren(statNode, el("p", { text: "Statistik data belum bisa dimuat." }));
  }
}

function renderHomeDynamic(container, wordPool) {
  const progressState = getProgress();
  const onboardingRecord = getOnboarding();

  function renderOnboarding() {
    function choiceGroup(label, options, onPick) {
      const group = el("fieldset", { className: "onboarding-group" });
      group.append(el("legend", { text: label }));
      const row = el("div", { className: "action-row" });
      for (const option of options) {
        const button = el("button", {
          className: "button secondary",
          text: option.label,
          attrs: { type: "button" },
        });
        button.addEventListener("click", () => onPick(option));
        row.append(button);
      }
      group.append(row);
      return group;
    }

    let draft = {};
    const panel = el("section", { className: "section band onboarding-panel" });
    const body = el("div", { className: "section-inner" });
    body.append(
      el("h2", { text: "Mulai cepat (opsional)" }),
      el("p", { className: "lead", text: "Tiga pertanyaan ringkas agar rekomendasi lebih pas. Semua tersimpan lokal dan bisa dilewati." }),
    );

    function renderStep() {
      if (draft.durationMinutes) {
        saveOnboarding({ ...draft, skipped: false });
        track("lesson_start", { kind: "onboarding" });
        renderHomeDynamic(container, wordPool);
        return;
      }
      replaceChildren(body, el("h2", { text: "Mulai cepat (opsional)" }));
      if (!draft.familiarity) {
        body.append(
          choiceGroup("Seberapa jauh Anda mengenal Bahasa Batak Toba?", [
            { label: "Belum pernah", value: "belum" },
            { label: "Beberapa kata", value: "beberapa-kata" },
            { label: "Paham sedikit", value: "sedikit" },
            { label: "Ingin review", value: "review" },
          ], (option) => {
            draft.familiarity = option.value;
            renderStep();
          }),
        );
      } else if (!draft.goal) {
        body.append(
          choiceGroup("Tujuan utama?", [
            { label: "Keluarga", value: "keluarga" },
            { label: "Percakapan dasar", value: "percakapan" },
            { label: "Kosakata umum", value: "kosakata-umum" },
            { label: "Koneksi budaya", value: "budaya" },
            { label: "Latihan santai", value: "santai" },
          ], (option) => {
            draft.goal = option.value;
            renderStep();
          }),
        );
      } else {
        body.append(
          choiceGroup("Durasi sesi favorit?", [
            { label: "3 menit", value: 3 },
            { label: "5 menit", value: 5 },
            { label: "10 menit", value: 10 },
          ], (option) => {
            draft.durationMinutes = option.value;
            renderStep();
          }),
        );
      }
      const skip = el("button", { className: "button secondary", text: "Lewati", attrs: { type: "button" } });
      skip.addEventListener("click", () => {
        saveOnboarding({ ...draft, skipped: true });
        renderHomeDynamic(container, wordPool);
      });
      body.append(el("div", { className: "action-row" }, skip));
      replaceChildren(panel, body);
    }

    renderStep();
    replaceChildren(container, panel);
  }

  function renderReturning() {
    const dueCount = getDueItems(wordPool).length;
    const streak = computeStreak((progressState.sessions ?? []).map((session) => session.dateKey));
    const savedCount = getSavedIds().length;
    const difficultCount = getDifficultIds().length;

    const card = el("section", { className: "section band continue-card" });
    const inner = el("div", { className: "section-inner" });
    inner.append(el("h2", { text: "Lanjutkan Belajar" }));
    inner.append(
      el(
        "div",
        { className: "scorebar" },
        pill(`${dueCount} kata jatuh tempo`),
        pill(`Streak ${streak} hari`),
        pill(`Terakhir: ${progressState.lastMode ?? "-"}`),
        savedCount ? pill(`${savedCount} disimpan`) : null,
        difficultCount ? pill(`${difficultCount} sulit`) : null,
      ),
    );
    const actions = el("div", { className: "action-row" });
    const dailyButton = el("a", { className: "button", text: "Latihan Harian", attrs: { href: "games/" } });
    dailyButton.addEventListener("click", () => {
      saveProgress({ startWithDaily: true });
    });
    actions.append(
      dailyButton,
      el("a", { className: "button secondary", text: "Lanjut mode terakhir", attrs: { href: "games/" } }),
      el("a", { className: "button secondary", text: "Flashcards review", attrs: { href: "flashcards/" } }),
    );
    inner.append(actions);
    card.append(inner);
    replaceChildren(container, card);
  }

  if (shouldOfferOnboarding(progressState)) renderOnboarding();
  else if ((progressState.answered ?? 0) > 0 || (progressState.sessions ?? []).length > 0) renderReturning();
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
    meaning: { label: "Tebak Arti", prompt: "Pilih arti Indonesia", from: "batak", to: "indonesia", pool: wordPool, kind: "quiz" },
    reverse: { label: "Reverse Quiz", prompt: "Pilih padanan Batak Toba", from: "indonesia", to: "batak", pool: wordPool, kind: "quiz" },
    typed: { label: "Ketik Jawaban", prompt: "Ketik arti Indonesia", from: "batak", to: "indonesia", pool: wordPool, kind: "typed" },
    truefalse: { label: "Benar / Salah", prompt: "Pasangan ini benar?", from: "batak", to: "indonesia", pool: wordPool, kind: "truefalse" },
    daily: { label: "Daily Challenge", prompt: "Pilih arti Indonesia (challenge harian)", from: "batak", to: "indonesia", pool: wordPool, kind: "quiz" },
    sentence: { label: "Kalimat Pendek", prompt: "Pilih terjemahan yang paling cocok", from: "batak", to: "indonesia", pool: sentencePool, kind: "quiz" },
    memory: { label: "Memory Game", prompt: "Cocokkan pasangan kartu", from: "batak", to: "indonesia", pool: wordPool, kind: "memory" },
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
      let random = Math.random;
      if (mode === "daily") {
        // Deterministic date-seeded challenge: identical for everyone on the
        // same day with the same published dataset.
        random = mulberry32(dailySeed(todayDateKey()));
        const seededOrder = shuffleWith(config.pool, random).map((item) => item.id);
        initialIds = initialIds ?? seededOrder.slice(0, 10);
      }
      runners[mode] = createQuizRunner({
        pool: poolOverride ?? config.pool,
        from: config.from,
        to: config.to,
        initialIds,
        ...(mode === "daily" ? { random } : {}),
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
      typedValue: "",
    };
    if (config.kind === "memory") {
      renderMemory();
    } else {
      getRunner(mode, { fresh: true });
      nextQuestion();
    }
    saveProgress({ lastMode: mode });
    $$(".mode-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
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
    const kind = modes[state.mode].kind;
    const sessionLimit = state.inReviewMode ? state.reviewTarget ?? state.sessionSize : state.sessionSize;
    if (kind !== "memory" && state.answered >= sessionLimit) {
      if (state.inReviewMode) {
        renderSummary({ finishedReview: true });
      } else {
        renderSummary();
      }
      return;
    }
    if (kind === "typed") {
      renderTypedQuestion();
      return;
    }
    if (kind === "truefalse") {
      renderTrueFalse();
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

  /* ---- Ketik Jawaban ---------------------------------------------------- */

  function renderTypedQuestion() {
    const config = modes[state.mode];
    const runner = getRunner(state.mode);
    const { question, error } = runner.nextQuestion();
    if (error || !question) {
      replaceChildren(panel, el("p", { className: "feedback", text: "Soal tidak tersedia." }));
      return;
    }
    state = { ...state, current: question, locked: false };
    const item = itemById(question.itemId);
    const input = el("input", {
      className: "input typed-answer-input",
      attrs: {
        type: "text",
        autocomplete: "off",
        autocapitalize: "none",
        spellcheck: "false",
        "aria-label": "Ketik jawaban",
        placeholder: "Ketik di sini lalu Enter",
      },
    });
    const checkButton = el("button", { className: "button", text: "Periksa", attrs: { type: "button", disabled: true } });
    const nextButton = el("button", {
      className: "button",
      id: "next-question",
      text: "Next",
      attrs: { type: "button", disabled: true },
    });
    nextButton.addEventListener("click", nextQuestion);
    const feedback = el("p", { className: "feedback", attrs: { "aria-live": "polite" } });

    function grade() {
      if (state.locked) return;
      const result = checkTypedAnswer(input.value, item, { to: config.to });
      state.locked = true;
      state.answered += 1;
      state.correct += result.correct ? 1 : 0;
      state.sessionAnswers = [...state.sessionAnswers, { itemId: question.itemId, isCorrect: result.correct }];
      recordAnswer(result.correct, state.mode, question.itemId);
      track(result.correct ? "answer_correct" : "answer_incorrect", { mode: state.mode });
      input.disabled = true;
      checkButton.disabled = true;
      feedback.textContent = result.correct
        ? result.fuzzy
          ? `Benar (toleransi typo). Jawaban tercatat: ${result.expected}.`
          : "Benar."
        : `Belum tepat. Jawaban yang dicari: ${result.expected}.`;
      nextButton.disabled = false;
      nextButton.focus();
      updateProgressBadges();
    }

    input.addEventListener("input", () => {
      checkButton.disabled = input.value.trim().length === 0;
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!state.locked && input.value.trim()) grade();
      }
    });
    checkButton.addEventListener("click", grade);

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
      el("div", { className: "action-row" }, input, checkButton),
      feedback,
      el(
        "div",
        { className: "action-row" },
        nextButton,
        pill(formatQuality(question), "", { "data-source-flag": question.sourceFlag || "corpus-derived" }),
      ),
    );
    input.focus();
  }

  /* ---- Benar / Salah ----------------------------------------------------- */

  function renderTrueFalse() {
    const config = modes[state.mode];
    const runner = getRunner(state.mode);
    const { question, error } = runner.nextQuestion();
    if (error || !question) {
      replaceChildren(panel, el("p", { className: "feedback", text: "Soal tidak tersedia." }));
      return;
    }
    const item = itemById(question.itemId);
    const tf = buildTrueFalse(item, config.pool, { to: config.to });
    state = { ...state, current: { ...question, prompt: tf.statement }, locked: false };

    const feedback = el("p", { className: "feedback", attrs: { "aria-live": "polite" } });
    const sessionLimit = state.inReviewMode ? state.reviewTarget ?? state.sessionSize : state.sessionSize;

    function answer(userSaysTrue) {
      if (state.locked) return;
      state.locked = true;
      const isCorrect = userSaysTrue === tf.isTrueStatement;
      state.answered += 1;
      state.correct += isCorrect ? 1 : 0;
      state.sessionAnswers = [...state.sessionAnswers, { itemId: tf.itemId, isCorrect }];
      recordAnswer(isCorrect, state.mode, tf.itemId);
      track(isCorrect ? "answer_correct" : "answer_incorrect", { mode: state.mode });
      $$(".option", panel).forEach((option) => {
        option.disabled = true;
        option.dataset.state =
          (option.dataset.saystrue === "true") === tf.isTrueStatement ? "correct" : "";
      });
      feedback.textContent = isCorrect
        ? "Benar."
        : tf.isTrueStatement
          ? "Sebenarnya pasangan itu benar."
          : `Sebenarnya salah. ${item.batak} = ${item[config.to]}.`;
      const nextButton = $("#next-question", panel);
      nextButton.disabled = false;
      nextButton.textContent = state.answered >= sessionLimit ? "Lihat Hasil" : "Next";
      nextButton.focus();
      updateProgressBadges();
    }

    const trueButton = el("button", {
      className: "option",
      text: "Pasangan BENAR",
      attrs: { type: "button", "data-saystrue": "true" },
    });
    trueButton.addEventListener("click", () => answer(true));
    const falseButton = el("button", {
      className: "option",
      text: "Pasangan SALAH",
      attrs: { type: "button", "data-saystrue": "false" },
    });
    falseButton.addEventListener("click", () => answer(false));
    const nextButton = el("button", {
      className: "button",
      id: "next-question",
      text: "Next",
      attrs: { type: "button", disabled: true },
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
        el("strong", { className: "prompt-text", text: tf.statement }),
      ),
      el("div", { className: "options" }, trueButton, falseButton),
      feedback,
      el(
        "div",
        { className: "action-row" },
        nextButton,
        pill(formatQuality({ ...item, sourceType: item.sourceType }), "", {
          "data-source-flag": item.sourceType || "corpus-derived",
        }),
      ),
    );
  }

  /* ---- Memory Game ------------------------------------------------------- */

  function renderMemory() {
    const pairCount = state.memoryPairs ?? 6;
    const { cards, pairs } = buildMemoryBoard(wordPool, { pairCount });
    state = {
      ...state,
      mode: "memory",
      options: cards,
      matched: new Set(),
      selected: [],
      memoryTotalPairs: pairs,
      startedAt: Date.now(),
    };
    paintMemory();
  }

  function paintMemory(message = "") {
    const sizeButtons = [4, 6, 8].map((n) => {
      const button = el("button", {
        className: "mode-button memory-size-button",
        text: `${n} pasang`,
        attrs: {
          type: "button",
          "aria-pressed": String((state.memoryPairs ?? 6) === n),
        },
      });
      button.addEventListener("click", () => {
        state.memoryPairs = n;
        renderMemory();
      });
      return button;
    });

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
    cardButtons.forEach((button) =>
      button.addEventListener("click", () => chooseMemoryCard(button)),
    );

    const elapsedSeconds = Math.round((Date.now() - state.startedAt) / 1000);
    const newRound = el("button", {
      className: "button secondary",
      id: "new-memory",
      text: "Papan Baru",
      attrs: { type: "button" },
    });
    newRound.addEventListener("click", renderMemory);

    replaceChildren(
      panel,
      el(
        "div",
        { className: "scorebar" },
        pill("Memory Game"),
        pill(`${state.matched.size}/${state.memoryTotalPairs} cocok`),
        pill(`Waktu ${elapsedSeconds} dtk (opsional)`),
      ),
      el("div", { className: "action-row" }, sizeButtons),
      el("div", { className: "matching-board" }, cardButtons),
      el("p", { className: "feedback", text: message, attrs: { "aria-live": "polite" } }),
      el("div", { className: "action-row" }, newRound),
    );
  }

  function chooseMemoryCard(button) {
    const card = state.options[Number(button.dataset.index)];
    if (state.matched.has(card.id)) return;
    state.selected = [...state.selected, card].slice(-2);
    button.classList.add("selected");
    if (state.selected.length < 2) return;

    const [first, second] = state.selected;
    const isMatch = first.id === second.id && first.side !== second.side;
    if (isMatch) {
      state.matched.add(first.id);
      recordAnswer(true, "memory", first.id);
      track("answer_correct", { mode: "memory" });
      if (state.matched.size === state.memoryTotalPairs) {
        const seconds = Math.round((Date.now() - state.startedAt) / 1000);
        paintMemory(`Selesai. Semua ${state.memoryTotalPairs} pasangan cocok dalam ${seconds} detik.`);
      } else {
        paintMemory("Cocok.");
      }
    } else {
      recordAnswer(false, "memory", first.id);
      track("answer_incorrect", { mode: "memory" });
      paintMemory("Belum cocok. Coba pasangan lain.");
    }
    state.selected = [];
    updateProgressBadges();
  }

  function handleQuizKeyboard(event) {
    if (state.mode === "memory") return;
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
        dateKey: localDateKey(),
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
      if (modes[state.mode]?.kind !== "memory") startSession({ size: state.sessionSize });
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
  const lessons = await loadLessons();
  const themes = [...new Set([...lessons.published, ...lessons.drafts].map((l) => l.slug))];

  let filter = "all";
  let theme = "all";
  let shuffled = false;
  let deck = [];
  let index = 0;
  let flipped = false;

  function rebuildDeck() {
    const progressState = getProgress();
    const statsById = progressState.items;
    let source = items;
    if (theme !== "all") {
      source = source.filter((item) => (item.themes ?? []).includes(theme));
    }
    if (filter === "due") {
      source = getDueItems(source);
    } else if (filter === "saved") {
      const saved = new Set(getSavedIds());
      source = source.filter((item) => saved.has(item.id));
    } else if (filter === "difficult") {
      const difficult = new Set(getDifficultIds());
      source = source.filter((item) => difficult.has(item.id));
    }
    deck = shuffled ? shuffleWith(source) : [...source];
    index = 0;
    flipped = false;
  }

  function setFilter(nextFilter) {
    filter = nextFilter;
    rebuildDeck();
    renderToolbar();
    renderCard();
  }

  function currentItem() {
    return deck.length ? deck[index % deck.length] : null;
  }

  function renderToolbar() {
    const toolbar = $("#flashcard-toolbar");
    if (!toolbar) return;
    function select(id, label, options, value, onChange) {
      const wrapper = el("label", { className: "filter-field" }, label + " ");
      const selectEl = el("select", { className: "input filter-select", id });
      for (const [val, text] of options) selectEl.append(el("option", { text, attrs: { value: val } }));
      selectEl.value = value;
      selectEl.addEventListener("change", () => onChange(selectEl.value));
      wrapper.append(selectEl);
      return wrapper;
    }
    replaceChildren(
      toolbar,
      select(
        "fc-filter",
        "Tumpukan",
        [
          ["all", "Semua kata"],
          ["due", "Jatuh tempo review"],
          ["saved", "Disimpan"],
          ["difficult", "Sulit"],
        ],
        filter,
        setFilter,
      ),
      select(
        "fc-theme",
        "Tema",
        [["all", "Semua tema"], ...themes.map((t) => [t, t])],
        theme,
        (v) => {
          theme = v;
          rebuildDeck();
          renderCard();
        },
      ),
      (() => {
        const shuffleButton = el("button", {
          className: `button secondary${shuffled ? "" : ""}`,
          text: shuffled ? "Shuffle: aktif" : "Shuffle",
          attrs: { type: "button", "aria-pressed": String(shuffled) },
        });
        shuffleButton.addEventListener("click", () => {
          shuffled = !shuffled;
          rebuildDeck();
          renderToolbar();
          renderCard();
        });
        return shuffleButton;
      })(),
      el("span", { className: "pill", text: `${deck.length} kartu` }),
    );
  }

  function advance(step, action = null) {
    const item = currentItem();
    if (!item) return;
    if (action === "wrong") recordAnswer(false, "flashcards", item.id);
    else if (action === "correct") recordAnswer(true, "flashcards", item.id);
    else if (action === "difficult") setDifficult(item.id, true);
    index = (index + step + deck.length) % deck.length;
    flipped = false;
    renderCard();
    updateProgressBadges();
  }

  function handleKeydown(event) {
    if (event.target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) {
      return;
    }
    if (event.key === " ") {
      event.preventDefault();
      flipped = !flipped;
      renderCard();
    } else if (event.key === "1") advance(1, "wrong");
    else if (event.key === "2") advance(1, "difficult");
    else if (event.key === "3") advance(1, "correct");
    else if (event.key === "ArrowRight") advance(1);
    else if (event.key === "ArrowLeft") advance(-1);
  }

  function renderCard() {
    const cardRoot = $("#flashcard-card");
    if (!cardRoot) return;
    const item = currentItem();
    if (!item) {
      replaceChildren(
        cardRoot,
        el("p", {
          className: "feedback",
          text: "Tidak ada kartu untuk filter ini. Coba tumpukan lain atau tandai beberapa kata di dictionary.",
        }),
      );
      return;
    }
    const stats = getItemStats(item.id);
    void stats;

    const card = el(
      "button",
      { className: "flashcard", id: "flashcard", attrs: { type: "button" } },
      el("strong", { text: flipped ? item.indonesia : item.batak }),
      el("span", { text: `${flipped ? "Indonesia" : "Batak Toba"} - klik atau tekan spasi untuk balik` }),
    );
    card.addEventListener("click", () => {
      flipped = !flipped;
      renderCard();
    });

    const wrongButton = el("button", { className: "button secondary", text: "1 Salah", attrs: { type: "button" } });
    wrongButton.addEventListener("click", () => advance(1, "wrong"));
    const difficultButton = el("button", { className: "button secondary", text: "2 Sulit", attrs: { type: "button" } });
    difficultButton.addEventListener("click", () => advance(1, "difficult"));
    const correctButton = el("button", { className: "button", text: "3 Benar", attrs: { type: "button" } });
    correctButton.addEventListener("click", () => advance(1, "correct"));
    const prevButton = el("button", { className: "button secondary", text: "< Sebelumnya", attrs: { type: "button" } });
    prevButton.addEventListener("click", () => advance(-1));
    const nextButton = el("button", { className: "button secondary", text: "Berikutnya >", attrs: { type: "button" } });
    nextButton.addEventListener("click", () => advance(1));

    replaceChildren(
      cardRoot,
      el(
        "div",
        { className: "scorebar" },
        pill(`${index + 1}/${deck.length}`),
        pill(`Tahap ${stats.reviewStage ?? 0} - ${masteryLabel(stats)}`),
        stats.saved ? pill("disimpan") : null,
        stats.difficult ? pill("sulit") : null,
        pill(formatQuality(item), "", { "data-source-flag": item.sourceType || "corpus-derived" }),
      ),
      card,
      el(
        "div",
        { className: "action-row" },
        prevButton,
        wrongButton,
        difficultButton,
        correctButton,
        nextButton,
      ),
    );
  }

  rebuildDeck();

  replaceChildren(
    root,
    el("div", { className: "dictionary-filters", id: "flashcard-toolbar" }),
    el("div", { id: "flashcard-card" }),
    el("p", {
      className: "feedback",
      text: "Pintasan keyboard: spasi = balik kartu, 1 = salah, 2 = sulit, 3 = benar, panah kiri/kanan = navigasi.",
    }),
  );

  renderToolbar();
  renderCard();
  document.addEventListener("keydown", handleKeydown);
}

function localDateKey(atMs = Date.now()) {
  const date = new Date(atMs);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

async function initProgressPage() {
  const root = $("#progress-root");
  if (!root) return;
  const state = getProgress();

  const answered = state.answered ?? 0;
  const correct = state.correct ?? 0;
  const accuracy = answered === 0 ? "-" : `${Math.round((100 * correct) / answered)}%`;
  const streak = computeStreak((state.sessions ?? []).map((session) => session.dateKey));

  const stats = el(
    "div",
    { className: "scorebar", attrs: { role: "list" } },
    pill(`Total jawaban ${answered}`, "", { role: "listitem" }),
    pill(`Benar ${correct}`, "", { role: "listitem" }),
    pill(`Akurasi ${accuracy}`, "", { role: "listitem" }),
    pill(`Streak ${streak} hari`, "", { role: "listitem" }),
    pill(`Diketahui ${getBucketIds("known").length}`, "", { role: "listitem" }),
    pill(`Perlu ulang ${getBucketIds("review").length}`, "", { role: "listitem" }),
    pill(`Disimpan ${getSavedIds().length}`, "", { role: "listitem" }),
    pill(`Sulit ${getDifficultIds().length}`, "", { role: "listitem" }),
  );

  const statusLine = el("p", { className: "feedback", attrs: { role: "status", "aria-live": "polite" } });

  const exportButton = el("button", {
    className: "button",
    text: "Ekspor progress (JSON)",
    attrs: { type: "button" },
  });
  exportButton.addEventListener("click", () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = el("a", {
      attrs: { href: url, download: `batak-toba-progress-${localDateKey()}.json` },
    });
    link.click();
    URL.revokeObjectURL(url);
    statusLine.textContent = "Progress diekspor sebagai file JSON.";
    track("progress_exported");
  });

  const fileInput = el("input", {
    attrs: { type: "file", accept: "application/json,.json", id: "import-file" },
  });
  const importButton = el("button", {
    className: "button secondary",
    text: "Impor progress",
    attrs: { type: "button" },
  });
  importButton.addEventListener("click", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      statusLine.textContent = "Pilih file JSON terlebih dahulu.";
      return;
    }
    if (file.size > 512 * 1024) {
      statusLine.textContent = "File terlalu besar (maksimal 512 KB).";
      return;
    }
    const text = await file.text();
    const result = importProgress(text);
    statusLine.textContent = result.ok
      ? "Progress berhasil diimpor."
      : `Impor gagal: ${result.reason === "invalid-json" ? "file bukan JSON valid" : "schema tidak didukung"}.`;
  });

  let resetArmed = false;
  const resetButton = el("button", {
    className: "button secondary",
    text: "Reset progress",
    attrs: { type: "button" },
  });
  resetButton.addEventListener("click", () => {
    if (!resetArmed) {
      resetArmed = true;
      resetButton.textContent = "Yakin? Klik sekali lagi untuk hapus";
      resetButton.classList.add("wrong");
      setTimeout(() => {
        resetArmed = false;
        resetButton.textContent = "Reset progress";
        resetButton.classList.remove("wrong");
      }, 6000);
      return;
    }
    resetProgress();
    statusLine.textContent = "Progress dihapus.";
    initProgressPage();
  });

  function buildConsentRow(idSuffix, title, description, checked, onChange) {
    const row = el("div", { className: "consent-row" });
    const checkboxId = `consent-${idSuffix}`;
    const checkbox = el("input", {
      attrs: { type: "checkbox", role: "switch", id: checkboxId },
    });
    checkbox.checked = Boolean(checked);
    checkbox.addEventListener("change", () => onChange(checkbox.checked));
    row.append(
      checkbox,
      el(
        "div",
        {},
        el("label", { attrs: { for: checkboxId } }, el("strong", { text: title })),
        el("p", { text: description }),
      ),
    );
    return row;
  }

  const privacySection = (() => {
    const section = el("section", { className: "section band" });
    const inner = el("div", { className: "section-inner" });
    inner.append(
      el("h2", { text: "Preferensi privasi" }),
      el("p", {
        className: "lead",
        text: "Analytics dan iklan nonaktif secara default. Preferensi tersimpan lokal di perangkat ini dan bisa diubah kapan saja. Menolak tidak memengaruhi fungsi situs apa pun.",
      }),
      buildConsentRow(
        "analytics",
        "Analytics produk",
        "Event anonim tanpa kata yang dicari, nama, email, atau isi progress. Tidak ada yang dikirim sebelum Anda setuju.",
        hasAnalyticsConsent(),
        (value) => {
          if (value) grantAnalyticsConsent();
          else revokeAnalyticsConsent();
        },
      ),
      buildConsentRow(
        "ads",
        "Iklan (AdSense)",
        "Iklan belum aktif di situs ini. Persetujuan baru berlaku bila iklan diaktifkan dengan konfigurasi resmi dan Publisher ID valid.",
        readAdsConsent(),
        (value) => {
          if (value) grantAdsConsent();
          else revokeAdsConsent();
        },
      ),
    );
    section.append(inner);
    return section;
  })();

  replaceChildren(
    root,
    stats,
    el(
      "div",
      { className: "action-row" },
      exportButton,
      fileInput,
      importButton,
      resetButton,
    ),
    statusLine,
    privacySection,
    el("p", {
      className: "feedback",
      text: "Catatan: data tidak tersinkron otomatis antar perangkat. Ekspor secara berkala bila ingin menyimpannya.",
    }),
  );
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
  if (page === "progres") await initProgressPage();
}

function registerServiceWorker() {
  if (!SITE_CONFIG.features.pwa) return;
  if (!("serviceWorker" in navigator)) return;
  // Resolve relative to this module so the path is correct on every page depth.
  const swUrl = new URL("../../sw.js", import.meta.url);
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateBanner();
          }
        });
      });
    })
    .catch(() => {
      /* offline support is progressive enhancement; never block the app */
    });
  window.addEventListener("online", () => setOfflineBanner(false));
  window.addEventListener("offline", () => setOfflineBanner(true));
  if (navigator.onLine === false) setOfflineBanner(true);
}

function bannerNode(text, actionLabel, onAction) {
  const banner = el("div", { className: "app-banner" });
  const label = el("span", { text });
  const button = el("button", { className: "button", text: actionLabel, attrs: { type: "button" } });
  button.addEventListener("click", onAction);
  banner.append(label, button);
  document.body.append(banner);
  return banner;
}

let updateBannerShown = false;
function showUpdateBanner() {
  if (updateBannerShown) return;
  updateBannerShown = true;
  const banner = bannerNode("Versi baru tersedia.", "Muat ulang", () => window.location.reload());
  setTimeout(() => banner.remove(), 30000);
}

function setOfflineBanner(offline) {
  const existing = $(".app-banner.offline-banner");
  if (offline && !existing) {
    const banner = el("div", {
      className: "app-banner offline-banner",
      text: "Anda sedang offline. Halaman yang pernah dibuka tetap tersedia.",
    });
    document.body.append(banner);
  } else if (!offline && existing) {
    existing.remove();
  }
}

main().catch((error) => {
  import("./utils/dom.js").then(({ showError }) => {
    showError($("main"), error && error.message ? error.message : "Kesalahan tidak diketahui.");
  });
});
