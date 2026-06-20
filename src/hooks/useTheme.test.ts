import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Mock localStorage
    const store: Record<string, string> = {};
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(
      (key) => store[key] || null
    );
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      (key, value) => {
        store[key] = value.toString();
      }
    );

    // Default matchMedia mock (returns false for prefers-color-scheme: light)
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Reset document state
    document.documentElement.className = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: originalMatchMedia,
    });
    localStorage.clear();
  });

  it("should initialize with 'dark' theme by default", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    // Class should not be 'light'
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(localStorage.getItem).toHaveBeenCalledWith("theme");
  });

  it("should initialize with 'light' theme if saved in localStorage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "theme") return "light";
      return null;
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("should initialize with 'dark' theme if saved in localStorage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "theme") return "dark";
      return null;
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("should initialize with 'light' theme if prefers-color-scheme is light", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: light)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("should toggle theme correctly", () => {
    const { result } = renderHook(() => useTheme());

    // Initially dark
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);

    // Toggle to light
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");

    // Toggle back to dark
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });
});
