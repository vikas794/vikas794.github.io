import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { useMotionOk } from "./media";
import { subscribeScroll } from "./scrollState";

// Scroll-scrubbed reveal helpers. Each writes straight to the DOM from the
// shared scroll store, so scrolling never re-renders React, and each is
// reversible: scroll back up and the effect un-plays. Before hydration, and
// under reduced motion, nothing is clipped or hidden.

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

/** Text line revealed left to right by a clip-path wipe as it enters. */
export function WipeLine({ as: Tag = "span", children, className }: { as?: ElementType; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const hydrated = useHydrated();
  const motionOk = useMotionOk();

  useEffect(() => {
    const el = ref.current;
    if (!el || !hydrated || !motionOk) return;
    let last = -1;
    const apply = () => {
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const p = Math.round(clamp((vh * 0.92 - top) / (vh * 0.3)) * 100);
      if (p === last) return;
      last = p;
      el.style.clipPath = p >= 100 ? "" : `inset(0 ${100 - p}% 0 0)`;
    };
    apply();
    const off = subscribeScroll(apply);
    return () => {
      off();
      el.style.clipPath = "";
    };
  }, [hydrated, motionOk]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** A vertical rule that draws down its block as the block crosses the viewport. */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hydrated = useHydrated();
  const motionOk = useMotionOk();

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || !hydrated || !motionOk) return;
    host.dataset.draw = "on";
    let last = -1;
    const apply = () => {
      const r = host.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.6 - r.top) / Math.max(r.height, 1));
      const q = Math.round(p * 1000) / 1000;
      if (q === last) return;
      last = q;
      el.style.transform = `scaleY(${q})`;
      host.dataset.drawn = q > 0 ? "true" : "false";
    };
    apply();
    const off = subscribeScroll(apply);
    return () => {
      off();
      delete host.dataset.draw;
      delete host.dataset.drawn;
    };
  }, [hydrated, motionOk]);

  return <span ref={ref} aria-hidden="true" className={className ?? "draw-line"} />;
}
