import type Lenis from "lenis";

let instance: Lenis | null = null;

export const getLenis = () => instance;
export const setLenis = (next: Lenis | null) => {
  instance = next;
};

/** Scroll to a target through Lenis when active, else natively. */
export function scrollToTarget(target: string | number | HTMLElement, duration = 0.9) {
  if (instance) {
    instance.scrollTo(target, {
      duration,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}
