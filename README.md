# Batak Toba Play

> **Active owner-directed browser plan (31 October 2026):** [ACTIVE_BROWSER_PRODUCT_PLAN_2026-10-31](docs/ACTIVE_BROWSER_PRODUCT_PLAN_2026-10-31.md). Desktop/mobile **web browser only**, development proceeds **in parallel** with corpus population; audio/pronunciation and culture-as-differentiator are not priorities. Public licensing restrictions remain in force. Historical progress below is not the current release truth.


Website game belajar Bahasa Batak Toba – Indonesia yang berjalan full static di Cloudflare Pages. Dibangun untuk pemula (diaspora, keluarga, pembelajar mandiri) yang ingin mengenal kosakata dasar lewat latihan berulang yang playable.

Statis penuh: tanpa login, tanpa backend, tanpa API berbayar. Progress tersimpan lokal di browser, transparan soal status bukti sumber.

## Parallel delivery and source contract

The webgame has a [current browser product plan](docs/ACTIVE_BROWSER_PRODUCT_PLAN_2026-10-31.md) and a [cross-repository source-field handoff](docs/UPSTREAM_WEBGAME_DATA_HANDOFF.md). Engineering of responsive desktop/mobile browser learning, game logic, progress, offline/PWA and synthetic fixture tests continues while private data research runs in parallel. The private `batak-indo-alignment-engine` is **not** a public content feed; never export its noncommercial/private dataset into this public repository without separate source rights and an explicit change in its project scope. Audio, pronunciation, culture as a strategic differentiator and native mobile apps are not current roadmap priorities.

## Product purpose
- Membuktikan dulu bahwa pengalaman belajar 5–10 menit nyaman dipakai di HP sebelum corpus diperbesar.
- Menyediakan jalur belajar yang jujur: setiap entri menampilkan status `source-evidence-qualified` / `evidence-insufficient` / `source-blocked` (otomatis via `tools/quality-gate.mjs` `source-evidence-v2`), bukan verifikasi manusia.
- Menjadi fondasi editorial: pipeline `raw → candidate → source-evidence-qualified → publication-eligible → published` dengan hanya `data/published` yang dibaca website. Tidak ada `human-reviewed` sebagai prasyarat publikasi (governance 2026-09-01).

## Practice modes
| Mode | Deskripsi |
|---|---|
| **Tebak Arti** | Pilihan ganda 4 opsi: lihat kata Batak Toba, pilih arti Indonesia yang tepat. Anti duplikat label, tepat satu jawaban benar. |
| **Reverse Quiz** | Lihat arti Indonesia, pilih padanan Batak Toba. |
| **Ketik Jawaban** | Ketik arti Indonesia; normalisasi NFC + casefold + toleransi typo transparan (bounded Levenshtein). |
| **Benar / Salah** | Nilai apakah pasangan Batak–Indonesia yang ditampilkan benar; pasangan salah tidak pernah memakai alternatif yang tercatat sebagai benar. |
| **Matching Pairs** | Papan terbuka 4 / 6 / 8 pasang (pilih varian). Cocokkan kata dan artinya tanpa timer wajib. Timer opsional OFF/ON (tidak mempengaruhi skor). |
| **Memory Game** | Kartu tertutup 4 / 6 / 8 pasang, perlu membalik. State timer tidak bocor ke Memory. |
| **Daily Challenge** | Date-seeded deterministic (mulberry32 + `dailySeed`), 10 soal per hari, sama untuk semua pengguna di hari yang sama. |
| **Kalimat Pendek** | Mode beta untuk kalimat pendek; 0 terbit (licensing block), tidak dipakai sebagai otoritas. |
| **Flashcards** | Filter due / saved / difficult / tema, shuffle, tombol Salah/Sulit/Benar, shortcut keyboard Space + 1/2/3, navigasi panah. |
| **Dictionary** | Dua arah ternormalisasi (NFC+casefold), fuzzy terbatas, filter tema/arah/tipe/status/difficulty (difficulty disabled jujur saat metadata belum ada), highlight aman, detail expandable, Simpan ke latihan, Practice kata ini → games seeded, Lapor koreksi via GitHub issue prefilled. |
| **Session** | Pilihan ukuran 5/10/20, ringkasan (soal, benar, salah, akurasi, daftar salah, CTA Review Kesalahan), daily queue (due → sering-salah → baru-salah → baru, tanpa duplikat prompt), streak non-punishing (1 hari libur tetap hidup, putus setelah 2 hari). |

## Public content and release status
- Published word pairs, phrase pairs, sample sentences, and lessons: **0**.
- Topic pages remain noindex while no authorized public learning items exist.
- This repository contains no raw or candidate corpus snapshots. Collection, import, review, reporting, and rebuild commands fail closed here; the private Alignment Engine owns that work.
- The legacy ID map remains for browser-local progress migration. It contains identifiers only, not learning labels.

The data/published directory is the only learning-data location copied into the website build. Release builds reject non-empty pools or indexable empty topics until the source adapter and publication gates are implemented and cleared.

## Topic page indexability policy
## Topic page indexability policy
Single source: `data/published/topics.json` + `tools/site.config.json` + sitemap generator + `check-site.mjs`.

- **Indexable (included in sitemap.xml + <lastmod>):** `/`, `/about/`, `/contact/`, `/correction-process/`, `/data-source/`, `/dictionary/`, `/editorial-policy/`, `/flashcards/`, `/games/`, `/learn/`, `/learn/adat-ringan/`, `/learn/tips-diaspora/`, `/methodology/`, `/privacy/`, `/contributors/` (15 URLs).
- **Noindex (excluded from sitemap, `noindex,follow`):** `/learn/angka/` (0 `source-evidence-qualified` published, need 8), `/learn/keluarga/` (0), `/learn/sapaan/` (0), `/learn/makanan/` (0), `/progres/` (personal), plus internal topics `waktu` (0), `alam` (0) yang belum punya halaman publik.
- Promosi otomatis saat pool `source-evidence-qualified` ≥8; demosi saat <8. `npm run build:seo` + `npm run build` menerbitkan perubahan.

Halaman tipis tetap jujur: menampilkan materi nyata + banner `menunggu bukti sumber`, tidak memalsukan ketersediaan.

## Progress schema v3
- **Storage key (legacy name):** `batakTobaPlay.progress.v2` — nama key tidak diubah untuk kompatibilitas; `schemaVersion = 3`.
- **Legacy key (read-once):** `batakTobaGameProgress` (v1) → dimigrasi via `data/migration/id-map.json`.
- **Per-item stats:** `seen / correctCount / incorrectCount / consecutiveCorrect / lastResult / lastReviewedAt / nextReviewAt / reviewStage / bucket (known|review) / saved (independent) / difficult (independent)`.
- **Review schedule (deterministik):** salah → stage 0 due now; benar → +1d, +3d, +7d, +14d, +30d. `consecutiveCorrect` dilacak, `reviewStage` naik per benar.
- **Flags independent:** `saved` dan `difficult` tidak lagi berbagi `bucket`; migrasi `v2→v3` (`migrateV2ToV3`) memisahkan `bucket: saved|difficult` menjadi flag.
- **Per-lesson progress:** `lessons[slug] = { startedAt, completedAt, attempts, mistakesTotal, lastMistakeCount }` + status rollup `not-started → learning → needs-review → nearly-mastered → completed` (≥3 percobaan tanpa salah = completed).
- **Bounded:** 2000 item, 30 sesi terakhir; localStorage unavailable → memory fallback; payload korup → backup `*.corrupt-backup`, tidak overwrite buta.
- **Export/import/reset:** Validasi ketat 512 KB cap, schemaVersion harus 3 (atau 2 dimigrasi), id harus `^[a-z]+-[0-9a-f]{10}$`.

Homepage menampilkan copy jujur: `learn/keluarga/` dan `learn/sapaan/` diakui belum terbit, tidak mengeclaim 0 pelajaran sebagai tersedia.

## Editorial pipeline
```
batak-indo-alignment-engine (1.6 GB DB historis, tidak di CI untuk incremental)
  data/input/bible_batak_indo_v1.db
  data/processed/master_alignment_bible_only.db (hanya untuk content:rebuild-full)
        │
        ▼ (historis)
tools/build-learning-data.py  (Python, butuh master DB) — via npm run content:rebuild-full

Normal incremental (tanpa master DB, yang dipakai sehari-hari):
  data/sources/staging/*.json (external source, license gate) ─┐
         ▼                                                    │
  npm run content:publish  (Node, DB-independent: validasi → recompute topics/lessons → quality report)
         ▼
  data/published/  hanya yang lolos aturan publikasi (satu-satunya dibaca website)
        • learning-items.json
        • word-pairs.json (0 public, 591 internal qualified)
        • phrase-pairs.json (0 public, 60 internal qualified)
        • sample-sentences.json (0 public, 80 internal qualified)
        • lessons.json (0 published / 6 draft, threshold 8)
        • topics.json (registry public-safe)
        data/reports/data-quality-report.json
        data/migration/id-map.json
```
Confidence = sinyal statistik co-occurrence, bukan jaminan linguistik. Semua word `source-evidence-qualified` via gate otomatis `source-evidence-v2` (`quality-gate.mjs`), bukan verifikasi manusia. Status publik jujur: `source-evidence-qualified` ≠ `human verified`.

## Build, verify, tests
```bash
# install (hanya devDependencies: @playwright/test + @axe-core/playwright)
npm ci

# sitemap (harus sebelum build jika baseUrl atau lastModified berubah)
npm run build:seo   # tools/generate-sitemap.mjs → sitemap.xml + <lastmod> dari site.config lastModified

# production artifact (deterministic)
npm run build       # tools/build-dist.mjs → dist/ (public-only) + hashed assets + SW cache stamped

# single canonical verification (check + build + unit + smoke + browser + drift)
npm run verify              # = verify:core && verify:drift
npm run verify:core         # check + build + test + e2e + test:browser
npm run verify:drift        # git diff --exit-code -- dist  (gagal jika committed dist belum sync)
npm run verify:release      # verify + lighthouse-check

# granular
npm run check       # tools/check-site.mjs (link, schema, SEO, sitemap coverage, metadata counts, reviewStatus)
npm run test        # node --test "tests/**/*.test.mjs"  (193 tests: data, question-engine, progress v3, session, analytics, ads, PWA, source-expansion)
npm run e2e         # node tools/e2e-smoke.mjs  (server dist di 4179, fetch halaman kunci, manifest, sw, data)
npm run test:browser # playwright test (chromium, 33 specs: quiz, typed, true/false, memory/matching 4/6/8, flashcards, dictionary, progres, security headers, draft-leak, axe 6 halaman, future-transition)
npm run build:data  # historical full rebuild, butuh master DB 1.6 GB, tidak di CI — untuk incremental gunakan npm run content:publish (DB-independent)
npm run content:publish       # DB-independent incremental (staging → published, tanpa master DB)
npm run content:rebuild-full  # full historis, butuh master DB 1.6 GB
npm run quality:status / preview / gaps # source-evidence quality pipeline (gate otomatis, tanpa human)
npm run source:validate / preview / import # external source ingestion (staging → candidate, license gate APPROVED_FOR_INGESTION)
npm run editorial:status      # ringkasan editorial (published/qualified, lesson/topic blockers)
npm run lighthouse:check      # release gate deterministic (dist/_headers/checklist)
```

**Legacy commands (retained for migration compat only, not active publication workflow):**
```
npm run review:queue / lesson-gaps / topic-gaps / validate / preview / round1 / import
# DEPRECATED 2026-09-01: human-review workflow, retained for migration compat only
# Cannot become a publication gate. Governance checker distinguishes them.
```

**Determinism:** `tools/build-dist.mjs` normalisasi EOL ke LF *sebelum* hashing/revision, menginject `meta last-modified` + visible `<time>` dari `tools/site.config.json: lastModified` (ISO date `2026-08-26` → `Terakhir diperbarui: 26 Agustus 2026`), serta mem-build `sitemap.xml` → `<lastmod>` dari sumber yang sama. Tidak ada `git log` history lookup; shallow/full clone, Windows/Linux menghasilkan byte identical (`npm run build` dua kali → `git diff --exit-code -- dist` clean).

**Idempotence test:** `npm run build; git diff --exit-code -- dist` dan `npm run build` kedua harus tetap clean (diuji di CI dan di `tests/data`).

**SEO/metadata:** Checker + data tests memastikan exact cardinality `title/description/canonical/robots/og:title/og:description/og:type/og:url/og:site_name/og:locale/og:image/twitter:card/twitter:title/twitter:description/twitter:image` di source *dan* dist, tidak hanya 3 sample.

**Noindex ↔ sitemap parity:** `tools/site.config.json:lastModified` + `tools/generate-sitemap.mjs` + `check-site.mjs` berbagi single source; test memastikan thin topics (`/learn/angka/`, `/keluarga/`, `/sapaan/`, `/makanan/`) memiliki `noindex,follow` dan absen dari sitemap; indexable pages included.

**LearningResource:** `tools/lib/learning-resource.mjs` meng-emit JSON-LD hanya untuk `publicationStatus === "published"` dengan pool ≥1; build inject ke `learn/<slug>/` bila ada lesson terbit (hari ini 0, jadi tidak ada fake). Test memverifikasi: published fixture → LearningResource present, draft/empty → null, zero fixture tidak bocor ke `dist`.

**Session summary:** `assets/js/game/session.js:summarizeSession` menghitung `answered/correct/incorrect/accuracy/isMeaningful/newItemIds/strongIds/mistakeIds`; UI games (`app.js:renderSummaryPanel`) menampilkan `question count/correct/incorrect/accuracy/new/improved/needs-review` + mistake review CTA + next recommendation. Browser coverage memverifikasi.

**Returning user homepage:** `assets/js/app.js:renderHomeDynamic` menampilkan `last lesson/last mode/due review/streak/saved/difficult/recommended next/continue CTA` bila `answered>0` atau `sessions>0`; zero-lesson tetap jujur tanpa klaim lesson palsu, fixture membuktikan jalur future.

**Analytics semantics:** `assets/js/analytics.js` adapter default OFF, allowlist `lesson_view/lesson_start/lesson_complete/game_start/question_answered/answer_correct/answer_incorrect/session_complete/mistake_review_start/mistake_review_complete/daily_practice_complete/dictionary_search/dictionary_no_result/word_saved/correction_opened/progress_exported/pwa_installed/offline_session`. Validasi ketat: tidak mengirim raw query, tidak mengirim progress payload, tidak ada `pwa_installed` tanpa genuine install signal, `provider absent → sent:false`, `consent absent → no send`. Topic page ≠ lesson.

**PWA/offline:** `sw.js` network-first navigations + fallback `offline.html`, versioned cache `btp-<hash>` stamped dari build hash, old-cache purge on activate, hashed assets immutable (`Cache-Control: public, max-age=31536000, immutable`), `sw.js` `no-cache`, tidak intercept lintas origin (ads/analytics). `manifest.webmanifest` linked + `theme-color` di setiap halaman, icons 192/512 + maskable.

## Cloudflare deployment
`wrangler.toml`:
```toml
pages_build_output_dir = "dist"
[assets]
directory = "dist"
```
Produksi hanya deploy `dist/` (public-only). Jangan `wrangler pages deploy .` (akan mengekspos `data/raw`, `tools`, `tests`). README lama yang menyebut output `.` sudah obsolete.

Lokal:
```bash
npm run build
# preview dist (harus, bukan root)
python -m http.server 4179 --directory dist
# atau npx wrangler pages dev dist
```

Headers: `_headers` (CSP tanpa `unsafe-eval`/wildcard, ketat saat ads/analytics OFF) dan `_redirects` (`/webgame-bataktoba-indo/* → /`) di-copy verbatim ke `dist`.

## CI
`.github/workflows/verify.yml` (ubuntu-latest, Node 24):
1. `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` (v7.0.1, pinned immutable SHA; shallow checkout)
2. `actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1` (v7.1.0; Node 24; package-manager cache disabled)
3. `npm ci`
4. `npx playwright install --with-deps chromium`
5. `npm run verify:release` (check + build + unit + smoke + browser + axe + lighthouse-check)
6. `git diff --exit-code -- dist` (drift gate, eksplisit untuk diagnose)
7. `actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9` (v7.0.2; Lighthouse reports)

Local `npm run verify:release` reproduksi CI 1:1. Tidak rebuild ganda; failure menunjukkan file drift spesifik.

## Keamanan & privasi
- `innerHTML` untuk data corpus dilarang (diuji); `assets/js/utils/dom.js` (`el`, `replaceChildren`).
- `config.js` feature flags `ads/analytics/pwa` default `false`, frozen.
- Ads: `assets/js/ads.js` inert sampai `flag + ca-pub-XXXXXXXXXXXXXXX + consent`; `ALLOWED_PLACEMENTS`, loader once, CLS-safe; generator `ads.txt` menolak placeholder.
- Analytics: `provider absent = sent:false`, consent gate default denied, toggles di `/progres/`, tidak ada dark pattern.
- Import 512 KB cap, strict schema; storage 2000 item, 30 sesi.

## Struktur
```
assets/js/config.js        baseUrl, dataDir, featureFlags
assets/js/data.js          loader published layer
assets/js/progress.js      progress schema v3 + migration v2→v3 + review schedule + lessons
assets/js/app.js           init home/games/dictionary/flashcards/learn
assets/js/game/question-engine.js  pure engine 1 benar + unique labels
assets/js/game/session.js  session + daily + summary
assets/js/utils/{dom,normalize,corrections}
content/lessons.json       definisi lesson (title/desc/level, tidak overpromise)
data/{raw,candidates,reviewed,published}  editorial layers
data/migration/id-map.json  legacy → stable
data/sources/source-registry.json + staging/  source ingestion (license gate, stable IDs)
tools/build-dist.mjs       deterministic dist build (LF normalize → hash → revision → inject meta/visible + sitemap lastmod + headers)
tools/generate-sitemap.mjs generator dari halaman aktual + lastModified
tools/check-site.mjs       checker komprehensif
tools/review-*.mjs + source-*.mjs + content-publish.mjs  human-review & source pipeline (DB-independent incremental)
tests/{unit,data,browser}  193 unit/data + 33 browser (playwright + axe, future-transition, source-expansion)
```

## External blockers (tetap, tanpa human review)
- Lisensi corpus (`bible_batak_indo_v1.db` `REQUIRES_LEGAL_REVIEW` per `docs/CORPUS_LICENSING_STATUS.md` — `publicationAllowed false`)
- Audio licensing/recording (listening mode deferred, butuh file+license+transcript)
- Custom domain/DNS, Search Console, Cloudflare hostname verification
- AdSense Publisher ID, ads.txt asli, CMP tersertifikasi bila wajib
- 6 draft lessons masih `evidence-insufficient` (butuh `source-evidence-qualified` 8, saat ini `angka` 5/8)

Semua repository-solvable task ditutup. `Human review` **bukan lagi blocker** (governance 2026-09-01). Sisa blocker adalah lisensi/domain/AdSense/audio atau `insufficient evidence` (otomatis, bukan manual).