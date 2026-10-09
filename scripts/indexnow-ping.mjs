// Pings IndexNow (Bing/Yandex, plus other engines sharing the same index)
// so a fresh deploy gets picked up for recrawl immediately instead of
// waiting for the next scheduled crawl. Only URLs whose page content
// changed since the previous deploy are sent (any change under src/ or
// public/ outside content pages falls back to the whole sitemap). Skips
// the ping entirely when nothing relevant changed (e.g. scheduled rebuilds).
// Best-effort: never fails the build (deploy.yml runs this with
// continue-on-error: true).
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const KEY = "30d0ff6a661046118bc260dddce10f28";

// Single source of truth for the site URL: parse it out of src/seo/site.ts
// so this script still runs under plain `node` (no TS loader needed).
const siteSrc = await readFile(join(root, "src", "seo", "site.ts"), "utf8");
const SITE_URL = siteSrc.match(/SITE_URL\s*=\s*"([^"]+)"/)?.[1];
if (!SITE_URL) {
  console.log("indexnow: could not read SITE_URL from src/seo/site.ts, skipping");
  process.exit(0);
}

const xml = await readFile(join(root, "dist", "sitemap.xml"), "utf8");
const allUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (allUrls.length === 0) {
  console.log("indexnow: no URLs found in sitemap, skipping ping");
  process.exit(0);
}

function changedFiles() {
  const before = process.env.GITHUB_EVENT_BEFORE;
  const range =
    before && !/^0+$/.test(before) ? `${before}..HEAD` : "HEAD~1..HEAD";
  try {
    return execFileSync("git", ["diff", "--name-only", range], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean);
  } catch {
    return null; // unknown -> ping everything
  }
}

const files = changedFiles();
let urlList = allUrls;
if (files) {
  const relevant = files.filter((f) => /^(src|public)\//.test(f));
  if (relevant.length === 0) {
    console.log("indexnow: no site content changed, skipping ping");
    process.exit(0);
  }
  const onlyProjects = relevant.every((f) => /projects\.ts$|ProjectDetailPage/.test(f));
  if (onlyProjects) urlList = allUrls.filter((u) => /\/projects\//.test(u));
}

const host = new URL(SITE_URL).host;
const body = { host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList };

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
