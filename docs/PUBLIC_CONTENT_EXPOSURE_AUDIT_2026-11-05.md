# Public content exposure audit — 2026-11-05

## Scope and method

This is a public-repository metadata and content-shape audit. It contains no recovered linguistic text or private-repository material.

- Repository visibility: public. Default branch: `main`.
- Main baseline: commit `53d61320c1853539b316d892469edeca562d9a36`; tree `621eeb357bf3993629cc48943b9424760e85e0c8`.
- Covered 338 commits reachable from main and branch heads, 247 distinct trees, all 91 branch heads, and all 90 pull-request head refs. All 247 tree snapshots were fetched without tree errors.
- Path/size metadata covered 581 text-file path/blob versions. An ephemeral in-memory scanner parsed 532 unique UTF-8 `.json`, `.csv`, `.tsv`, `.txt`, and `.md` blobs; 0 fetch or parse errors. Record values were not emitted or persisted by the scanner.
- The general JSON schema scan found 85 path/blob versions with bilingual/text-shaped keys. CSV and Markdown schema-pattern hits: 0. A separate shape scan was applied to all 18 `data/raw` blobs because their text-field names do not match the general key heuristic.
- Counts are snapshots/path/blob versions, not counts of unique language items. The scanner does not assess correctness, licensing, permission, attribution sufficiency, or whether unrecognized field names conceal text. Binary files, content outside the scanned file extensions, unreachable Git objects, and fork repositories were not scanned.

## Main and build at audit baseline

- Main tree at the scan baseline contains no `data/raw`, `data/candidates`, or `data/legacy` paths.
- At the scan baseline, `data/published` and `dist/data/published`: 0 word-pair items, 0 phrase-pair items, 0 sample-sentence items, 0 learning items, and 0 published lessons.
- Thin lesson-topic routes remain noindex. Dictionary and data-source entrypoints remain indexable per the active product plan; “empty catalog” does not mean every route is noindex.
- Main Verify run `41948552063` succeeded; Cloudflare Workers Builds check `126987216922` succeeded. The unexpired verified site artifact is `verified-public-site-dist-41948552063`, artifact ID `13379563643`, 120,002 bytes.
- The CI artifact is build evidence. Direct live Pages route readback was not performed in this audit; live production content remains NOT_VERIFIED.

## Historical JSON shape classifications

The general scanner classified matching JSON records by field-name and value type only. The table gives each positive path family’s number of matching path/blob versions and the largest parsed record count observed, with the commit/blob metadata for that largest snapshot. These findings are not rights clearance.

| Path | Matching versions | Max records | Commit | Blob | Bytes | Classification |
|---|---:|---:|---|---|---:|---|
| `content/curated/draft-vocabulary.json` | 2 | 29 | `6b563267ed4973375ea8031910552d61ae324250` | `08e488016af60ebdb35a213f12144b075a9a91ee` | 2115 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `content/themes/keywords.json` | 1 | 6 | `6b563267ed4973375ea8031910552d61ae324250` | `5bb64ce16ed9c04c80a72a0fed8be0dcbd95a1f1` | 2178 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/candidates/lesson-drafts.json` | 6 | 25 | `5e9c23937bef2ebe0bd46e9f792cd9da4d31bef8` | `47b71ecdd446ca7fa43613c289771c9a1d77189a` | 8286 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/candidates/sample-sentences.json` | 6 | 80 | `6b563267ed4973375ea8031910552d61ae324250` | `e4a7dc3f2ae0574e5dca5a4dce5520884eb066c4` | 37274 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/candidates/word-pairs.json` | 6 | 367 | `6b563267ed4973375ea8031910552d61ae324250` | `6294ffe38889b53ae16bb1c27bb5c7f93fc71c28` | 239011 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/learning-items.json` | 2 | 456 | `49683cb93dc5d1f7fac863c858590bf70c2edb4f` | `43cb097bb4fd1d6920845036caf79601ce107f8b` | 182304 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/legacy/learning-items.json` | 1 | 456 | `6b563267ed4973375ea8031910552d61ae324250` | `43cb097bb4fd1d6920845036caf79601ce107f8b` | 182304 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/legacy/phrase-pairs.json` | 1 | 120 | `6b563267ed4973375ea8031910552d61ae324250` | `5cbff84f06fa313cae94eb22de6bba5e9e06e735` | 47264 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/legacy/sample-sentences.json` | 1 | 80 | `6b563267ed4973375ea8031910552d61ae324250` | `cbefb63df4a674f6261054cd636cbb0dee50a9e1` | 40039 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/legacy/word-pairs.json` | 1 | 376 | `6b563267ed4973375ea8031910552d61ae324250` | `28b2f836ef062287ebd8242712c05d280c354f8b` | 143244 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/phrase-pairs.json` | 2 | 120 | `49683cb93dc5d1f7fac863c858590bf70c2edb4f` | `5cbff84f06fa313cae94eb22de6bba5e9e06e735` | 47264 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/published/learning-items.json` | 8 | 731 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `f86d4cbeec674ca6367dc18f41e6c1c397b0a86c` | 771905 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/published/lessons.json` | 1 | 25 | `979b2bed6aacab2c7205e2c90cab43c6c4c5fc64` | `119b7c525d12589b5cc59a3ecb6c489bd7292ab2` | 8303 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/published/phrase-pairs.json` | 1 | 60 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `0eb232f8514097430496fc44cb5a29c7b3a125d4` | 60898 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/published/sample-sentences.json` | 7 | 80 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `af24795565b4ffffcf692342bf4ecd27ecf62260` | 39984 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/published/word-pairs.json` | 8 | 591 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `6b81669fa37e8bda95fd03bebacd55910e2ffaf4` | 675643 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/reports/quality-conflicts.json` | 2 | 14 | `6b563267ed4973375ea8031910552d61ae324250` | `dacd019a69a5230f05ad991e9a38d24b8152e039` | 13745 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/reports/quality-status.json` | 2 | 14 | `6b563267ed4973375ea8031910552d61ae324250` | `6401c4619e491404264866a0045a97759659b849` | 6343 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/sample-sentences.json` | 2 | 80 | `49683cb93dc5d1f7fac863c858590bf70c2edb4f` | `cbefb63df4a674f6261054cd636cbb0dee50a9e1` | 40039 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `data/word-pairs.json` | 2 | 376 | `49683cb93dc5d1f7fac863c858590bf70c2edb4f` | `28b2f836ef062287ebd8242712c05d280c354f8b` | 143244 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `dist/data/published/learning-items.json` | 6 | 731 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `f86d4cbeec674ca6367dc18f41e6c1c397b0a86c` | 771905 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `dist/data/published/phrase-pairs.json` | 1 | 60 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `0eb232f8514097430496fc44cb5a29c7b3a125d4` | 60898 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `dist/data/published/sample-sentences.json` | 5 | 80 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `af24795565b4ffffcf692342bf4ecd27ecf62260` | 39984 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `dist/data/published/word-pairs.json` | 6 | 591 | `181c120327a3f2eeb0a19b47d70353666c4b46c5` | `6b81669fa37e8bda95fd03bebacd55910e2ffaf4` | 675643 | JSON schema-shaped bilingual/text fields; rights and publication status unverified |
| `tests/fixtures/lesson-fixture.json` | 3 | 8 | `53d61320c1853539b316d892469edeca562d9a36` | `a088da17762ce77fc61a02c1bf545301bbc0fe15` | 2308 | synthetic/test-only by path; marker co-occurrence checked separately |
| `tests/fixtures/source-synthetic-angka.json` | 2 | 3 | `53d61320c1853539b316d892469edeca562d9a36` | `76793b8bcc8d665e8e74db50ed7023ceb6cd7dcc` | 773 | synthetic/test-only by path; marker co-occurrence checked separately |

The 5 `tests/fixtures/` path/blob versions are test-only by repository path and carry record-shaped fixture payloads. Other positive matches are linguistic/text-shaped historical records, not verified as synthetic. All non-test matches remain rights/quality-indeterminate. The remaining scanned blobs had no recognized schema match; that is not proof they contain no linguistic content.

## Raw candidate snapshots and rights/provenance fields

All 18 unique `data/raw` path/blob snapshots parsed successfully. Six snapshots are each associated with the commits below. Each snapshot contains 2,000 sentence candidate rows and 764 word candidate rows; the phrase file is an empty placeholder. These are repeated snapshot counts, not unique-record totals.

| Commit | Tree | `data/raw/sentence-candidates.json` blob | `data/raw/word-candidates.json` blob | `data/raw/phrase-candidates.json` blob |
|---|---|---|---|---|
| `316419e8b0ba4bacbfbcb7a4696be97940755d53` | `199025150320c499c667212da027eb329dea9297` | `405282733daaec68d5b3e58608cf2c3394c04a58` (438982; 2,000 rows) | `7e0f6b4035c84451da6c529f7cfb922f4db24a75` (276731; 764 rows) | `4586fc4a2d98ef486c076c5b195b381d320839ff` (64; 0 rows) |
| `3de902a64bc04e83b1acd19d01737a273f290b9e` | `cf568cdfec200d0c9bfd480b13a30b42e8e5c6b9` | `2c74afdf71f77051cb02198badaaabd0356f9caa` (438982; 2,000 rows) | `9929b78e7469f3f2f68a74b7767962b2b78bd793` (276731; 764 rows) | `7404c80138db124e58ff4490c2a8ea6b9f3c4bef` (64; 0 rows) |
| `60d2b55fbe31ccc8834b96161d90e47d76f47afc` | `d7d2d130f8943d79b49002a98266fa31f2dddc3a` | `492a946293f0633039d0757dd32624a27970a48c` (438982; 2,000 rows) | `26b13a45735b6c0c9a7783c8106a3efd34525a98` (276731; 764 rows) | `8294d9ca3ac5c8153bf824b0a025d8e4ca46b8fa` (64; 0 rows) |
| `6b563267ed4973375ea8031910552d61ae324250` | `0b855047ca141d5178018787ea316b2047d271c5` | `f93b42b207e5e9fd52a9e42c163a96add3d0e1a3` (438982; 2,000 rows) | `80029d3bc299c08a5056d8f7d34a9a4b507a78bb` (276731; 764 rows) | `adc51af1cf84706ddbc7dd0b5d62ab9ce782aab7` (64; 0 rows) |
| `979b2bed6aacab2c7205e2c90cab43c6c4c5fc64` | `a329fcceeff4e5abea4620a91b4327d76470c9f1` | `0d441366d7dc5a39faa56767db2460ed586c9890` (438982; 2,000 rows) | `e58e95e7b4f9ff879dc13f001f36a4dd68fc5484` (276731; 764 rows) | `4794c7cf1741983c35d818e18597180a840e9783` (64; 0 rows) |
| `e6cbd23f52a16ac517c0b3ac9b2cdcf5c8954b39` | `d2ddb15f1e6acf6bf3b54338324b058e6ad92b68` | `526018dd4959816223de8c756cff8785b4352a13` (438982; 2,000 rows) | `1eaf674b3a97592dc77ffe501c55eed77fc3ef4e` (276731; 764 rows) | `d115c066accbeb942b10c3d790fc33b5a631cfed` (64; 0 rows) |

- Sentence rows contain text-bearing fields and a passage-locator field; 2,000/2,000 rows per snapshot have that locator. The locator does not supply a source ID, source URL, citation, artifact URI, or evidence record.
- Word rows contain candidate text fields and generation/confidence metadata, but no source ID, URL, source family, provenance, citation, or evidence reference.
- Across all 18 blobs, records with source ID, source URL, source-family, provenance/evidence, license, permission, rights, publication-eligibility, or HUMAN_REVIEWED fields: 0. Rights-status values classed as allowed/permitted/approved, restricted, or pending/unknown: 0 because those fields are absent. This is unassessed rights status, not evidence of clearance.
- No synthetic markers occur in the raw candidate blobs. Absence of a synthetic marker does not establish that candidate records are genuine or cleared.

## Synthetic marker co-occurrence

Marker counts below are occurrences across distinct path/blob content snapshots after blob deduplication, not occurrences across every commit/tree that reuses a blob. Markers co-occur with record-shaped payloads in three fixture blobs; the two documentation blobs have no JSON records. The synthetic-only fixture payloads are confined to `tests/fixtures/` in the current tree and were excluded from the CI public dist.

| Path | Commit | Blob | JSON records | Marker category counts |
|---|---|---|---:|---|
| `docs/UPSTREAM_WEBGAME_DATA_HANDOFF.md` | `53d61320c1853539b316d892469edeca562d9a36` | `7e39310a814c7efe402da4232fd3d1d7a6708b00` | 0 | synthetic_test_only=1 |
| `tests/fixtures/lesson-fixture.json` | `53d61320c1853539b316d892469edeca562d9a36` | `a088da17762ce77fc61a02c1bf545301bbc0fe15` | 8 | synthetic_test_only=1; synthetic_bt_prefix=8; synthetic_id_prefix=9; synthetic_status=9 |
| `tests/fixtures/source-synthetic-angka.json` | `53d61320c1853539b316d892469edeca562d9a36` | `76793b8bcc8d665e8e74db50ed7023ceb6cd7dcc` | 3 | synthetic_test_only=1; synthetic_bt_prefix=3; synthetic_id_prefix=3; synthetic_status=1 |
| `tests/fixtures/lesson-fixture.json` | `5f9aeb03b3f1db8c82a23032fb1776be7878b0a4` | `bcbc8f163504a69c257b139731c8986fa01fd7a1` | 8 | synthetic_bt_prefix=8; synthetic_id_prefix=9; synthetic_status=9 |
| `docs/UPSTREAM_WEBGAME_DATA_HANDOFF.md` | `3ff59a4e55213b6031a488d2721301cc3afc4d23` | `32f0f18d1aab35bbcec9471016103257d79096e2` | 0 | synthetic_test_only=1 |

Aggregate marker occurrences: `SYNTHETIC_TEST_ONLY` 4; `SYNTHETIC_BT_` 19; `SYNTHETIC_ID_` 21; `synthetic-test-only` 19. The current main dist marker test passed in Verify run `41948552063`.

## Reachability and public refs

- All 18 raw candidate blob SHAs appear in the main commit history’s six raw-data tree snapshots listed above. Removing a branch ref alone would not remove these blobs from main history.
- All branch heads and PR head refs were checked by exact head SHA and tree. Exactly one non-main branch/PR head contains raw/candidate/legacy paths: merged PR #1 branch `docs/browser-parallel-roadmap-20261031`, head commit `059b7f15d32b1365957c03863ddefdd1819f63f5`, tree `0b855047ca141d5178018787ea316b2047d271c5`. The head commit is not an ancestor of current main; the same raw blobs remain reachable in main’s history. The other 89 PR heads contain none of those paths.
- Files at that branch/PR head (paths, blob SHAs, and sizes only):

| Path | Blob | Bytes |
|---|---|---:|
| `data/candidates/lesson-drafts.json` | `25aab055df699694c2a1388bbcac988ea3693559` | 6076 |
| `data/candidates/phrase-pairs.json` | `4370f80f53252afc448ef79c1e75564c989c20c9` | 1172 |
| `data/candidates/sample-sentences.json` | `e4a7dc3f2ae0574e5dca5a4dce5520884eb066c4` | 37274 |
| `data/candidates/word-pairs.json` | `6294ffe38889b53ae16bb1c27bb5c7f93fc71c28` | 239011 |
| `data/legacy/learning-items.json` | `43cb097bb4fd1d6920845036caf79601ce107f8b` | 182304 |
| `data/legacy/phrase-pairs.json` | `5cbff84f06fa313cae94eb22de6bba5e9e06e735` | 47264 |
| `data/legacy/sample-sentences.json` | `cbefb63df4a674f6261054cd636cbb0dee50a9e1` | 40039 |
| `data/legacy/word-pairs.json` | `28b2f836ef062287ebd8242712c05d280c354f8b` | 143244 |
| `data/raw/phrase-candidates.json` | `adc51af1cf84706ddbc7dd0b5d62ab9ce782aab7` | 64 |
| `data/raw/sentence-candidates.json` | `f93b42b207e5e9fd52a9e42c163a96add3d0e1a3` | 438982 |
| `data/raw/word-candidates.json` | `80029d3bc299c08a5056d8f7d34a9a4b507a78bb` | 276731 |

## CI regression guard

The existing Verify workflow invokes `npm run verify:release`; `verify:core` runs build before unit tests. Existing checks already reject data directories in the source tree and synthetic markers in dist. This audit adds two explicit assertions:
- `tests/data/artifact.test.mjs`: include `data/legacy` among paths forbidden in dist.
- `tests/data/regression-guards.test.mjs`: assert both source and built dist published item arrays and lesson publication arrays remain empty; assert dist exists at test time.

Related existing gates: `tests/data/data-quality.test.mjs` (“no corpus snapshots remain in the public working tree”), `tests/data/synthetic-isolation.test.mjs` (“synthetic test fixture markers never appear in public dist”), and `.github/workflows/verify.yml` (“Full verification”).

## Blocker and next action

Historical content remains reachable from public main history and from merged PR #1’s branch head. No branch was deleted and no history was rewritten. Explicit owner approval is required before any remote-ref deletion or history rewrite; preserving historical evidence while keeping current main/build empty is the current state. Continue independent website work and keep live Pages readback NOT_VERIFIED until inspected through an available surface.


## Post-merge guard checkpoint

- The history scan above used main baseline `53d61320c1853539b316d892469edeca562d9a36`. The audit report and guard changes merged in PR #92 as `a7dbb578ccd7326c82944c7621437a7a76f06152`; final tree: `51b2f34001248cd8a2118412b72a1e66f84ed6b2`.
- Exact-head PR Verify run `41959632333` and Workers Builds check `127022450727` completed successfully. Post-merge main Verify run `41960577426` and Workers Builds check `127026190992` also completed successfully.
- Post-merge verified public dist artifact `verified-public-site-dist-41960577426`, artifact ID `13384727740`, size 120,002 bytes. Direct live Pages route readback remains NOT_VERIFIED.
- Local targeted tests were not run because network cloning was blocked by DNS and the PowerShell launcher was blocked by the managed sandbox; the exact-head PR CI completed the full verification workflow successfully.
- No source corpus values were added. Current published source and dist item arrays and lesson arrays remain empty. A11 (audit and guard) is complete; A12 (history/reference disposition) remains `blocked_approval`.
