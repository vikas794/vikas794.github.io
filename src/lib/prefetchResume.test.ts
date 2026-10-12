import { describe, expect, it, vi } from "vitest";

describe("prefetchResumeAssets", () => {
  it("waits for intent on a résumé link before fetching anything", async () => {
    vi.resetModules();
    const { prefetchResumeAssets } = await import("./prefetchResume");
    const before = document.head.querySelectorAll('link[rel="prefetch"]').length;
    prefetchResumeAssets();
    await new Promise((r) => setTimeout(r, 50));
    expect(document.head.querySelectorAll('link[rel="prefetch"]').length).toBe(before);

    const other = document.createElement("a");
    other.href = "/about/";
    document.body.append(other);
    other.dispatchEvent(new Event("pointerover", { bubbles: true }));
    expect(document.head.querySelectorAll('link[rel="prefetch"]').length).toBe(before);

    const resume = document.createElement("a");
    resume.setAttribute("href", "/resume/");
    document.body.append(resume);
    resume.dispatchEvent(new Event("pointerover", { bubbles: true }));
    expect(document.head.querySelectorAll('link[rel="prefetch"]').length).toBe(before + 1);
  });
});
