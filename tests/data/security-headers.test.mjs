import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  "artifacts",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);

function sourceHtmlFiles(directory = root) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) files.push(...sourceHtmlFiles(join(directory, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(join(directory, entry.name));
    }
  }
  return files.sort();
}

function headerValue(headers, name) {
  const prefix = name.toLowerCase() + ":";
  const line = headers.split(/\r?\n/).find((row) => row.trimStart().toLowerCase().startsWith(prefix));
  assert.ok(line, `missing ${name} header`);
  return line.slice(line.indexOf(":") + 1).trim();
}

function directiveValue(csp, name) {
  const directive = csp.split(";").map((value) => value.trim()).find((value) => value.split(/\s+/, 1)[0] === name);
  assert.ok(directive, `missing CSP directive ${name}`);
  return directive.split(/\s+/).slice(1);
}

test("source and built CSP disallow inline executable scripts", () => {
  const sourceHeaders = readFileSync(join(root, "_headers"), "utf8");
  const builtHeaders = readFileSync(join(root, "dist/_headers"), "utf8");
  const sourceCsp = headerValue(sourceHeaders, "Content-Security-Policy");
  const builtCsp = headerValue(builtHeaders, "Content-Security-Policy");

  assert.equal(builtCsp, sourceCsp, "built output must preserve the source CSP");
  assert.deepEqual(directiveValue(sourceCsp, "default-src"), ["'self'"]);
  const scriptSources = directiveValue(sourceCsp, "script-src");
  assert.deepEqual(scriptSources, ["'self'"]);
  assert.equal(scriptSources.includes("'unsafe-inline'"), false);
  assert.equal(scriptSources.includes("'unsafe-eval'"), false);
  assert.deepEqual(directiveValue(sourceCsp, "style-src"), ["'self'"]);

  for (const [name, expected] of [
    ["object-src", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    ["frame-ancestors", ["'none'"]],
  ]) {
    assert.deepEqual(directiveValue(sourceCsp, name), expected);
  }
  assert.equal(headerValue(sourceHeaders, "X-Frame-Options"), "DENY");
});

test("source HTML has no inline executable scripts, event handlers, or javascript URLs", () => {
  const files = sourceHtmlFiles();
  assert.ok(files.length > 0, "expected to discover source HTML routes");

  const violations = [];
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    const path = relative(root, file).split(sep).join("/");

    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      const attributes = match[1];
      const body = match[2].trim();
      const type = attributes.match(/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const mime = (type?.[1] ?? type?.[2] ?? type?.[3] ?? "").split(";")[0].trim().toLowerCase();
      const isExternal = /\bsrc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i.test(attributes);
      if (body && !isExternal && mime !== "application/ld+json") {
        violations.push(`${path}: inline executable script`);
      }
    }

    const markup = html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, "$1</script>");
    for (const tagMatch of markup.matchAll(/<[a-z][^>]*>/gi)) {
      const tag = tagMatch[0];
      if (/\s+on[a-z][a-z0-9_-]*\s*=/i.test(tag)) {
        violations.push(`${path}: inline event handler`);
      }
      if (/\b(?:href|src)\s*=\s*(?:(["'])\s*javascript\s*:|javascript\s*:)/i.test(tag)) {
        violations.push(`${path}: javascript URL`);
      }
    }
  }
  assert.deepEqual(violations, [], violations.join("\n"));
});


test("source HTML and JavaScript do not require inline styles", () => {
  const violations = [];
  for (const file of sourceHtmlFiles()) {
    const html = readFileSync(file, "utf8");
    const path = relative(root, file).split(sep).join("/");
    if (/<style\b/i.test(html)) violations.push(path + ": inline style block");
    const markup = html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, "$1</script>");
    for (const match of markup.matchAll(/<[a-z][^>]*>/gi)) {
      if (/\sstyle\s*=/i.test(match[0])) violations.push(path + ": inline style attribute");
    }
  }

  const jsRoot = join(root, "assets/js");
  const jsFiles = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && entry.name.endsWith(".js")) jsFiles.push(file);
    }
  }
  walk(jsRoot);
  for (const file of jsFiles) {
    const source = readFileSync(file, "utf8");
    const path = relative(root, file).split(sep).join("/");
    if (/\.\s*style\s*(?:\.|\[|=)|\bsetAttribute\s*\(\s*["']style["']/i.test(source)) {
      violations.push(path + ": dynamic inline style mutation");
    }
  }
  assert.deepEqual(violations, [], violations.join("\n"));
});
