import { describe, it, expect } from "vitest";
import { robots, llms } from "./generate";
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
});
