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

## Status per 24 Agustus 2026 (OpenCode session 2)

### Task 7 — Lesson system: SELESAI

- Tagging tema via `content/themes/keywords.json` (exact normalized match,
  hanya melabeli item corpus yang sudah ada).
- `data/published/lessons.json`: registry dengan aturan publikasi keras
  (minimal 6 item corpus per tema), review rollup dihitung dari status anggota
  (tidak ada klaim human review), draft terpisah dari published.
- Suplemen editorial (`content/curated/draft-vocabulary.json`) berstatus
  `needs-review`, dedupe otomatis terhadap pool, tidak pernah masuk game data.
- Hasil jujur saat ini: 0 published lesson, 6 draft (corpus Bible-derived
  memang tipis untuk tema umum).

### Task 8 — Halaman belajar substantif: SELESAI

- `angka/keluarga/sapaan/makanan` merender materi nyata: tabel item corpus
  berlabel kualitas + suplemen draft dengan banner "menunggu review penutur".
- Mini practice aktif bila pool >= 4 item, terhubung ke progress.
- Halaman tanpa tema tetap editorial; tidak ada halaman kosong.

### Task 9 — Dictionary v2 + koreksi: SELESAI

- Pencarian dua arah ternormalisasi (NFC + casefold), filter arah dan tema,
  hitung hasil, baris detail expandable (alternatives, confidence).
- Simpan ke daftar latihan (bucket baru `saved` di progress v2).
- Lapor koreksi: URL GitHub issue ter-prefill via URLSearchParams.

### Task 10 — SEO automation: SELESAI

- Sumber tunggal `tools/site.config.json`; parity dengan `assets/js/config.js`
  diuji.
- `tools/generate-sitemap.mjs` menghasilkan sitemap deterministik dari halaman
  aktual (menghormati noindex); checker membandingkan sitemap vs halaman.
- OG + Twitter card lengkap di semua halaman (codemod + manual homepage).

### Task 11 — Accessibility: SELESAI

- Skip link + `#main-content` di semua halaman; nav toggle mobile dengan
  aria-expanded; shortcut keyboard 1-4 untuk opsi jawaban; fokus pindah ke
  prompt setelah Next; state benar/salah diberi simbol selain warna;
  reduced-motion CSS; target sentuh minimal 44px.

### Task 12 — PWA + caching: SELESAI

- `manifest.webmanifest` + ikon SVG + `offline.html`.
- `sw.js`: navigasi network-first dengan fallback offline; assets & data
  published stale-while-revalidate; request lintas origin (ads/analytics)
  tidak pernah diintersepsi; cache lama dihapus on activate.
- `_headers`: immutable 1-tahun untuk asset unversioned DIHAPUS, diganti
  revalidate harian; sw.js no-cache; X-Frame-Options ditambah.

### Task 13 — Analytics foundation: SELESAI

- Adapter provider-neutral default-off + consent gate localStorage.
- Whitelist event blueprint, penolakan field terlarang (PII), nilai primitif
  dan terbatas panjangnya. Wiring minimal: session_complete /
  mistake_review_complete / game_start (no-op sampai flag+consent aktif).

### Task 14 — AdSense readiness: SELESAI

- Semua placeholder "Ruang iklan" dihapus dari HTML dan CSS.
- `assets/js/ads.js`: inert sampai flag + publisher ID valid (format
  ca-pub-16 digit) + consent; sweep placeholder defensif.
- `ads.txt.example` disertakan; ads.txt asli sengaja belum ada.

### Task 15 — Test suite + CI: SELESAI

- `tools/e2e-smoke.mjs`: server lokal + assert halaman kunci, manifest, sw,
  robots, data published, lessons, sitemap.
- `npm run verify` = check + tests + e2e.
- `.github/workflows/verify.yml` menjalankan ketiganya di push main dan PR.

### Hasil verify akhir

```text
Site check passed: 447 published items, 0 warnings.
Tests: 110+ passing.
E2E smoke passed.
```

---

## Belum dikerjakan / eksternal

- Task 16: final independent audit (disarankan sesi terpisah setelah deploy stabil).
- Human linguistic review atas suplemen draft dan core vocabulary (eksternal).
- Review lisensi corpus, custom domain, Search Console, AdSense account (eksternal).
- Verifikasi URL produksi Cloudflare: Workers Builds hijau, tapi hostname
  publik perlu dicek dari dashboard Cloudflare (wrangler login expired).
