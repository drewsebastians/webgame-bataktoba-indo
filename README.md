# Batak Toba Play

Website game belajar Bahasa Batak Toba - Indonesia yang berjalan full static di Cloudflare Pages.

Fokus MVP ini sengaja kecil: website jadi, game playable, dan data memakai subset corpus yang lebih mudah diaudit. Corpus besar bisa menjadi tahap berikutnya setelah struktur produk terbukti enak dipakai.

## Fitur

- Homepage SEO-friendly dengan ringkasan fitur dan internal links.
- Game Tebak Arti, Reverse Quiz, Matching Pairs, dan Kalimat Pendek beta dengan question engine yang menjamin tepat satu jawaban benar dan opsi selalu unik secara visual.
- Sesi terukur (5/10/20 soal), ringkasan akhir, review kesalahan, latihan harian berbasis prioritas review, dan streak harian.
- Progress v2 per item dengan jadwal pengulangan (1/3/7/14/30 hari), migrasi otomatis dari storage lama, export/import/reset.
- Lesson tematik (angka, keluarga, sapaan, makanan) dengan materi nyata + mini practice; suplemen editorial diberi label draft secara jujur.
- Dictionary dua arah ternormalisasi dengan filter tema/arah, detail entri, simpan ke daftar latihan, dan lapor koreksi via GitHub issue.
- PWA: dapat dipasang, halaman yang pernah dibuka tetap tersedia saat offline.
- Skip link, navigasi mobile, shortcut keyboard 1-4, reduced motion, dan target sentuh >= 44px.
- Analytics adapter dan komponen iklan default-off; tidak ada placeholder "Ruang iklan".
- `sitemap.xml` dihasilkan otomatis dari daftar halaman (`npm run build:seo`).

## Data Source

Data dibuat dari repo:

https://github.com/drewsebastians/batak-indo-alignment-engine

Data mengalir melalui pipeline editorial eksplisit:

```text
data/raw/         hasil ekstraksi penuh dari corpus DB (tidak difilter destruktif)
  -> data/candidates/   item bersih dengan stable ID + penggabungan label duplikat
    -> data/published/  item yang lolos aturan publikasi (satu-satunya yang dibaca website)
```

File yang dipakai website (lapisan published):

- `data/published/learning-items.json`
- `data/published/word-pairs.json`
- `data/published/phrase-pairs.json`
- `data/published/sample-sentences.json`

Setiap build juga menghasilkan:

- `data/reports/data-quality-report.json` - jumlah per tahap, alasan eksklusi, duplikat yang digabung
- `data/migration/id-map.json` - pemetaan ID legacy sequential ke stable ID (dipertahankan selamanya)

Subset saat ini berisi 367 pasangan kata dan 80 kalimat pendek beta. Dataset phrase sengaja kosong: corpus word-level belum menghasilkan pasangan multi-token asli, dan aturan pipeline menolak "phrase" satu kata.

## Reliability Filtering

Script `tools/build-learning-data.py` membaca database lokal dari repo corpus:

- `data/processed/master_alignment_bible_only.db`
- `data/input/bible_batak_indo_v1.db`

Kriteria utama:

- memakai kandidat `high_confidence` dan `medium_confidence`;
- membuang stopword candidate, tanda baca, duplikat, nilai kosong, token terlalu pendek/panjang, dan simbol noisy;
- membuang daftar konservatif nama diri transliterasi;
- menggabungkan label yang tampak sama menjadi `indonesianAlternatives` / `batakAlternatives` sehingga opsi soal tidak mungkin kembar;
- phrase wajib memiliki minimal dua token bermakna di kedua sisi setelah normalisasi;
- tidak ada item yang diklaim human-reviewed; semua word tetap `corpus-derived`.

Confidence adalah sinyal statistik, bukan jaminan kebenaran linguistik. Materi ini adalah alat belajar dan eksplorasi.

## Run Lokal

Tidak ada dependency runtime.

```bash
npm run start
```

Alternatif tanpa `npm`:

```bash
python -m http.server 4173
```

Buka:

```text
http://localhost:4173
```

Jika ingin rebuild dataset setelah repo corpus tersedia dan pipeline corpus sudah menghasilkan master database:

```bash
npm run build:data
```

## Check

```bash
npm run verify
```

`verify` menjalankan tiga gerbang: site check (link, schema data, SEO, sitemap), unit + data tests (`node --test`), dan e2e smoke (server lokal + fetch halaman kunci). CI GitHub Actions menjalankan alur yang sama di setiap push dan pull request.

## Deploy Cloudflare Pages

Repo ini disiapkan untuk Cloudflare Pages. File `wrangler.toml` memakai output folder root karena website adalah static HTML/CSS/JS tanpa build output terpisah.

Di Cloudflare Pages:

1. Hubungkan repo GitHub `drewsebastians/webgame-bataktoba-indo`.
2. Pilih production branch: `main`.
3. Pilih framework preset: `None` atau static HTML.
4. Build command: kosongkan, atau isi `npm run check` jika ingin validasi saat deploy.
5. Build output directory: `.`.
6. Root directory: `/`.
7. Simpan dan deploy.

Cloudflare juga akan membaca `_headers` untuk security/cache headers dan `_redirects` untuk mengarahkan path lama `/webgame-bataktoba-indo/*` ke path root Cloudflare.

Jika dashboard menampilkan field Deploy command, gunakan:

```bash
npx wrangler pages deploy . --project-name=webgame-bataktoba-indo
```

Jangan gunakan `npx wrangler deploy` untuk Cloudflare Pages. File `wrangler.toml` tetap diberi fallback `[assets]` agar command tersebut tidak gagal membaca folder asset, tetapi jalur yang benar untuk Pages adalah `wrangler pages deploy`.

URL target:

```text
https://webgame-bataktoba-indo.pages.dev/
```

Jika Cloudflare memakai project name berbeda, update canonical URL di halaman HTML, `sitemap.xml`, dan `robots.txt` ke domain final tersebut.

## Struktur

```text
assets/js/config.js        konfigurasi terpusat (URL, feature flags)
assets/js/data.js          loader lapisan published
assets/js/app.js           init halaman (home/games/dictionary/flashcards/learn)
assets/js/progress.js      progress v2 + migration + review schedule
assets/js/analytics.js     adapter analytics (default off, consent-aware)
assets/js/ads.js           komponen iklan (default off)
assets/js/game/question-engine.js  generator soal murni + session queue
assets/js/game/session.js  sesi, latihan harian, streak
assets/js/utils/           dom aman, normalizer, corrections
content/lessons.json       definisi lesson (judul, deskripsi, level)
content/themes/keywords.json  tagging tema untuk item corpus
content/curated/           suplemen draft berlabel (tidak masuk game data)
data/raw|candidates|published  pipeline editorial
data/migration/id-map.json pemetaan ID legacy -> stable ID
tools/build-learning-data.py   builder pipeline (butuh corpus DB lokal)
tools/generate-sitemap.mjs     generator sitemap
tools/e2e-smoke.mjs            smoke test e2e zero-dependency
tests/                     unit, data, dan integrasi (node --test)
.github/workflows/verify.yml   CI: check + tests + e2e
```

## Roadmap

- Review manual item corpus yang paling sering dimainkan.
- Tambah kategori pelajaran dasar setelah ada validasi traffic.
- Perluas corpus secara bertahap, bukan sekaligus.
- Tambah audio jika ada sumber pengucapan yang legal dan reliable.
- Tambah mode review adaptif berbasis localStorage.

## License Notes

Kode website dibuat untuk repo ini. Dataset berasal dari corpus lokal dan perlu review lisensi lebih lanjut sebelum corpus diperbesar atau kalimat panjang ditampilkan secara luas.
