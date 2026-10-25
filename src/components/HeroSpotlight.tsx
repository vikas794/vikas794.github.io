import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import DotField from "./DotField";

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

    let frame = 0;
    let px = 0;
    let py = 0;
    let on = false;
    const paint = () => {
      frame = 0;
      const r = host.getBoundingClientRect();
      // Scrolling moves the host under a still pointer: re-test containment.
      const inside = on && px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
      if (inside) {
        el.style.setProperty("--mx", `${px - r.left}px`);
        el.style.setProperty("--my", `${py - r.top}px`);
      }
      el.dataset.active = inside ? "true" : "false";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const at = (x: number, y: number) => {
      px = x;
      py = y;
      on = true;
      schedule();
    };
    const onMove = (e: PointerEvent) => at(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) at(t.clientX, t.clientY);
    };
    const onLeave = () => {
      on = false;
      schedule();
    };
    const onScroll = () => {
      if (on) schedule();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("touchstart", onTouch, { passive: true });
    host.addEventListener("touchmove", onTouch, { passive: true });
    host.addEventListener("touchend", onLeave, { passive: true });
    host.addEventListener("touchcancel", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("touchstart", onTouch);
      host.removeEventListener("touchmove", onTouch);
      host.removeEventListener("touchend", onLeave);
      host.removeEventListener("touchcancel", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden="true" className="hero-bg" data-active="false">
      <div className="hero-dots" />
      <div className="hero-dots hero-dots-hot" />
      <DotField />
    </div>
  );
}
