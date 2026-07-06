import { loadLearningItems, loadSentences, loadWordPairs } from "./data.js";
import { getProgress, markFlashcard, recordAnswer, saveProgress } from "./progress.js";

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
    statNode.innerHTML = `
      <div class="stat"><strong>${metadata.counts.wordPairs}</strong><span>pasangan kata</span></div>
      <div class="stat"><strong>${metadata.counts.phrasePairs}</strong><span>frasa pendek</span></div>
      <div class="stat"><strong>5</strong><span>mode latihan</span></div>
      <div class="stat"><strong>0</strong><span>login dibutuhkan</span></div>
    `;
  } catch {
    statNode.innerHTML = "<p>Statistik data belum bisa dimuat.</p>";
  }
}

function formatQuality(item) {
  if (item.source_flag === "beta-unreviewed") {
    return "Beta - sumber corpus keagamaan, belum direview";
  }
  if (item.source_flag === "reviewed") {
    return "reviewed";
  }
  if (item.source_flag === "corpus-derived") {
    return item.quality || "corpus-derived";
  }
  return item.quality || "corpus-derived";
}

async function initDictionary() {
  const input = $("#dictionary-search");
  const results = $("#dictionary-results");
  if (!input || !results) return;
  const { items } = await loadLearningItems();
  const searchable = items.filter((item) => item.type !== "sentence");

  function render() {
    const query = input.value.trim().toLowerCase();
    const matches = (query
      ? searchable.filter((item) =>
          `${item.batak} ${item.indonesia}`.toLowerCase().includes(query),
        )
      : searchable
    ).slice(0, 36);

    if (!matches.length) {
      results.innerHTML = '<div class="card">Belum ada hasil untuk pencarian itu.</div>';
      return;
    }

    results.innerHTML = matches
      .map(
        (item) => `
          <article class="result-row">
            <strong>${item.batak}</strong>
            <span>${item.indonesia}</span>
            <small class="pill" data-source-flag="${item.source_flag || "corpus-derived"}">${formatQuality(item)}</small>
          </article>
        `,
      )
      .join("");
  }

  input.addEventListener("input", render);
  render();
}

async function initGames() {
  const panel = $("#game-panel");
  if (!panel) return;
  const wordData = await loadWordPairs();
  const sentenceData = await loadSentences();
  const wordPool = wordData.items;
  const sentencePool = sentenceData.items;
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
  };

  function setMode(mode) {
    state = { ...state, mode, answered: 0, correct: 0, locked: false, matched: new Set(), selected: [] };
    saveProgress({ lastMode: mode });
    $$(".mode-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
    if (mode === "matching") renderMatching();
    else nextQuestion();
  }

  function makeQuestion() {
    const config = modes[state.mode];
    const current = sample(config.pool, 1)[0];
    const wrong = sample(
      config.pool.filter((item) => item.id !== current.id && item[config.to] !== current[config.to]),
      3,
    );
    return {
      current,
      options: shuffle([current, ...wrong]),
    };
  }

  function renderQuiz() {
    const config = modes[state.mode];
    const { current, options } = state;
    panel.innerHTML = `
      <div class="scorebar">
        <span class="pill">${config.label}</span>
        <span class="pill">Ronde ${state.answered + 1}</span>
        <span class="pill">Skor ${state.correct}/${state.answered}</span>
      </div>
      <div class="prompt">
        <span class="prompt-kicker">${config.prompt}</span>
        <strong class="prompt-text">${current[config.from]}</strong>
      </div>
      <div class="options">
        ${options
          .map(
            (item) => `
              <button class="option" type="button" data-answer="${item.id}">
                ${item[config.to]}
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="feedback" aria-live="polite" id="feedback"></p>
      <div class="action-row">
        <button class="button" type="button" id="next-question" disabled>Next</button>
        <span class="pill" data-source-flag="${current.source_flag || "corpus-derived"}">${formatQuality(current)}</span>
      </div>
    `;

    $$(".option", panel).forEach((button) => {
      button.addEventListener("click", () => answerQuestion(button));
    });
    $("#next-question").addEventListener("click", nextQuestion);
  }

  function answerQuestion(button) {
    if (state.locked) return;
    const config = modes[state.mode];
    const isCorrect = button.dataset.answer === state.current.id;
    state.locked = true;
    state.answered += 1;
    state.correct += isCorrect ? 1 : 0;
    recordAnswer(isCorrect, state.mode);
    $$(".option", panel).forEach((option) => {
      option.disabled = true;
      if (option.dataset.answer === state.current.id) option.classList.add("correct");
    });
    if (!isCorrect) button.classList.add("wrong");
    $("#feedback").textContent = isCorrect
      ? "Benar."
      : `Belum tepat. Jawaban yang dicari: ${state.current[config.to]}.`;
    $("#next-question").disabled = false;
    updateProgressBadges();
  }

  function nextQuestion() {
    const question = makeQuestion();
    state = { ...state, ...question, locked: false };
    renderQuiz();
  }

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
    panel.innerHTML = `
      <div class="scorebar">
        <span class="pill">Matching Pairs</span>
        <span class="pill">${state.matched.size}/5 cocok</span>
      </div>
      <div class="matching-board">
        ${state.options
          .map(
            (card, index) => `
              <button class="match-card ${state.matched.has(card.id) ? "matched" : ""}" type="button"
                data-index="${index}" ${state.matched.has(card.id) ? "disabled" : ""}>
                ${card.text}
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="feedback" aria-live="polite">${message}</p>
      <div class="action-row">
        <button class="button secondary" type="button" id="new-match">Ronde Baru</button>
      </div>
    `;
    $$(".match-card", panel).forEach((button) => button.addEventListener("click", () => chooseMatch(button)));
    $("#new-match").addEventListener("click", renderMatching);
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
      recordAnswer(true, "matching");
      if (state.matched.size === 5) {
        const seconds = Math.round((Date.now() - state.startedAt) / 1000);
        paintMatching(`Selesai. Semua pasangan cocok dalam ${seconds} detik.`);
      } else {
        paintMatching("Cocok.");
      }
    } else {
      recordAnswer(false, "matching");
      paintMatching("Belum cocok. Coba pasangan lain.");
    }
    state.selected = [];
    updateProgressBadges();
  }

  $$(".mode-button").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
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
    root.innerHTML = `
      <div class="scorebar">
        <span class="pill">${index + 1}/${items.length}</span>
        <span class="pill">Diketahui <span data-progress-known>${getProgress().known.length}</span></span>
        <span class="pill" data-source-flag="${item.source_flag || "corpus-derived"}">${formatQuality(item)}</span>
      </div>
      <button class="flashcard" type="button" id="flashcard">
        <strong>${flipped ? item.indonesia : item.batak}</strong>
        <span>${flipped ? "Indonesia" : "Batak Toba"} - klik untuk balik</span>
      </button>
      <div class="action-row">
        <button class="button secondary" type="button" id="prev-card">Previous</button>
        <button class="button" type="button" id="known-card">Saya tahu</button>
        <button class="button secondary" type="button" id="review-card">Ulangi lagi</button>
        <button class="button secondary" type="button" id="next-card">Next</button>
      </div>
    `;
    $("#flashcard").addEventListener("click", () => {
      flipped = !flipped;
      render();
    });
    $("#prev-card").addEventListener("click", () => {
      index = Math.max(0, index - 1);
      flipped = false;
      render();
    });
    $("#next-card").addEventListener("click", () => {
      index = (index + 1) % items.length;
      flipped = false;
      render();
    });
    $("#known-card").addEventListener("click", () => {
      markFlashcard(item.id, "known");
      index = (index + 1) % items.length;
      flipped = false;
      render();
    });
    $("#review-card").addEventListener("click", () => {
      markFlashcard(item.id, "review");
      index = (index + 1) % items.length;
      flipped = false;
      render();
    });
  }

  render();
}

async function main() {
  setActiveNav();
  updateProgressBadges();
  const page = document.body.dataset.page;
  if (page === "home") await initHome();
  if (page === "dictionary") await initDictionary();
  if (page === "games") await initGames();
  if (page === "flashcards") await initFlashcards();
}

main().catch((error) => {
  const target = $("#app-error") || $("main");
  if (target) {
    target.insertAdjacentHTML("afterbegin", `<div class="card">Data belum bisa dimuat: ${error.message}</div>`);
  }
});
