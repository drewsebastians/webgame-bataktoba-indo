# Production Launch Owner Handoff — Batak Toba Play

**Repository state:** Public-safe mode, 0 public linguistic items, licensing containment complete.
**All repository-solvable tasks:** Done.
**Only genuine external owner actions remain below.**

---

## 1. Corpus Licensing Resolution

| Field | Value |
|---|---|
| **ACTION** | Confirm or obtain legal permission to publish derived Batak Toba–Indonesian word/phrase/sentence pairs from `bible_batak_indo_v1.db` / `batak_alignment_canonical.sqlite` |
| **CURRENT STATUS** | `REQUIRES_LEGAL_REVIEW` — `publicationAllowed: false` (see `docs/CORPUS_LICENSING_STATUS.md`) |
| **WHY NEEDED** | Current canonical corpus (1.69 GB, SHA 3a34a54ddbe2) contains 591 qualified words, 60 phrases, 80 sentences. All are blocked from public exposure without license clearance. |
| **EXACT EVIDENCE REQUIRED** | Written confirmation from rights holder granting: (a) derivative work creation, (b) public redistribution, (c) commercial use (AdSense), (d) attribution requirements. |
| **WHERE ENTERED** | `data/sources/alignment-engine-manifest.json` → update `licenseStatus` to `APPROVED_FOR_INGESTION` and `publicationAllowed: true` |
| **NEXT AUTOMATION** | `npm run content:publish` (DB-independent) → publishes qualified items to `data/published/` → `npm run build:seo && npm run build && npm run verify:release` |
| **SUCCESS VERIFICATION** | `data/published/word-pairs.json` shows >0 items; `npm run check` passes; homepage stats update from 0 |
| **WHAT IT BLOCKS** | All public linguistic content, lessons, SEO topic indexability, AdSense substantive content requirement |

---

## 2. Custom Domain (Optional)

| Field | Value |
|---|---|
| **ACTION** | Configure custom domain (e.g., `bataktoba.play`) in Cloudflare Pages + DNS |
| **CURRENT STATUS** | Deployed on `https://webgame-bataktoba-indo.pages.dev/` (Pages default) |
| **WHY NEEDED** | Professional branding, Search Console property ownership, AdSense site review |
| **EXACT EVIDENCE REQUIRED** | DNS control for target domain; Cloudflare Pages custom domain setup |
| **WHERE ENTERED** | Cloudflare Dashboard → Pages → Custom domains; `tools/site.config.json:baseUrl` update; `wrangler.toml` if needed |
| **NEXT AUTOMATION** | Update `baseUrl` in `tools/site.config.json` → `npm run build:seo && npm run build && npm run verify:release` (regenerates sitemap, canonical, OG URLs) |
| **SUCCESS VERIFICATION** | New domain serves `dist/`; `robots.txt` and `sitemap.xml` reflect new origin; canonical tags match |
| **WHAT IT BLOCKS** | Search Console verification, AdSense site review, professional SEO |

---

## 3. Google Search Console Ownership

| Field | Value |
|---|---|
| **ACTION** | Verify site ownership in Google Search Console for final domain |
| **CURRENT STATUS** | Not verified (requires domain/DNS access) |
| **WHY NEEDED** | Submit sitemap, monitor indexing, fix coverage issues |
| **EXACT EVIDENCE REQUIRED** | DNS TXT record or HTML file upload access to verified property |
| **WHERE ENTERED** | Google Search Console property settings |
| **NEXT AUTOMATION** | Submit `https://<final-domain>/sitemap.xml` (15 URLs, no thin topics) |
| **SUCCESS VERIFICATION** | Search Console shows "Ownership verified"; sitemap submitted; indexable pages discovered |
| **WHAT IT BLOCKS** | Organic search visibility, SEO monitoring |

---

## 4. Analytics Provider Decision

| Field | Value |
|---|---|
| **ACTION** | Select and configure analytics provider (GA4, Plausible, Umami, Matomo, or none) |
| **CURRENT STATUS** | `INTENTIONALLY_DISABLED / READY_FOR_OWNER_DECISION` — `assets/js/analytics.js` adapter default OFF, allowlist defined, consent gate in `/progres/` |
| **WHY NEEDED** | No provider selected by default; zero third-party calls while OFF |
| **EXACT EVIDENCE REQUIRED** | Provider ID (e.g., `G-XXXXXXXXXX`) + privacy policy update if personal data processed |
| **WHERE ENTERED** | `tools/site.config.json` (add `analyticsProvider`, `analyticsId`) → `assets/js/config.js` at build via `build-dist.mjs` |
| **NEXT AUTOMATION** | `npm run build && npm run verify:release` — validates no PII, consent gate functional |
| **SUCCESS VERIFICATION** | Network tab: zero analytics requests without consent; with consent + provider → allowlisted events only |
| **WHAT IT BLOCKS** | KPI measurement (meaningful sessions, retention, lesson completion) |

---

## 5. CMP / Consent Decision

| Field | Value |
|---|---|
| **ACTION** | Decide if CMP (Consent Management Platform) is required for target jurisdictions |
| **CURRENT STATUS** | `CMP NOT REQUIRED IN CURRENT MODE` — ads OFF, analytics OFF, third-party requests = 0 |
| **WHY NEEDED** | Legal requirement only if third-party cookies/personal data processing activated |
| **EXACT EVIDENCE REQUIRED** | Legal determination for target markets (EU/GDPR, CCPA, etc.) |
| **WHERE ENTERED** | If needed: integrate certified CMP (e.g., Usercentrics, Didomi, OneTrust) → update `/progres/` consent UI + `analytics.js`/`ads.js` consent gate |
| **NEXT AUTOMATION** | `npm run verify:release` — validates consent gate blocks events without consent |
| **SUCCESS VERIFICATION** | With CMP: consent UI appears; without consent → no third-party scripts load |
| **WHAT IT BLOCKS** | AdSense activation (if CMP legally required), analytics activation |

---

## 6. AdSense Activation

| Field | Value |
|---|---|
| **ACTION** | Create AdSense account, obtain Publisher ID, pass site review, deploy `ads.txt` |
| **CURRENT STATUS** | Component ready (`ads.js` inert by default); no Publisher ID; `ads.txt` generator fail-closed |
| **WHY NEEDED** | Monetization; requires substantive published content + privacy + consent + domain |
| **EXACT EVIDENCE REQUIRED** | Valid `ca-pub-XXXXXXXXXXXXXXXX` (16 digits); Google AdSense approval email; `ads.txt` on root |
| **WHERE ENTERED** | `tools/site.config.json:adsensePublisherId` + `assets/js/config.js` at build; `npm run build:ads-txt` → `dist/ads.txt` |
| **NEXT AUTOMATION** | `npm run build:ads-txt` (validates ID format, exits non-zero on placeholder) → `npm run build && npm run verify:release` |
| **SUCCESS VERIFICATION** | `dist/ads.txt` contains real Publisher ID; ads load on pages with placements; no blank placeholders |
| **WHAT IT BLOCKS** | Ad revenue; requires corpus licensing + custom domain + Search Console + substantive content |

---

## 7. Licensed Audio for Listening Mode

| Field | Value |
|---|---|
| **ACTION** | Acquire or record licensed Batak Toba audio with metadata |
| **CURRENT STATUS** | `LISTENING: BLOCKED_EXTERNAL` — no audio assets, no fake TTS |
| **WHY NEEDED** | Listening game mode requires genuine speaker audio + license + transcript |
| **EXACT EVIDENCE REQUIRED** | Per audio file: (a) audio ID, (b) source/speaker provenance, (c) license granting publication + commercial use, (d) linked learning item ID, (e) transcript, (f) format/duration, (g) attribution |
| **WHERE ENTERED** | `data/published/audio-manifest.json` (new) → `tools/build-dist.mjs` copies to `dist/assets/audio/` |
| **NEXT AUTOMATION** | `npm run build && npm run verify:release` — validates manifest schema, no fake audio |
| **SUCCESS VERIFICATION** | Audio plays in listening mode; manifest matches files; license documented |
| **WHAT IT BLOCKS** | Listening game mode (Blueprint §10.11) |

---

## Summary: Minimal Owner Action List

| Priority | Action | Blocks |
|---|---|---|
| 1 | Corpus licensing resolution | All linguistic content, lessons, SEO, AdSense |
| 2 | Custom domain (if desired) | Search Console, AdSense, professional SEO |
| 3 | Search Console ownership | Index monitoring, sitemap submission |
| 4 | Analytics provider decision | KPI measurement |
| 5 | CMP decision (if legally required) | AdSense, analytics activation |
| 6 | AdSense account + approval | Monetization |
| 7 | Licensed audio acquisition | Listening mode |

**No human linguistic review is required at any stage.** Publication eligibility = `source-evidence-qualified` (automated) + `publicationAllowed: true` (legal).