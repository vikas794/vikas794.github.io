// Pings IndexNow (Bing/Yandex, plus other engines sharing the same index)
// with every URL from the just-built sitemap, so a fresh deploy gets
// picked up for recrawl immediately instead of waiting for the next
// scheduled crawl. Best-effort: never fails the build (see deploy.yml,
// which runs this with continue-on-error: true).
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Kept as plain constants (not imported from src/seo/site.ts) so this
// script can run under plain `node`, same as scripts/prerender.mjs.
const SITE_URL = "https://vikas794.github.io";
const KEY = "30d0ff6a661046118bc260dddce10f28";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitemapPath = join(root, "dist", "sitemap.xml");

const xml = await readFile(sitemapPath, "utf8");
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  console.log("indexnow: no URLs found in sitemap, skipping ping");
  process.exit(0);
}

const host = new URL(SITE_URL).host;
const body = {
  host,
  key: KEY,
  keyLocation: `${SITE_URL}/${KEY}.txt`,
  urlList,
};

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`indexnow: pinged ${urlList.length} URLs, status ${res.status}`);
} catch (err) {
  console.log(`indexnow: ping failed (non-fatal): ${err.message}`);
}
