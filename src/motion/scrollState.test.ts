import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { subscribeScroll } from "./scrollState";

describe("scrollState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) =>
      setTimeout(() => cb(performance.now()), 16) as unknown as number
    );
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => clearTimeout(id));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("reports direction and signed velocity, then decays to zero", () => {
    const seen: { direction: string; velocity: number }[] = [];
    const off = subscribeScroll((s) => seen.push({ direction: s.direction, velocity: s.velocity }));

    Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(40);
    expect(seen[0].direction).toBe("down");
    expect(seen[0].velocity).toBeGreaterThan(0);

    Object.defineProperty(window, "scrollY", { value: 100, configurable: true });
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(40);
    expect(seen.some((s) => s.direction === "up" && s.velocity < 0)).toBe(true);

    vi.advanceTimersByTime(3000);
    expect(seen[seen.length - 1].velocity).toBe(0);
    off();
  });
});
