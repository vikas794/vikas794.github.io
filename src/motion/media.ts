import { useSyncExternalStore } from "react";

// Media-query hooks for gating enhancements. The server snapshot is always
// false so the prerendered markup is the plain, complete version and the
// first client render matches it; enhancements switch on after hydration.
function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", notify);
      return () => mql.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True only when the visitor has not asked for reduced motion. */
export function useMotionOk(): boolean {
  return useMedia("(prefers-reduced-motion: no-preference)");
}

/** True for a mouse or trackpad that can hover; false on touch. */
export function useFinePointer(): boolean {
  return useMedia("(hover: hover) and (pointer: fine)");
}

/** Wide enough for desktop-only layouts such as the pinned project track. */
export function useDesktopWidth(): boolean {
  return useMedia("(min-width: 1024px)");
}
