import { describe, it, expect } from "vitest";
import { render, routePaths } from "./entry-server";

// The three entry-server assertions are the entire prerender safety net:
// renderToString silently drops React.lazy boundaries (empty for crawlers),
// so we prove real content per route instead of trusting a green build.
describe("entry-server", () => {
  it("covers every manifest path", async () => {
    expect(routePaths).toContain("/");
    expect(routePaths).toContain("/about/");
    expect(routePaths).toContain("/projects/sql-injection-surface/");
    expect(routePaths.length).toBeGreaterThanOrEqual(9);
  });

  it("renders real body copy with unique head on /about/", async () => {
    const { head, rootHtml } = await render("/about/");
    expect(head).toMatch(/<title>About \|/);
    expect(head).toContain('rel="canonical"');
    expect(rootHtml).toContain("How I work");
    expect(rootHtml).toContain("Azure Fundamentals (AZ-900)");
    expect(rootHtml).not.toContain("data-msg=");
  });

  it("renders the case-study body on a slug route", async () => {
    const { head, rootHtml } = await render("/projects/sql-injection-surface/");
    expect(head).toMatch(/<title>Closing the SQL injection surface/);
    expect(rootHtml).toContain("What I");
    expect(rootHtml).toContain("do differently");
    expect(rootHtml).not.toContain("<!--$!-->");
  });

  it("renders the catch-all for unknown paths", async () => {
    const { head, rootHtml } = await render("/404/");
    expect(head).toMatch(/<title>Not found/);
    expect(rootHtml).toContain("This page doesn&#x27;t exist.");
  });
});
