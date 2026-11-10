# Public repository data exposure audit — corrected 2026-11-10

## Finding

The PUBLIC repository's current tree has no corpus snapshots in `data/raw`, `data/candidates`, `data/legacy` or `data/reports`; published learner datasets remain empty. A prior audit incorrectly stated that corpus-derived exports first appeared in August 2026. Read-only GitHub history checks show the public exposure began earlier, in July 2026.

## Current-tree containment

The current code checkpoint is PUBLIC main `8e7621ba187228c4da3bd5182315b279c4ec5ff0` / tree `0af84b5cd6b180d8fc857f417e99f0f94a7cc1b5`. The current tree excludes raw, candidate, legacy and quality snapshots plus editorial corpus artifacts; published learner pools remain empty and topic pages noindex. Exact-main Verify [#42798608420](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42798608420) passed its release checks, including 232 unit tests, 77 browser tests, fixture-isolation/publication checks and committed-dist drift. The check reported zero published learning items and no synthetic fixture markers in dist. Cloudflare Workers Builds reports production build `5f74bbd9-49d7-43a9-bbc8-4278b4772e9c` successful. Direct live-page readback remains NOT_VERIFIED.

## Historical Git and Pages exposure

- Public root commit `8742dcaa2a801d61794fa81eaa106a44a7f644db`, dated 2026-07-04, contains four corpus-derived JSON exports totaling 372,443 bytes. Their individual sizes were 164,440, 42,584, 36,839 and 128,580 bytes. This audit does not reproduce any linguistic forms or glosses.
- The earlier pre-containment commit `6b563267ed4973375ea8031910552d61ae324250` (tree `0b855047ca141d5178018787ea316b2047d271c5`) contains 17 raw/candidate/legacy/report/editorial files totaling 1,438,835 bytes. Containment commit `ed7c3ae3d22e1685bc31a61b3c027cd21d7254ea` removed these from the then-current tree.
- Successful GitHub Pages workflow run [28711125732](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/28711125732) deployed commit `042681827af650b6f983ffff0a6eefc39115039c` on 2026-07-04. The workflow at that revision uploaded repository root (`path: .`); its deployed tree included the four JSON exports. A later Pages workflow run [28806657947](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/28806657947) also succeeded on 2026-07-06.
- These records establish historical public Git exposure and successful root-path deployment; they do not establish whether any legacy Pages artifact remains reachable today. Direct legacy-artifact readback was unavailable.

## Handling and approval boundary

Current-tree containment is in place. No history rewrite, force push, repository visibility change or legacy deployment removal has been performed. History rewriting is destructive and requires explicit owner authorization; task A9 tracks that gate. Until then, preserve evidence, maintain prospective protections and do not claim historical objects or old deployments were purged.

## Evidence and readiness

- The exposure report contains only commit/run identifiers, aggregate file counts and byte sizes; no linguistic data is included.
- Public datasets remain empty and noindex. ENGINEERING_READY is verified; DATA_READY, PUBLICATION_READY and LEARNING_READY remain NO; MONETIZATION_READY is deferred.
- The current audit records known historical object/deployment exposure without claiming cleanup beyond the current tree.
