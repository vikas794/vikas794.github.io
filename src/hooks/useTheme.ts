import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// SSR-safe theme: light is the default — server, first client render, and
// no-JS all agree. The pre-paint blocking script in index.html <head> adds
// .dark before paint for stored/OS opt-ins, so no FOUC. We sync from the DOM
// class in useEffect (never during render) to avoid hydration mismatch.
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const stored = (() => {
      try {
        return localStorage.getItem("theme");
      } catch {
        return null;
      }
    })();
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    setTheme(root.classList.contains("dark") ? "dark" : "light");
  }, []);

  // Skip the very first run: at mount, `theme` is still the transitional
  // "light" default (the sync effect above hasn't corrected it yet), and
  // writing that to localStorage/the DOM class here would race ahead of —
  // and clobber — whatever the real stored/pre-paint value was.
  const isFirstRun = useRef(true);

  // Layout effect, not a passive one: the theme-toggle click drives this
  // through flushSync inside document.startViewTransition, which only
  // flushes synchronous work up to (and including) layout effects — a
  // passive effect here would land after the transition already
  // snapshotted the "new" frame, and the circular reveal would just
  // flash between two identical (pre-toggle) frames.
  useLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // private mode — theme simply won't persist
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
