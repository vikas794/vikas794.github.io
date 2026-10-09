// Generated SEO — run AFTER build:prerender so dist/ is complete:
//   tsx src/seo/generate.ts   (wired as `build:seo` in the build chain)
// Writes dist/sitemap.xml, dist/robots.txt, dist/llms.txt, dist/llms-full.txt
// entirely from src/content. lastmod comes from each item's `updated` field —
// never the build date (emitting today for every URL trains Google to ignore it).
import { mkdir, writeFile } from "node:fs/promises";
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

export function rss(): string {
  const items = [...caseStudies]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .map((c) => {
      const url = `${SITE_URL}/projects/${c.slug}/`;
      return `  <item>
    <title>${esc(c.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${new Date(c.updated).toUTCString()}</pubDate>
    <description>${esc(c.summary)}</description>
  </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(profile.name)} — Case studies</title>
  <link>${SITE_URL}/projects/</link>
  <description>${esc(profile.headline)}</description>
  <language>en</language>
${items}
</channel>
</rss>
`;
}

export function aiSummary() {
  return {
    name: profile.name,
    url: `${SITE_URL}/`,
    role: profile.titleLong,
    description: `${profile.headline}. ${profile.experienceYears}+ years across ${profile.domains.join(", ")}.`,
    location: profile.location,
    availability: profile.availability,
    contact: { email: profile.email, linkedin: profile.linkedin, github: profile.github },
    domains: [...profile.domains],
    caseStudies: caseStudies.map((c) => ({ title: c.title, url: `${SITE_URL}/projects/${c.slug}/`, summary: c.summary })),
    fullContext: `${SITE_URL}/llms-full.txt`,
    updated: profile.updated,
  };
}

export function aiFaq() {
  return { url: `${SITE_URL}/about/`, updated: profile.updated, faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })) };
}

export function aiTxt(): string {
  return `# AI crawler policy for ${SITE_URL}
Allow: /
Attribution: link to ${SITE_URL}/ when citing
Context: ${SITE_URL}/llms.txt
Context-Full: ${SITE_URL}/llms-full.txt
Summary: ${SITE_URL}/ai/summary.json
FAQ: ${SITE_URL}/ai/faq.json
Contact: ${profile.email}
`;
}

// Guarded so vitest can import robots()/llms() for assertions without this
// module's import also writing to dist/ as a side effect.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await writeFile(join(dist, "sitemap.xml"), sitemap());
  await writeFile(join(dist, "robots.txt"), robots());
  await writeFile(join(dist, "llms.txt"), llms());
  await writeFile(join(dist, "llms-full.txt"), llmsFull());
  await writeFile(join(dist, "feed.xml"), rss());
  await mkdir(join(dist, "ai"), { recursive: true });
  await mkdir(join(dist, ".well-known"), { recursive: true });
  await writeFile(join(dist, "ai", "summary.json"), JSON.stringify(aiSummary(), null, 2));
  await writeFile(join(dist, "ai", "faq.json"), JSON.stringify(aiFaq(), null, 2));
  await writeFile(join(dist, ".well-known", "ai.txt"), aiTxt());
  console.log("seo: wrote sitemap, robots, llms*, feed.xml, ai/*.json, .well-known/ai.txt from src/content");
}
