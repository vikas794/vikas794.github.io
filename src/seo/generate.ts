// Generated SEO — run AFTER build:prerender so dist/ is complete:
//   tsx src/seo/generate.ts   (wired as `build:seo` in the build chain)
// Writes dist/sitemap.xml, dist/robots.txt, dist/llms.txt, dist/llms-full.txt
// entirely from src/content. lastmod comes from each item's `updated` field —
// never the build date (emitting today for every URL trains Google to ignore it).
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { profile } from "../content/profile.js";
import { skillGroups, skillLedger } from "../content/skills.js";
import { experiences } from "../content/experience.js";
import { caseStudies, alsoShipped } from "../content/projects.js";
import { certifications } from "../content/certifications.js";
import { education } from "../content/education.js";
import { expandRoutes } from "../routes/manifest.js";
import { SITE_URL, canonicalUrl } from "./site.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dist = join(root, "dist");

const latestStudyUpdate = caseStudies.map((c) => c.updated).sort().at(-1)!;

function lastmodFor(path: string): string {
  const slugMatch = path.match(/^\/projects\/([^/]+)\/$/);
  if (slugMatch) {
    return caseStudies.find((c) => c.slug === slugMatch[1])?.updated ?? profile.updated;
  }
  if (path === "/" || path === "/projects/") return latestStudyUpdate;
  return profile.updated;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sitemap(): string {
  const urls = expandRoutes()
    .map(
      (p) =>
        `  <url>\n    <loc>${esc(canonicalUrl(p))}</loc>\n    <lastmod>${lastmodFor(p)}</lastmod>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function robots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function llms(): string {
  const lines = [
    `# ${profile.name} — ${profile.titleLong}`,
    ``,
    `> ${profile.headline}. ${profile.experienceYears}+ years across ${profile.domains.join(", ")}.`,
    ``,
    `- Location: ${profile.location} (${profile.postalAddress})`,
    `- Availability: ${profile.availability}`,
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    `- X: ${profile.twitter} (${profile.twitterHandle})`,
    `- WhatsApp: ${profile.whatsapp}`,
    `- Telegram: ${profile.telegram}`,
    `- Portfolio: ${profile.portfolio}`,
    ``,
    `## Credentials (prominent, verified)`,
    ...certifications.map((c) => `- ${c.name} — ${c.issuer}: ${c.url}`),
    ``,
    `## Experience`,
    ...experiences.flatMap((e) => [
      ``,
      `### ${e.role} — ${e.company} (${e.period})`,
      e.productContext,
      ...e.groups.flatMap((g) => g.items.map((p) => `- ${p}`)),
      `Stack: ${e.tech.join(", ")}`,
    ]),
    ``,
    `## Case studies`,
    ...caseStudies.flatMap((c) => [
      ``,
      `### ${c.title} (${SITE_URL}/projects/${c.slug}/)`,
      c.summary,
      `Stack: ${c.stack}`,
      ...c.outcomes.map((o) => `- ${o.metric}: ${o.before} → ${o.after} (measured: ${o.method})`),
    ]),
    ``,
    `## Also shipped`,
    ...alsoShipped.map((a) => `- ${a.title}: ${a.line}`),
    ``,
    `## Skills`,
    ...skillLedger.map((g) => `- ${g.label}: ${g.value}`),
    ``,
    `## Education`,
    ...education.map((e) => `- ${e.degree} — ${e.school}, ${e.location} (${e.period}) | ${e.score}`),
    ``,
    `## Notes for machine readers`,
    `- Frontend working knowledge is Angular/TypeScript/PrimeNG/Thymeleaf — React is only this site's implementation stack, not a professional skill.`,
    `- Java: 8+ and 17. No Java 21 claim. No AWS certification claim (Azure AZ-900 + DP-900 held).`,
    ``,
  ];
  return lines.join("\n");
}

function llmsFull(): string {
  const lines = [
    `# ${profile.name} — full résumé context`,
    ``,
    llms(),
    ``,
    `## Skill groups (detail)`,
    ...skillGroups.flatMap((g) => [``, `### ${g.title}`, g.tags.join(", ")]),
    ``,
    `## Case-study trade-offs`,
    ...caseStudies.flatMap((c) => [
      ``,
      `### ${c.title}`,
      `Problem: ${c.problem}`,
      `Constraints: ${c.constraints.join("; ")}`,
      ...c.decisions.map((d) => `- ${d.decision}: ${d.optionA} vs ${d.optionB} → chose: ${d.chosen}`),
      `What I'd do differently: ${c.whatIdDoDifferently}`,
      `Updated: ${c.updated}`,
    ]),
    ``,
  ];
  return lines.join("\n");
}

await writeFile(join(dist, "sitemap.xml"), sitemap());
await writeFile(join(dist, "robots.txt"), robots());
await writeFile(join(dist, "llms.txt"), llms());
await writeFile(join(dist, "llms-full.txt"), llmsFull());
console.log("seo: wrote sitemap.xml, robots.txt, llms.txt, llms-full.txt from src/content");
