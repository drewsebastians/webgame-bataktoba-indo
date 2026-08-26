/**
 * Correction workflow helpers.
 * Builds prefilled GitHub issue URLs with item data; all values are
 * encoded via URLSearchParams so corpus text can never break the URL.
 */

import { SITE_CONFIG } from "../config.4b18e606.js";

export function buildCorrectionUrl({ itemId, batak, indonesia, pagePath, category = "lainnya" }) {
  const params = new URLSearchParams();
  params.set("title", `Koreksi item ${itemId}`);
  params.set(
    "body",
    [
      "**Koreksi materi**",
      "",
      `- Item ID: ${itemId}`,
      `- Batak Toba: ${batak}`,
      `- Indonesia: ${indonesia}`,
      `- Halaman: ${pagePath}`,
      `- Kategori: ${category}`,
      "",
      "**Saran perbaikan:**",
      "",
      "(jelaskan di sini)",
      "",
      "_Dibuat otomatis dari halaman website._",
    ].join("\n"),
  );
  params.set("labels", "correction");
  return `${SITE_CONFIG.repositoryIssuesUrl}?${params.toString()}`;
}
