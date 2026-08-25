import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, dirname, normalize } from "node:path";

const args = process.argv.slice(2);
const useDist = !args.includes("--source");
const port = Number(args.find((arg) => /^\d+$/.test(arg)) ?? 4179);
const rootDir = join(fileURLToPath(new URL("../", import.meta.url)), useDist ? "dist" : "");

if (!existsSync(rootDir)) {
  console.error(`Server root not found: ${rootDir} (run npm run build first)`);
  process.exit(1);
}

function parseHeaderRules() {
  const rules = [];
  let current = null;
  for (const rawLine of readFileSync(join(rootDir, "_headers"), "utf8").split("\n")) {
    if (!rawLine.trim()) continue;
    if (rawLine.startsWith(" ") || rawLine.startsWith("\t")) {
      if (current && rules.length) rules[rules.length - 1][1].push(rawLine.trim());
    } else {
      current = rawLine.trim();
      rules.push([current, []]);
    }
  }
  return rules;
}

const HEADER_RULES = parseHeaderRules();

function headersFor(urlPath) {
  const out = {};
  for (const [pattern, headerLines] of HEADER_RULES) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/, ".*");
    const regex = new RegExp(`^${escaped}$`);
    if (!regex.test(urlPath)) continue;
    for (const line of headerLines) {
      const idx = line.indexOf(": ");
      if (idx > 0) out[line.slice(0, idx)] = line.slice(idx + 2);
    }
  }
  return out;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

let server;
server = createServer((req, res) => {
  let body;
  let status = 200;
  let extraHeaders = {};
  let target;
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath.endsWith("/") || urlPath === "") urlPath += "index.html";
    urlPath = normalize(urlPath).replace(/\\/g, "/").replace(/^\/+/, "/");
    target = join(rootDir, urlPath);
    if (!target.startsWith(rootDir)) status = 403;
    else if (!existsSync(target) || statSync(target).isDirectory()) {
      target = join(rootDir, "index.html");
    }
    const type = MIME[extname(target)] ?? "application/octet-stream";
    extraHeaders = { "Content-Type": type, ...headersFor(urlPath) };
    body = readFileSync(target);
  } catch (error) {
    status = 500;
    body = Buffer.from(String(error && error.message ? error.message : "error"));
    extraHeaders = { "Content-Type": "text/plain" };
    console.error("SERVE FAIL", req.url, String(error && error.message));
  }
  res.writeHead(status, extraHeaders);
  res.end(body);
});

server.listen(port, () => {
  console.log(`e2e-server ready on http://127.0.0.1:${port} (${useDist ? "dist" : "source"})`);
});
