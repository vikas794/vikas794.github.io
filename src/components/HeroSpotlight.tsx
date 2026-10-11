import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Background for the hero: a faint dot grid (pure CSS, so it is in the
// prerendered page) plus, on pointer devices only, a layer of accent dots
// that appears around the cursor. Touch and reduced motion get the static
// grid. Decorative: aria-hidden, no pointer events.
export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || reduce) return;
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el.dataset.active = "true";
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.dataset.active = "false";
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden="true" className="hero-bg" data-active="false">
      <div className="hero-dots" />
      <div className="hero-dots hero-dots-hot" />
    </div>
  );
}
