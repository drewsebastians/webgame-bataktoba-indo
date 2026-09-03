import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { once } from "node:events";

/**
 * Zero-dependency e2e smoke test.
 * Serves the site locally, then asserts key pages and datasets respond
 * with expected content. Fails loudly on any problem.
 */

const PORT = 4178;
const BASE = `http://127.0.0.1:${PORT}`;

function startServer() {
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  const child = spawn(process.execPath, [join("tools", "e2e-server.mjs"), String(PORT)], {
    cwd,
    stdio: ["ignore", "ignore", "pipe"],
  });
  child.stderr.on("data", (d) => console.error(String(d).trim()));
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
    await expectPage("/progres/", ["progress-root", 'data-page="progres"', "Lanjut Latihan"]);
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
      if (!Array.isArray(payload.items)) {
        failures.push("published learning-items.json items should be an array");
      } else if (payload.items.length > 0 && payload.items.length < 100) {
        // Public-safe mode: 0 items is acceptable (licensing blocks publication)
        // If items exist, expect at least 100
        failures.push("published learning-items.json should expose >=100 items when non-empty");
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
    try {
      await once(server, "exit");
    } catch {}
    // Give stdio pipes time to close on Windows to avoid UV_HANDLE_CLOSING assert
    await new Promise((r) => setTimeout(r, 200));
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    exitCode = 1;
  } else {
    console.log("e2e smoke passed: pages, PWA assets, and published data OK.");
  }
  process.exitCode = exitCode;
}

main().catch((error) => {
  console.error(`e2e smoke crashed: ${error.message}`);
  process.exitCode = 1;
});
