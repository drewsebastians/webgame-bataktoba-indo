# Reviewed Layer

Lapisan ini adalah satu-satunya jalur sah untuk mengubah status item menjadi
`human-reviewed`. Builder (`tools/build-learning-data.py`) membaca
`overrides.json` di folder ini dan menerapkannya ke kandidat sebelum
publikasi.

## Format `overrides.json`

```json
{
  "overrides": [
    {
      "itemId": "word-f31f8d24f2",
      "decision": "approve",
      "reviewer": "Nama atau referensi reviewer",
      "reviewedAt": "2026-08-25T00:00:00+00:00",
      "approvedMeaning": "pencuri (opsional - koreksi arti utama)",
      "approvedAlternatives": ["maling"],
      "themes": ["umum"],
      "difficulty": 1,
      "usageNote": "catatan pemakaian bila ada"
    }
  ]
}
```

Aturan:

- `decision`: `approve` | `reject` | `revise`.
- `approve` → item menjadi `human-reviewed` dengan atribusi reviewer.
- `reject` → item dikeluarkan sebelum publikasi.
- `revise` → status tetap candidate, catatan reviewer tersimpan di report.
- `reviewer` wajib diisi; tooling tidak pernah mengisi file ini secara
  otomatis dan tidak pernah membuat data review palsu.

Status saat ini: **kosong**. Semua materi publik masih `corpus-derived`
atau `beta-unreviewed`, dan itu tercermin jujur di seluruh situs.
