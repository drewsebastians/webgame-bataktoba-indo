import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** Adds the Progres nav link after Flashcards on every page. */
const root = join(fileURLToPath(new URL("../", import.meta.url)));

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === ".git" || name === "node_modules" || name === "progres") continue;
      walk(path);
    } else if (name === "index.html") {
      processPage(path);
    }
  }
}

function processPage(path) {
  let html = readFileSync(path, "utf8");
  if (html.includes('data-nav="progres"')) return;
  const updated = html.replace(
    /(<a data-nav="flashcards" href=")((?:\.\.\/)?)(flashcards\/">Flashcards<\/a>)/,
    `$1$2$3\n          <a data-nav="progres" href="$2progres/">Progres</a>`,
  );
  if (updated !== html) {
    writeFileSync(path, updated, "utf8");
    console.log(`nav progres added: ${path.replace(root, "")}`);
  } else {
    console.warn(`PATTERN MISS: ${path.replace(root, "")}`);
  }
}

walk(root);
