// Focused entrypoint for flashcards keeps unrelated game and lesson code off this route.
import { loadWordPairs, loadTopics } from "./data.cfd4b3c2.js";
import { SITE_CONFIG } from "./config.6316db9b.js";
import {
  getBucketIds,
  getDifficultIds,
  getDueItems,
  getItemStats,
  getProgress,
  getSavedIds,
  initProgress,
  recordAnswer,
  setDifficult,
} from "./progress.fa26cbf8.js";
import { el, replaceChildren, showError } from "./utils/dom.742eac8c.js";
import { shuffleWith } from "./game/question-engine.5494a83a.js";
import { masteryLabel } from "./game/session.30f0491c.js";
import { track } from "./analytics.ab842beb.js";
import { sweepPlaceholders } from "./ads.07252d43.js";

const flashcardQuery = (selector, root = document) => root.querySelector(selector);
const flashcardQueryAll = (selector, root = document) => [...root.querySelectorAll(selector)];

function pill(text, extraClass = "", attrs = {}) {
  return el("span", { className: `pill ${extraClass}`.trim(), text, attrs });
}

function initNavToggle() {
  const toggle = flashcardQuery(".nav-toggle");
  const links = flashcardQuery("#nav-links-list");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  flashcardQueryAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
  });
}

function updateProgressBadges() {
  const progress = getProgress();
  flashcardQueryAll("[data-progress-answered]").forEach((node) => (node.textContent = progress.answered));
  flashcardQueryAll("[data-progress-correct]").forEach((node) => (node.textContent = progress.correct));
  flashcardQueryAll("[data-progress-known]").forEach((node) => (node.textContent = getBucketIds("known").length));
}

function formatQuality(item) {
  if (item.reviewStatus === "beta-unreviewed") {
    return "Beta - sumber corpus keagamaan, belum direview";
  }
  return item.quality || item.reviewStatus || item.sourceType || "corpus-derived";
}

async function initFlashcards() {
  const root = flashcardQuery("#flashcard-root");
  if (!root) return;
  const { items } = await loadWordPairs();
  if (!items.length) {
    root.setAttribute("aria-busy", "false");
    return;
  }
  const topics = await loadTopics();
  const themes = [...new Set(topics.topics.map((t) => t.slug))];

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
    const toolbar = flashcardQuery("#flashcard-toolbar");
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
    const cardRoot = flashcardQuery("#flashcard-card");
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
  root.setAttribute("aria-busy", "false");
  document.addEventListener("keydown", handleKeydown);
}

function showLastModified() {
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

let offlineTracked = false;
function setOfflineBanner(offline) {
  if (offline && !offlineTracked) {
    offlineTracked = true;
    track("offline_session");
  }
  const existing = flashcardQuery(".app-banner.offline-banner");
  if (offline && !existing) {
    document.body.append(
      el("div", {
        className: "app-banner offline-banner",
        text: "Anda sedang offline. Halaman yang pernah dibuka tetap tersedia.",
      }),
    );
  } else if (!offline && existing) {
    existing.remove();
  }
}

function registerServiceWorker() {
  if (!SITE_CONFIG.features.pwa || !("serviceWorker" in navigator)) return;
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

async function main() {
  await initProgress();
  showLastModified();
  initNavToggle();
  setActiveNav();
  updateProgressBadges();
  registerServiceWorker();
  sweepPlaceholders();
  await initFlashcards();
}

main().catch((error) => showError(flashcardQuery("main"), error && error.message ? error.message : "Kesalahan tidak diketahui."));
