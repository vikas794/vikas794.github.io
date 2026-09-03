import { flushSync } from "react-dom";

// Shared driver for both animated transitions on the site (theme toggle,
// route change) — both go through the View Transitions API so they get the
// same well-supported, compositor-driven animation, distinguished only by
// a `vt-<kind>` class on <html> that index.css keys its keyframes off of.
export function runViewTransition(kind: "theme" | "route", mutate: () => void) {
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || typeof document === "undefined" || !document.startViewTransition) {
    mutate();
    return;
  }

  const root = document.documentElement;
  // Clear both up front — if a previous transition's own cleanup hasn't
  // landed yet (e.g. it's still mid-flight when this one starts), we'd
  // otherwise end up with both kinds' classes on <html> at once and two
  // sets of keyframes fighting over the same pseudo-elements.
  root.classList.remove("vt-theme", "vt-route");
  root.classList.add(`vt-${kind}`);
  const transition = document.startViewTransition(() => flushSync(mutate));
  transition.finished.finally(() => root.classList.remove(`vt-${kind}`));
}
