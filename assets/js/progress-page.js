import { SITE_CONFIG } from "./config.js";
import {
  exportProgress,
  getBucketIds,
  getDifficultIds,
  getProgress,
  getSavedIds,
  importProgress,
  initProgress,
  resetProgress,
} from "./progress.js";
import { el, replaceChildren, showError } from "./utils/dom.js";
import { computeStreak } from "./game/session.js";
import { track, hasAnalyticsConsent, grantAnalyticsConsent, revokeAnalyticsConsent } from "./analytics.js";
import { sweepPlaceholders, readAdsConsent, grantAdsConsent, revokeAdsConsent } from "./ads.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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
  const existing = $(".app-banner.offline-banner");
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

function localDateKey(atMs = Date.now()) {
  const date = new Date(atMs);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

async function initProgressPage(notice = '') {
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
    attrs: {
      type: "file",
      accept: "application/json,.json",
      id: "import-file",
      "aria-label": "Impor file progress JSON",
    },
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
    if (result.ok) {
      initProgressPage("Progress berhasil diimpor.");
      return;
    }
    statusLine.textContent = `Impor gagal: ${
      result.reason === "invalid-json" ? "file bukan JSON valid" : "schema tidak didukung"
    }.`;
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
    initProgressPage("Progress dihapus.");
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

  if (notice) statusLine.textContent = notice;

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
  await initProgressPage();
}

main().catch((error) => showError($("main"), error && error.message ? error.message : "Kesalahan tidak diketahui."));
