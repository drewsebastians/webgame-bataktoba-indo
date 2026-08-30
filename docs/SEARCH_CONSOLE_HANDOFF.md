# Search Console Handoff — Batak Toba Play

**Prerequisite:** Final custom domain configured (see `wrangler.toml` `pages_build_output_dir=dist`, `site.config baseUrl`). Current: `https://webgame-bataktoba-indo.pages.dev/` (Pages default).

## Steps after domain
1. Ownership verification (DNS TXT or HTML file via Cloudflare).
2. Submit sitemap `https://<final>/sitemap.xml` (generated from `site.config:lastModified`, 15 URLs, excludes thin `angka 5`, `keluarga 0`, `sapaan 0`, `makanan 2`, `progres`).
3. Validate `robots.txt` `Allow: /` + `Sitemap:`.
4. Canonical validation (`check-site` ensures `rel=canonical` = `baseUrl`).
5. Inspect indexable: `/`, `/about/`, `/methodology/`, `/data-source/`, `/editorial-policy/`, `/correction-process/`, `/privacy/`, `/contact/`, `/dictionary/`, `/flashcards/`, `/games/`, `/learn/`, `/learn/adat-ringan/`, `/tips-diaspora/`, `/contributors/` (15). Noindex thin remains.
6. After first reviewed lesson/topic publication (need 8 pool + human review), sitemap gains `+1` and `contributors` etc. update; re-submit.

No account fabricated; steps executable only after domain/DNS external action.
