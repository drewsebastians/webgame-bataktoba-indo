/**
 * Safe DOM construction helpers.
 * Corpus data is untrusted: it must only ever enter the page via
 * textContent / attribute assignment, never through HTML template strings.
 */

export function el(tag, options = {}, ...children) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.id) node.id = options.id;
  if (options.text !== undefined) node.textContent = String(options.text);
  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      if (value === undefined || value === null || value === false) continue;
      node.setAttribute(name, value === true ? "" : String(value));
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined) continue;
    node.append(child);
  }
  return node;
}

export function clearChildren(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function replaceChildren(node, ...children) {
  clearChildren(node);
  node.append(...children.flat().filter((child) => child !== null && child !== undefined));
}

/**
 * Safe error surface: message text is never interpreted as HTML.
 */
export function showError(container, message) {
  if (!container) return;
  const card = el("div", { className: "card app-error", attrs: { role: "alert" } });
  card.append(el("strong", { text: "Data belum bisa dimuat." }));
  if (message) card.append(el("span", { text: ` ${message}` }));
  container.prepend(card);
}
