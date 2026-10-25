import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// SSR-safe theme: dark is the default — the <html> element ships with
// class="dark", so server, first client render, and no-JS all agree. The
// pre-paint blocking script in index.html <head> removes it before paint only
// for a stored "light" choice, so no FOUC. We sync from the DOM class in
// useEffect (never during render) to avoid hydration mismatch.
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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
      // Syncing from an external source (localStorage/DOM) on mount, not
      // deriving state from props — the documented SSR-safe pattern above.
      root.classList.toggle("dark", stored === "dark");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored);
      return;
    }
    setTheme(root.classList.contains("dark") ? "dark" : "light");
  }, []);

  // Only an explicit toggle is written to localStorage or the DOM class. A
  // first visit stores nothing and stays on the dark default; a saved choice
  // is applied by the pre-paint script and the sync effect above, and is never
  // overwritten by mount-time state (or a StrictMode double run).
  const userChose = useRef(false);

  // Layout effect, not a passive one: the theme-toggle click drives this
  // through flushSync inside document.startViewTransition, which only
  // flushes synchronous work up to (and including) layout effects — a
  // passive effect here would land after the transition already
  // snapshotted the "new" frame, and the circular reveal would just
  // flash between two identical (pre-toggle) frames.
  useLayoutEffect(() => {
    if (!userChose.current) return;
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
    userChose.current = true;
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
