import { readFileSync, writeFileSync } from "node:fs";

const pages = [
  ["learn/angka/index.html", "angka"],
  ["learn/keluarga/index.html", "keluarga"],
  ["learn/sapaan/index.html", "sapaan"],
  ["learn/makanan/index.html", "makanan"],
];

const container =
  '<section class="tool-shell" style="margin-bottom:2rem"><div id="lesson-root"><p class="feedback">Memuat materi...</p></div></section>';

for (const [file, theme] of pages) {
  let html = readFileSync(file, "utf8");
  if (!html.includes('data-page="learn-topic"')) {
    html = html.replace(
      '<body data-page="learn">',
      `<body data-page="learn-topic" data-lesson="${theme}">`,
    );
    // insert the lesson container right after the page-heading section
    html = html.replace(
      /(<\/section>)(\s*<p>)/,
      `$1\n      ${container}\n      $2`,
    );
    writeFileSync(file, html, "utf8");
    console.log(`updated ${file} -> ${theme}`);
  } else {
    console.log(`skipped ${file}`);
  }
}
