// Plain Node ESM — no tsx. Imports the BUILT dist-ssr/entry-server.js
// so it cannot drift from what ships.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const { render, routePaths } = await import("../dist-ssr/entry-server.js");

// Read BEFORE writing anything: "/" overwrites dist/index.html itself.
const template = await readFile(join(dist, "index.html"), "utf8");
if (!template.includes("<!--ssg-head-->")) throw new Error("prerender: <!--ssg-head--> missing in dist/index.html");
if (!template.includes('<div id="root"></div>')) throw new Error("prerender: #root placeholder missing in dist/index.html");

function outPathFor(route) {
  if (route === "/") return join(dist, "index.html");
  const clean = route.replace(/^\/|\/$/g, "");
  return join(dist, clean, "index.html");
}

async function writeRoute(route) {
  const { head, rootHtml } = await render(route);
  const html = template.replace("<!--ssg-head-->", () => head).replace('<div id="root"></div>', () => rootHtml);
  const outPath = outPathFor(route);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  console.log(`prerendered ${route} -> ${outPath}`);
}

for (const route of routePaths) {
  await writeRoute(route);
}

// Error pages prerendering (400, 401, 403, 404, 500, 502, 503)
const errorCodesToPrerender = ["400", "401", "403", "404", "500", "502", "503"];

for (const code of errorCodesToPrerender) {
  const route = `/error/${code}/`;
  const { head, rootHtml } = await render(route);
  const html = template
    .replace("<!--ssg-head-->", () => head)
    .replace('<div id="root"></div>', () => rootHtml);

  // Also render specific html file for root server compatibility (e.g., 404.html, 500.html)
  await writeRoute(route);
  const fileName = `${code}.html`;
  await writeFile(join(dist, fileName), html);
  console.log(`prerendered ${route} -> dist/${fileName}`);
}
