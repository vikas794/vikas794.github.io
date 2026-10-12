// Fails the build when first-load JS or CSS outgrows the budget in DESIGN.md.
// Run after `pnpm build`. First-load JS = every script the prerendered home
// page loads or preloads (lazy chunks like react-pdf and lenis are excluded).
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const DIST = "dist";
const JS_BUDGET_KB = 180;
const CSS_BUDGET_KB = 20;

const html = readFileSync(join(DIST, "index.html"), "utf8");
const refs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
const files = [...new Set(refs)];

let js = 0;
let css = 0;
for (const ref of files) {
  const path = join(DIST, ref);
  if (!existsSync(path)) continue;
  const size = gzipSync(readFileSync(path)).length;
  if (ref.endsWith(".js")) js += size;
  else css += size;
  console.log(`${(size / 1024).toFixed(1).padStart(7)} KB gz  ${ref}`);
}

const jsKb = js / 1024;
const cssKb = css / 1024;
console.log(`first-load JS ${jsKb.toFixed(1)} KB (budget ${JS_BUDGET_KB}), CSS ${cssKb.toFixed(1)} KB (budget ${CSS_BUDGET_KB})`);

if (files.length === 0) {
  console.error("budget check found no assets in dist/index.html; did the build run?");
  process.exit(1);
}
if (jsKb > JS_BUDGET_KB || cssKb > CSS_BUDGET_KB) {
  console.error("budget exceeded");
  process.exit(1);
}
