# Batak Toba Play

Website game belajar Bahasa Batak Toba - Indonesia yang berjalan full static di Cloudflare Pages.

Fokus MVP ini sengaja kecil: website jadi, game playable, dan data memakai subset corpus yang lebih mudah diaudit. Corpus besar bisa menjadi tahap berikutnya setelah struktur produk terbukti enak dipakai.

## Fitur

- Homepage SEO-friendly dengan ringkasan fitur dan internal links.
- Game Tebak Arti: kata/frasa Batak Toba ke arti Indonesia.
- Reverse Quiz: arti Indonesia ke padanan Batak Toba.
- Flashcards dengan progress lokal di `localStorage`.
- Matching Pairs 5 pasangan per ronde.
- Latihan Kalimat Pendek beta.
- Mini Dictionary dengan pencarian Batak atau Indonesia.
- Static pages: `/`, `/games/`, `/dictionary/`, `/flashcards/`, `/about/`, `/methodology/`, `/data-source/`, `/learn/`.
- `sitemap.xml`, `robots.txt`, OpenGraph meta, dan JSON-LD sederhana.

## Data Source

Data dibuat dari repo:

https://github.com/drewsebastians/batak-indo-alignment-engine

File static hasil preprocessing:

- `data/learning-items.json`
- `data/word-pairs.json`
- `data/phrase-pairs.json`
- `data/sample-sentences.json`

Subset awal saat ini berisi 376 pasangan kata, 120 pasangan frasa, dan 80 kalimat pendek beta.

## Reliability Filtering

Script `tools/build-learning-data.py` membaca database lokal dari repo corpus:

- `data/processed/master_alignment_bible_only.db`
- `data/input/bible_batak_indo_v1.db`

Kriteria utama:

- memakai kandidat `high_confidence` dan `medium_confidence`;
- membuang stopword candidate, tanda baca, duplikat, nilai kosong, token terlalu pendek, token terlalu panjang, dan simbol noisy;
- membuang daftar konservatif nama diri yang jelas agar latihan lebih condong ke kosakata;
- membatasi kalimat pendek beta dengan panjang sederhana;
- tidak mengklaim pasangan corpus-derived sebagai kamus final.

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
npm run check
```

Alternatif tanpa `npm`:

```bash
node tools/check-site.mjs
```

Check ini memastikan file penting ada, data minimal terisi, dan link asset tidak memakai root absolute path yang rawan pecah saat dipublish sebagai static website.

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

URL target:

```text
https://webgame-bataktoba-indo.pages.dev/
```

Jika Cloudflare memakai project name berbeda, update canonical URL di halaman HTML, `sitemap.xml`, dan `robots.txt` ke domain final tersebut.

## Struktur

```text
assets/css/styles.css
assets/js/app.js
assets/js/data.js
assets/js/progress.js
data/*.json
tools/build-learning-data.py
tools/check-site.mjs
games/index.html
dictionary/index.html
flashcards/index.html
about/index.html
methodology/index.html
data-source/index.html
learn/index.html
```

## Roadmap

- Review manual item corpus yang paling sering dimainkan.
- Tambah kategori pelajaran dasar setelah ada validasi traffic.
- Perluas corpus secara bertahap, bukan sekaligus.
- Tambah audio jika ada sumber pengucapan yang legal dan reliable.
- Tambah mode review adaptif berbasis localStorage.

## License Notes

Kode website dibuat untuk repo ini. Dataset berasal dari corpus lokal dan perlu review lisensi lebih lanjut sebelum corpus diperbesar atau kalimat panjang ditampilkan secara luas.
