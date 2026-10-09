import { flushSync } from "react-dom";

// Shared driver for both animated transitions on the site (theme toggle,
// route change) — both go through the View Transitions API so they get the
// same well-supported, compositor-driven animation, distinguished only by
// a `vt-<kind>` class on <html> that index.css keys its keyframes off of.
// Rapid clicks: skip the in-flight transition so animations never stack.
let activeTransition: ViewTransition | null = null;

export function runViewTransition(kind: "theme" | "route", mutate: () => void) {
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || typeof document === "undefined" || !document.startViewTransition) {
    mutate();
    return;
  }

  activeTransition?.skipTransition?.();

  const root = document.documentElement;
  // Clear both up front — if a previous transition's own cleanup hasn't
  // landed yet (e.g. it's still mid-flight when this one starts), we'd
  // otherwise end up with both kinds' classes on <html> at once and two
  // sets of keyframes fighting over the same pseudo-elements.
  root.classList.remove("vt-theme", "vt-route");
  root.classList.add(`vt-${kind}`);
  const transition = document.startViewTransition(() => flushSync(mutate));
  activeTransition = transition;
  transition.finished.finally(() => {
    // A superseded transition must not strip the class its successor owns.
    if (activeTransition !== transition) return;
    activeTransition = null;
    root.classList.remove(`vt-${kind}`);
  });
}
