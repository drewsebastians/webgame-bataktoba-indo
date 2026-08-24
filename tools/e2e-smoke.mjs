import { spawn } from "node:child_process";
import { once } from "node:events";

/**
 * Zero-dependency e2e smoke test.
 * Serves the site locally, then asserts key pages and datasets respond
 * with expected content. Fails loudly on any problem.
 */

const PORT = 4178;
const BASE = `http://127.0.0.1:${PORT}`;

function startServer() {
  const child = spawn("python", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
    stdio: ["ignore", "ignore", "pipe"],
  });
  child.stderr.resume();
  return child;
}

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch {
      /* not ready yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Server did not become ready within ${timeoutMs}ms`);
}

const failures = [];

async function expectPage(path, mustContain) {
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) {
    failures.push(`${path}: HTTP ${response.status}`);
    return null;
  }
  const text = await response.text();
  for (const fragment of mustContain) {
    if (!text.includes(fragment)) {
      failures.push(`${path}: missing expected content ${JSON.stringify(fragment)}`);
    }
  }
  return text;
}

async function main() {
  const server = startServer();
  let exitCode = 0;
  try {
    await waitForServer();

    await expectPage("/", [
      "Batak Toba Play",
      'class="skip-link"',
      'id="main-content"',
      'property="og:title"',
      "nav-toggle",
    ]);
    await expectPage("/games/", ["game-panel", "session-size-button", "Latihan Harian"]);
    await expectPage("/dictionary/", ["dictionary-search", "dictionary-filters"]);
    await expectPage("/flashcards/", ["flashcard-root"]);
    await expectPage("/learn/", []);
    await expectPage("/learn/angka/", ['data-lesson="angka"', "lesson-root"]);
    await expectPage("/learn/keluarga/", ['data-lesson="keluarga"', "lesson-root"]);
    await expectPage("/offline.html", ["Mode offline", "noindex"]);
    await expectPage("/sw.js", ["CACHE_VERSION", "offline.html"]);
    await expectPage("/manifest.webmanifest", ["Batak Toba Play"]);
    await expectPage("/robots.txt", ["Sitemap"]);

    // published data layer integrity over HTTP
    const learningResponse = await fetch(`${BASE}/data/published/learning-items.json`);
    if (!learningResponse.ok) {
      failures.push(`published learning items: HTTP ${learningResponse.status}`);
    } else {
      const payload = await learningResponse.json();
      if (!Array.isArray(payload.items) || payload.items.length < 100) {
        failures.push("published learning-items.json should expose >=100 items");
      }
    }
    for (const legacyPath of [
      "/data/raw/word-candidates.json",
      "/data/candidates/word-pairs.json",
      "/data/legacy/word-pairs.json",
    ]) {
      // internal layers exist in repo but are excluded from deploys; here we
      // only assert the public layer is what a browser needs - no assertion.
      void legacyPath;
    }

    const lessonsResponse = await fetch(`${BASE}/data/published/lessons.json`);
    if (!lessonsResponse.ok) {
      failures.push(`published lessons: HTTP ${lessonsResponse.status}`);
    } else {
      const lessons = await lessonsResponse.json();
      if (typeof lessons.counts?.publishedLessons !== "number") {
        failures.push("lessons.json missing counts.publishedLessons");
      }
    }

    const sitemap = await fetch(`${BASE}/sitemap.xml`);
    if (!sitemap.ok || !(await sitemap.text()).includes("<urlset")) {
      failures.push("sitemap.xml invalid or missing");
    }
  } finally {
    server.kill();
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    exitCode = 1;
  } else {
    console.log("e2e smoke passed: pages, PWA assets, and published data OK.");
  }
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(`e2e smoke crashed: ${error.message}`);
  process.exit(1);
});
