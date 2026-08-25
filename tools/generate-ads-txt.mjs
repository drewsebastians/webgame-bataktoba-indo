import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Generates a production ads.txt ONLY when tools/site.config.json contains a
 * valid AdSense Publisher ID. Refuses placeholder IDs; never creates a fake
 * production ads.txt.
 */

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
const publisherId = config.adsensePublisherId ?? "";

if (!/^ca-pub-\d{16}$/.test(publisherId)) {
  console.error(
    `REFUSED: adsensePublisherId "${publisherId}" is not a valid ca-pub-XXXXXXXXXXXXXXXX ID. ` +
      "Set it in tools/site.config.json first.",
  );
  process.exit(1);
}

const line = `google.com, ${publisherId.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
const target = join(root, "ads.txt");
if (existsSync(target)) {
  const existing = readFileSync(target, "utf8");
  if (!existing.includes(publisherId)) {
    console.error("REFUSED: ads.txt exists with a different Publisher ID; review manually.");
    process.exit(1);
  }
}
writeFileSync(target, `${line}\n`, "utf8");
console.log(`ads.txt generated for ${publisherId}.`);
