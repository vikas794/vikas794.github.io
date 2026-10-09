import { describe, it, expect } from "vitest";
import { robots, llms, rss, aiFaq, aiSummary } from "./generate";
import { faqs } from "../content/faq";

describe("generated SEO files", () => {
  it("robots.txt explicitly allows AI answer-engine crawlers", () => {
    const out = robots();
    for (const ua of ["GPTBot", "ChatGPT-User", "Google-Extended", "ClaudeBot", "PerplexityBot"]) {
      expect(out).toContain(`User-agent: ${ua}`);
    }
    expect(out).toContain("User-agent: *");
    expect(out).toContain("Sitemap: https://vikas794.github.io/sitemap.xml");
  });

  it("llms.txt FAQ section stays in sync with src/content/faq.ts", () => {
    const out = llms();
    for (const f of faqs) {
      expect(out).toContain(`Q: ${f.question}`);
    }
  });

  it("rss, ai/faq.json and ai/summary.json derive from content", () => {
    expect(rss()).toContain("<rss version=\"2.0\">");
    expect(aiFaq().faqs).toHaveLength(faqs.length);
    expect(aiSummary().caseStudies.length).toBeGreaterThan(0);
  });
});
