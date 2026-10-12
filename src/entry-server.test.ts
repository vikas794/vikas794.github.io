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
    expect(head).toMatch(/<title>This page doesn&#x27;t exist\. \(404\)/);
    expect(rootHtml).toContain("This page doesn&#x27;t exist.");
  });

  // The enhanced experience (pinned track, tabs, wire, cursor) must only
  // appear after hydration. The prerendered home page has to be the complete,
  // plain version a crawler or a no-JS visitor gets.
  it("prerenders the home page as the complete plain version", async () => {
    const { rootHtml } = await render("/");
    expect((rootHtml.match(/data-hop="/g) ?? []).length).toBe(6);
    expect(rootHtml).toContain("case-row");
    expect(rootHtml).toContain("ledger-label");
    expect(rootHtml).toContain("Where I&#x27;ve worked");
    for (const slug of ["market-ticks-fanout", "healthcare-backend-trust", "sql-injection-surface"]) {
      expect(rootHtml).toContain(`/projects/${slug}/`);
    }
    expect(rootHtml).not.toContain("request-wire");
    expect(rootHtml).not.toContain("case-pin");
    expect(rootHtml).not.toContain("case-swipe");
    expect(rootHtml).not.toContain('role="tab"');
    expect(rootHtml).not.toContain("dot-field");
    expect(rootHtml).not.toContain("cursor-ring");
  });
});
