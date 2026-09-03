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

// 404: both hosts serve a root 404.html with a 404 status automatically.
// The catch-all route already carries noindex via its manifest meta.
{
  const { head, rootHtml } = await render("/404/");
  const html = template
    .replace("<!--ssg-head-->", () => head)
    .replace('<div id="root"></div>', () => rootHtml);
  await writeFile(join(dist, "404.html"), html);
  console.log("prerendered /404/ -> dist/404.html");
}
