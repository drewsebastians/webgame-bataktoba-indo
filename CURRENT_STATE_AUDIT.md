# Baseline Audit Kondisi Repository

**Tanggal audit:** 24 Agustus 2026
**Dibuat oleh:** OpenCode (Task 1 dari `02_GAP_REPOSITORY_DAN_HOMEWORK_CODEX.md`)
**Commit baseline:** `49683cb93dc5d1f7fac863c858590bf70c2edb4f` ("Fix Cloudflare deploy asset configuration")

---

## 1. Tujuan

Dokumen ini mendokumentasikan kondisi aktual repository pada saat dimulainya program perbaikan menuju `01_BLUEPRINT_ULTIMATE_WEBSITE_BATAK_TOBA_PLAY.md`. Audit gap lengkap ada di `02_GAP_REPOSITORY_DAN_HOMEWORK_CODEX.md`; dokumen ini fokus pada peta teknis dan baseline terukur.

## 2. Routes publik

| Route | File | Status |
|---|---|---|
| `/` | `index.html` | Ada, homepage MVP |
| `/games/` | `games/index.html` | Ada, 4 mode (Tebak Arti, Reverse Quiz, Matching Pairs, Kalimat Pendek beta) |
| `/dictionary/` | `dictionary/index.html` | Ada, substring search |
| `/flashcards/` | `flashcards/index.html` | Ada, urutan tetap |
| `/about/` | `about/index.html` | Ada |
| `/contact/` | `contact/index.html` | Ada |
| `/privacy/` | `privacy/index.html` | Ada |
| `/methodology/` | `methodology/index.html` | Ada |
| `/data-source/` | `data-source/index.html` | Ada |
| `/learn/` | `learn/index.html` | Ada, index panduan |
| `/learn/{keluarga,angka,sapaan,makanan,adat-ringan,tips-diaspora}/` | masing-masing `index.html` | Ada, konten tips umum tanpa materi aktual |

## 3. Data flow

```text
batak-indo-alignment-engine (repo corpus, eksternal)
├── data/input/bible_batak_indo_v1.db          (31.102 ayat paralel)
└── data/processed/master_alignment_bible_only.db (dibangun via scripts/run_phase2_pipeline.py)
        │
        ▼
tools/build-learning-data.py  (filter + klasifikasi)
        │
        ├── data/word-pairs.json        (376 item, type "word")
        ├── data/phrase-pairs.json      (120 item, type "phrase") ← SALAH: masih satu kata
        ├── data/sample-sentences.json  (80 item kalimat pendek beta-unreviewed)
        └── data/learning-items.json    (456 = words + sentences)
                │
                ▼
assets/js/data.js   (fetch + cache Map, export loadLearningItems/loadWordPairs/loadSentences)
        │
        ▼
assets/js/app.js    (initHome / initDictionary / initGames / initFlashcards)
assets/js/progress.js (localStorage "batakTobaGameProgress": answered/correct/known/review/lastMode)
```

Catatan penting:

- `phrase-pairs.json` **tidak dipakai** oleh app (tidak ada loader); homepage tetap menampilkan angka frasa.
- Klasifikasi phrase di builder salah: cukup `-` atau panjang ≥ 8 karakter, contoh `panangko → pencuri`.
- ID sequential (`word-0001`) tidak stabil terhadap rebuild.

## 4. Baseline counts (terukur saat audit)

- Learning items: **456** (376 word + 80 sentence).
- Phrase pairs file: **120** item (semua salah klasifikasi, satu token).
- Mode game aktif: 4 (meaning, reverse, matching, sentence).
- Script npm: `build:data`, `check`, `start`. Tidak ada `test` / `verify`.
- Test suite: **tidak ada**.
- CI: **tidak ada** workflow GitHub Actions.
- Dependency runtime/npm: **0** (vanilla statis).

## 5. Temuan teknis kunci (ringkas)

Prioritas P0 yang dibahas detail di dokumen gap:

1. Phrase classification salah (builder `build_phrase_pairs`, baris ~467).
2. Phrase dataset tidak dipakai game.
3. `makeQuestion()` tidak menormalisasi label; opsi bisa tampak duplikat.
4. Soal bisa berulang langsung (random per soal, tanpa queue).
5. Data tanpa lifecycle editorial (raw→candidate→reviewed→published).
6. Semua word pair `corpus-derived`; belum ada human review.
7. ID sequential bergeser saat rebuild.
8. Progress schema v1 terlalu sederhana.
9. `innerHTML` untuk data corpus (XSS-by-pipeline risk).
10. Placeholder iklan "Ruang iklan" selalu tampil.
11. `_headers`: asset unversioned diberi `immutable` 1 tahun.
12. Checker hanya memeriksa file/link dasar.

## 6. Harness pengujian (baru, Task 1)

- Runner: `node --test tests/` (built-in `node:test`, zero dependency).
- Struktur:
  - `tests/unit/` — unit test modul murni;
  - `tests/data/` — validasi data JSON (schema, duplikat, metadata);
  - `tests/e2e/` — (nanti) smoke HTTP setelah ada server helper.
- Script baru:
  - `npm test` → unit + data tests;
  - `npm run check` → site checker (diperluas);
  - `npm run verify` → check + test (gerbang utama CI).

### Baseline hasil verify pertama

- `npm run check` lulus (456 items, tidak ada broken link).
- Test data awal mendokumentasikan kondisi termasuk kelemahan yang diketahui (mis. phrase satu-token dilaporkan sebagai temuan baseline, bukan failure hard sampai Task 3 memperbaiki pipa data).

## 7. Environment build data

- Corpus repo di-clone ke `../batak-indo-alignment-engine` sesuai konvensi path builder (`CORPUS_ROOT = REPO_ROOT.parent / "batak-indo-alignment-engine"`).
- Master DB diregenerasi dengan `python scripts/run_phase2_pipeline.py --rebuild` di repo corpus (langkah 01–05 cukup untuk builder website; langkah 06+ opsional).

## 8. Keputusan arsitektur yang mengikat task berikutnya

1. Tetap static-first, zero runtime dependency; tooling Node pakai stdlib (`node:test`, `node:` APIs).
2. Bahasa tooling: Python tetap untuk ekstraksi corpus; Node untuk validasi/publish/checker agar satu bahasa dengan test harness.
3. Data output akan dipisah menjadi raw/candidate/reviewed/published (Task 3); app hanya baca published.
4. Modul game engine harus pure (tanpa DOM/localStorage) supaya bisa dites di Node (Task 4).
