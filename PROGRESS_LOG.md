# Progress Log — Program Menuju Ultimate Blueprint

Log eksekusi berurutan sesuai `02_GAP_REPOSITORY_DAN_HOMEWORK_CODEX.md`.
Update dokumen ini setiap kali satu task selesai.

---

## Status per 24 Agustus 2026 (OpenCode session 1)

### Task 1 — Baseline audit dan test harness: SELESAI

- `CURRENT_STATE_AUDIT.md` dibuat (routes, data flow, baseline counts, temuan).
- Test harness zero-dependency dengan `node:test`: `tests/unit/`, `tests/data/`.
- Script baru: `npm test`, `npm run verify` (check + test).
- Checker diperluas: duplikat ID, judul halaman unik, canonical/description/lang,
  sitemap coverage, metadata konsisten.
- Baseline terukur saat audit: 456 items; **7 duplikat label batak + 6 duplikat
  label indonesia** di word pool; **120/120 "phrase" ternyata satu token**.

### Task 2 — Central config dan safe rendering: SELESAI

- `assets/js/config.js` — baseUrl, data dir, feature flags (`analytics`,
  `ads`, `pwa`) default **false**, frozen.
- `assets/js/utils/normalize.js` — `normalizeLabel` / `normalizeSearch` /
  `tokenizeLabel` (NFC, whitespace collapse, casefold).
- `assets/js/utils/dom.js` — safe DOM builder (`el`, `replaceChildren`,
  `showError`). Seluruh `innerHTML`/`insertAdjacentHTML` untuk data corpus
  dihapus dari app. Guard test mencegah regresi.
- Statistik homepage yang menyesatkan (jumlah frasa palsu) sudah dilepas.

### Task 3 — Data schema, publishing pipeline, phrase correction: SELESAI

- Builder baru `tools/build-learning-data.py` dengan tahap eksplisit:
  - `data/raw/` — ekstraksi penuh berprovenance (tidak difilter destruktif);
  - `data/candidates/` — cleaning, proper-name filter, stable ID, penggabungan
    label duplikat menjadi `indonesianAlternatives` / `batakAlternatives`;
  - `data/published/` — hanya item lolos aturan publikasi; satu-satunya layer
    yang dibaca website.
- **Phrase rule keras**: minimal 2 token bermakna per sisi; corpus word-level
  menghasilkan 0 frasa asli, sehingga dataset phrase dipublikasikan kosong
  (jujur) alih-alih memalsukan phrase satu kata.
- **Stable ID**: `word-<10 hex>` content-hash; tidak bergeser saat rebuild.
- `data/migration/id-map.json` — pemetaan ID legacy → stable ID (485 terpetakan,
  91 legacy item tidak lolos filter baru, tercatat).
- `data/reports/data-quality-report.json` — jumlah per tahap + alasan eksklusi.
- Schema v2: `schemaVersion`, `reviewStatus` jujur (`corpus-derived` /
  `beta-unreviewed`; tidak ada klaim human review), `publicationStatus`.
- Checker kini hard-fail: frase <2 token, label duplikat dalam pool, ID bentrok,
  schema version, metadata counts, review status tidak dikenal.

### Task 4 — Question engine: SELESAI

- `assets/js/game/question-engine.js` — pure module, RNG injectable:
  - tepat satu jawaban benar;
  - opsi unik secara visible (normalized);
  - distractor tidak boleh sama dengan jawaban maupun alternatives-nya;
  - `QuestionQueue` anti-ulang sampai pool habis; siklus baru tidak mulai dengan
    item terakhir;
  - rapid-click guard (`answer()` sekali per soal);
  - pool kecil → opsi menyusut; pool kosong → error state aman.
- Terintegrasi ke semua mode quiz (meaning/reverse/sentence).
- Unit tests: synthetic pool + **real published data** (500+ ronde tervalidasi).

### Task 5 — Progress v2 dan migration: SELESAI

- `progress.js` ditulis ulang: schema v2 versioned, per-item stats
  (`seen/correctCount/incorrectCount/consecutiveCorrect/lastResult/
  lastReviewedAt/nextReviewAt/reviewStage/bucket`).
- Review schedule deterministik sesuai blueprint: salah → due sekarang;
  benar bertahap +1/+3/+7/+14/+30 hari.
- Migration otomatis dari key legacy `batakTobaGameProgress`, termasuk remap ID
  via `id-map.json`; legacy key tidak dihapus.
- localStorage unavailable → memory fallback; payload korup → dikuarantin
  sebagai backup; import tervalidasi ketat; bounded storage 2000 item;
  export/import/reset tersedia.
- Quiz & matching kini mencatat `itemId` per jawaban.

### Task 6 — Session, mistake review, daily practice: SELESAI

- `assets/js/game/session.js` pure module: pilihan ukuran sesi 5/10/20,
  `buildDailyQueue` (prioritas due → sering-salah → baru-salah → baru,
  tanpa prompt duplikat), `summarizeSession`, streak non-punishing (1 hari
  libat tetap hidup), `masteryLabel`.
- UI games: pemilih jumlah soal, ringkasan akhir sesi (skor, akurasi, daftar
  kesalahan), tombol **Review Kesalahan** (sesi ulang khusus item salah),
  tombol **Latihan Harian**, badge streak harian.
- Sesi bermakna (≥5 soal) dicatat ke `sessions` (bounded 30).

### Hasil verify saat ini

```text
Site check passed: 447 published learning items
(367 words, 0 genuine phrases, 80 sentences), 0 warnings.
Tests: 78 pass, 0 fail.
```

---

## Belum dikerjakan (urutan berikutnya)

- Task 7–8: lesson system + konten halaman belajar substantif (angka, keluarga,
  dll.) — butuh seleksi item tematik dari published pool; halaman tanpa materi
  cukup harus noindex/draft.
- Task 9: dictionary lanjutan (bidirectional normalized search, filter, detail,
  study list, practice) + correction workflow (GitHub issue prefilled).
- Task 10: SEO automation (sitemap generator dari registry, OG/Twitter
  konsisten, breadcrumb).
- Task 11: accessibility (skip link, keyboard 1–4, focus management, mobile nav).
- Task 12: PWA + caching strategy (hapus `immutable` untuk asset unversioned).
- Task 13: analytics adapter default-off.
- Task 14: AdSense readiness (hapus placeholder "Ruang iklan", ad component
  default-off, ads.txt contoh).
- Task 15: CI GitHub Actions menjalankan `npm run verify` + e2e.
- Task 16: final independent audit.
