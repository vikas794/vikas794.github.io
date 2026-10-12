// Asserts Lighthouse results against the budgets in PRD/DESIGN: performance,
// accessibility and SEO scores plus LCP and CLS. Usage: node scripts/check-lighthouse.mjs report.json
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: check-lighthouse.mjs <report.json>");
  process.exit(1);
}
const r = JSON.parse(readFileSync(file, "utf8"));

const checks = [
  ["performance score", r.categories.performance.score, (v) => v >= 0.9, "0.9"],
  ["accessibility score", r.categories.accessibility.score, (v) => v >= 0.95, "0.95"],
  ["seo score", r.categories.seo.score, (v) => v >= 0.95, "0.95"],
  ["LCP (ms)", r.audits["largest-contentful-paint"].numericValue, (v) => v < 2000, "< 2000"],
  ["CLS", r.audits["cumulative-layout-shift"].numericValue, (v) => v < 0.05, "< 0.05"],
];

let failed = false;
for (const [name, value, ok, want] of checks) {
  const pass = ok(value);
  if (!pass) failed = true;
  console.log(`${pass ? "ok  " : "FAIL"} ${name}: ${Number(value).toFixed(3)} (want ${want})`);
}
process.exit(failed ? 1 : 0);
