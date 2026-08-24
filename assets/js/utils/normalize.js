/**
 * Shared text normalization utilities.
 * Pure functions only: no DOM, no storage, safe to unit-test in Node.
 */

/**
 * Normalize a visible label for equality comparisons (question options,
 * duplicate detection): Unicode NFC, collapsed whitespace, trimmed, lowercased.
 */
export function normalizeLabel(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Normalize free-text search input the same way, without lowercasing intent
 * loss for dictionary display (search is case-insensitive anyway).
 */
export function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Meaningful tokens of a phrase after normalization.
 * Used by the data pipeline contract: a genuine phrase has >= 2 tokens.
 */
export function tokenizeLabel(value) {
  const normalized = normalizeLabel(value);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}
