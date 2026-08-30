# Listening Audio Contract — Batak Toba Play

**Status:** Mode blocked `BLOCKED_EXTERNAL` per Blueprint §10.11 (no synthetic).

## Future metadata (when audio exists)
```json
{
  "audioId": "audio-word-f31f...",
  "itemId": "word-f31f...",
  "lessonId": "lesson-angka",
  "file": "assets/audio/word-f31f.mp3",
  "speaker": "Nama",
  "reviewer": "Nama",
  "language": "bbc",
  "license": "CC-BY-4.0",
  "attribution": "© Speaker",
  "recordedAt": "2026-08-30T00:00:00Z",
  "reviewedAt": "2026-08-30T00:00:00Z",
  "reviewStatus": "human-reviewed",
  "durationSec": 1.2,
  "transcript": "panangko"
}
```

## Builder rejects if missing
- `file` not found
- `license` not in `["CC-BY-4.0","CC-BY-SA-4.0","publicDomain"]` (allowlist)
- `attribution` when required
- `reviewStatus !== human-reviewed` or `reviewedAt` absent
- `transcript` != `item.batak` (mismatch)

No test audio leaks to `dist`; `tests/data/audio-contract.test` validates schema only with fixtures.
