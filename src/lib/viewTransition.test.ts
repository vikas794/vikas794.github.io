import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { runViewTransition } from "./viewTransition";

describe("runViewTransition", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    document.documentElement.className = "";
    originalMatchMedia = window.matchMedia;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
  });

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: originalMatchMedia,
    });
    delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
    vi.restoreAllMocks();
  });

  it("should execute mutate directly when document.startViewTransition is not supported", () => {
    const mutate = vi.fn();

    runViewTransition("theme", mutate);

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(document.documentElement.classList.contains("vt-theme")).toBe(false);
  });

  it("should execute mutate directly when prefers-reduced-motion is reduce", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion: reduce"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const startViewTransitionMock = vi.fn();
    (document as unknown as { startViewTransition: unknown }).startViewTransition = startViewTransitionMock;

    const mutate = vi.fn();

    runViewTransition("theme", mutate);

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(startViewTransitionMock).not.toHaveBeenCalled();
    expect(document.documentElement.classList.contains("vt-theme")).toBe(false);
  });

  it("should trigger view transition and handle class toggles for theme kind", async () => {
    let finishedResolver: () => void = () => {};
    const finishedPromise = new Promise<void>((resolve) => {
      finishedResolver = resolve;
    });

    const startViewTransitionMock = vi.fn().mockImplementation((cb: () => void) => {
      cb();
      return { finished: finishedPromise };
    });
    (document as unknown as { startViewTransition: unknown }).startViewTransition = startViewTransitionMock;

    document.documentElement.classList.add("vt-route");

    const mutate = vi.fn();

    runViewTransition("theme", mutate);

    // Cleared previous vt-route and added vt-theme
    expect(document.documentElement.classList.contains("vt-route")).toBe(false);
    expect(document.documentElement.classList.contains("vt-theme")).toBe(true);

    // Call callback in startViewTransition
    expect(startViewTransitionMock).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledTimes(1);

    // Before finished resolves, vt-theme class should still be present
    expect(document.documentElement.classList.contains("vt-theme")).toBe(true);

    // Resolve finished promise and wait
    finishedResolver();
    await finishedPromise;

    // After finished resolves, vt-theme class should be removed
    expect(document.documentElement.classList.contains("vt-theme")).toBe(false);
  });

  it("should trigger view transition and handle class toggles for route kind", async () => {
    let finishedResolver: () => void = () => {};
    const finishedPromise = new Promise<void>((resolve) => {
      finishedResolver = resolve;
    });

    const startViewTransitionMock = vi.fn().mockImplementation((cb: () => void) => {
      cb();
      return { finished: finishedPromise };
    });
    (document as unknown as { startViewTransition: unknown }).startViewTransition = startViewTransitionMock;

    document.documentElement.classList.add("vt-theme");

    const mutate = vi.fn();

    runViewTransition("route", mutate);

    expect(document.documentElement.classList.contains("vt-theme")).toBe(false);
    expect(document.documentElement.classList.contains("vt-route")).toBe(true);

    expect(startViewTransitionMock).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledTimes(1);

    finishedResolver();
    await finishedPromise;

    expect(document.documentElement.classList.contains("vt-route")).toBe(false);
  });

  it("should clean up class when finished promise rejects", async () => {
    let finishedRejecter: (reason?: unknown) => void = () => {};
    const finishedPromise = new Promise<void>((_, reject) => {
      finishedRejecter = reject;
    });

    // Attach catch handler directly to finishedPromise in the mock
    const startViewTransitionMock = vi.fn().mockImplementation((cb: () => void) => {
      cb();
      return { finished: finishedPromise.catch(() => {}) };
    });
    (document as unknown as { startViewTransition: unknown }).startViewTransition = startViewTransitionMock;

    const mutate = vi.fn();

    runViewTransition("theme", mutate);

    expect(document.documentElement.classList.contains("vt-theme")).toBe(true);

    finishedRejecter(new Error("Transition aborted"));
    await new Promise((r) => setTimeout(r, 0));

    expect(document.documentElement.classList.contains("vt-theme")).toBe(false);
  });
});
