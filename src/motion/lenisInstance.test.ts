import { afterEach, describe, expect, it, vi } from "vitest";
import type Lenis from "lenis";
import { scrollToTarget, setLenis } from "./lenisInstance";

describe("scrollToTarget", () => {
  afterEach(() => setLenis(null));

  it("goes through Lenis when it is active", () => {
    const scrollTo = vi.fn();
    setLenis({ scrollTo } as unknown as Lenis);
    scrollToTarget("#services", 0.9);
    expect(scrollTo).toHaveBeenCalledWith("#services", expect.objectContaining({ duration: 0.9 }));
  });

  it("falls back to native smooth scrolling without Lenis", () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    scrollToTarget(0);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
