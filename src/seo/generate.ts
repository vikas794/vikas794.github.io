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
import { faqs } from "../content/faq.js";
import { routes, expandRoutes } from "../routes/manifest.js";
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

// AI-answer-engine crawlers get their own explicit Allow blocks (in addition
// to the wildcard below) so the invitation is unambiguous for AEO purposes.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "CCBot",
  "Bingbot",
];

export function robots(): string {
  const aiBlocks = AI_CRAWLERS.map((ua) => `User-agent: ${ua}\nAllow: /\n`).join("\n");
  return `${aiBlocks}\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

export function llms(): string {
  const lines = [
    `# ${profile.name} — ${profile.titleLong}`,
    ``,
    `> ${profile.headline}. ${profile.experienceYears}+ years across ${profile.domains.join(", ")}.`,
    ``,
    `- Location: ${profile.location} (${profile.postalAddress})`,
    `- Availability: ${profile.availability}`,
    `- Email: [${profile.email}](mailto:${profile.email})`,
    `- LinkedIn: [${profile.linkedinDisplay}](${profile.linkedin})`,
    `- GitHub: [${profile.githubDisplay}](${profile.github})`,
    `- X: [${profile.twitterHandle}](${profile.twitter})`,
    `- WhatsApp: [Chat on WhatsApp](${profile.whatsapp})`,
    `- Telegram: [${profile.telegramDisplay}](${profile.telegram})`,
    `- Portfolio: [${profile.portfolio}](${profile.portfolio})`,
    ``,
    `## Pages`,
    ...routes
      .filter((r) => r.path !== "*" && !r.path.includes(":"))
      .map((r) => `- [${r.meta.title}](${canonicalUrl(r.path)}): ${r.meta.description}`),
    ``,
    `## Key Summary & Capabilities`,
    `- Primary Expertise: Enterprise Java Backend Engineering (Java 8-25, Spring Boot 3 & 4, REST APIs, Security, Scalability).`,
    `- Proven Record: High-throughput tick processing (1,000s sessions), healthcare system optimization (+30% throughput, -150ms latency), SQL-injection hardening (30+ modules).`,
    `- Certifications: Microsoft Certified Azure Fundamentals (AZ-900), Azure Data Fundamentals (DP-900), Google Cloud GenAI.`,
    ``,
    `## Credentials (prominent, verified)`,
    ...certifications.map((c) => `- [${c.name}](${c.url}) — ${c.issuer}`),
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
      `### [${c.title}](${SITE_URL}/projects/${c.slug}/)`,
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
    `## Frequently Asked Questions (AEO Context)`,
    ...faqs.map((f) => `- Q: ${f.question} A: ${f.answer}`),
    ``,
    `## Notes for machine readers`,
    `- Frontend working knowledge is Angular/TypeScript/PrimeNG/Thymeleaf — React is only this site's implementation stack, not a professional skill.`,
    `- Java: 8 through 25, with Spring Boot 4 current. No AWS certification claim (Azure AZ-900 + DP-900 held).`,
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

// Guarded so vitest can import robots()/llms() for assertions without this
// module's import also writing to dist/ as a side effect.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await writeFile(join(dist, "sitemap.xml"), sitemap());
  await writeFile(join(dist, "robots.txt"), robots());
  await writeFile(join(dist, "llms.txt"), llms());
  await writeFile(join(dist, "llms-full.txt"), llmsFull());
  console.log("seo: wrote sitemap.xml, robots.txt, llms.txt, llms-full.txt from src/content");
}
