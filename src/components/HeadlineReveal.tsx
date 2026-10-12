import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { useFinePointer, useMotionOk } from "../motion/media";
import Mark from "./Mark";

// Page h1 with an optional highlighted phrase. Animated: each word rises out
// of its own mask, then the highlighter draws. Prerender, no-JS and reduced
// motion get the plain heading (the highlight still shows, it is CSS). The
// words stay real text with real spaces, so the accessible name is unchanged.
//
// `reactive` (home hero) adds two pointer-era effects, both gated on a fine
// pointer and motion preference: letters thicken as the cursor nears them
// (a text-stroke, not a weight change, so the line never reflows), and touch
// devices get one sweep of the same effect after the intro. `introOnce`
// plays the entrance once per session and lets any click or key skip it.
function split(text: string, highlight?: string) {
  const i = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || i < 0) return { before: text, marked: "", after: "" };
  return { before: text.slice(0, i), marked: highlight, after: text.slice(i + highlight.length) };
}

const INTRO_KEY = "intro-played";
const INTRO_MS = 1400;
const RADIUS = 160;
const MAX_STROKE = 1.1;

function introAlreadyPlayed(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export default function HeadlineReveal({
  id,
  text,
  highlight,
  className = "t-display",
  reactive = false,
  introOnce = false,
}: {
  id: string;
  text: string;
  highlight?: string;
  className?: string;
  reactive?: boolean;
  introOnce?: boolean;
}) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const fine = useFinePointer();
  const ref = useRef<HTMLHeadingElement>(null);
  const [skipped, setSkipped] = useState(false);
  const [replayed] = useState(() => (introOnce && typeof window !== "undefined" ? introAlreadyPlayed() : false));
  const { before, marked, after } = split(text, highlight);

  const animate = hydrated && !reduce && !skipped && !replayed;
  const enhanced = hydrated && !reduce;

  // Mark the intro as played and let any press skip it.
  useEffect(() => {
    if (!introOnce || !animate) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode */
    }
    const skip = () => setSkipped(true);
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    const done = window.setTimeout(() => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    }, INTRO_MS);
    return () => {
      window.clearTimeout(done);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [introOnce, animate]);

  // Cursor proximity: thicken letters near the pointer.
  useEffect(() => {
    const h1 = ref.current;
    if (!reactive || !enhanced || !motionOk || !fine || !h1) return;
    const chars = Array.from(h1.querySelectorAll<HTMLElement>(".ch"));
    let frame = 0;
    let px = 0;
    let py = 0;
    let active = false;

    const paint = () => {
      frame = 0;
      for (const el of chars) {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const t = active ? Math.max(0, 1 - d / RADIUS) : 0;
        el.style.setProperty("--s", `${(t * t * MAX_STROKE).toFixed(2)}px`);
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      active = true;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      active = false;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      chars.forEach((el) => el.style.removeProperty("--s"));
    };
  }, [reactive, enhanced, motionOk, fine, skipped]);

  // Touch: one sweep across the letters once the intro has settled.
  useEffect(() => {
    const h1 = ref.current;
    if (!reactive || !enhanced || !motionOk || fine || !h1) return;
    const t = window.setTimeout(() => h1.classList.add("ch-sweep"), animate ? INTRO_MS : 300);
    return () => window.clearTimeout(t);
  }, [reactive, enhanced, motionOk, fine, animate]);

  if (!enhanced) {
    return (
      <h1 id={id} className={className}>
        {before}
        {marked && <Mark>{marked}</Mark>}
        {after}
      </h1>
    );
  }

  let n = 0;
  let c = 0;
  const letters = (w: string): ReactNode =>
    reactive
      ? Array.from(w).map((ch, i) => (
          <span key={i} className="ch" style={{ "--i": c++ } as CSSProperties}>
            {ch}
          </span>
        ))
      : w;

  const words = (chunk: string): ReactNode[] =>
    chunk
      .split(/(\s+)/)
      .filter((w) => w.length > 0)
      .map((w, k) => {
        if (/^\s+$/.test(w)) return w;
        if (!animate && introOnce) {
          // Skipped or already played this session: final state, no motion.
          return (
            <span key={k} className="word-mask">
              <span className="inline-block">{letters(w)}</span>
            </span>
          );
        }
        return (
          <span key={k} className="word-mask">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.07 * n++, ease: [0.16, 1, 0.3, 1] }}
            >
              {letters(w)}
            </motion.span>
          </span>
        );
      });

  return (
    <h1 id={id} ref={ref} className={className} aria-label={text}>
      {words(before)}
      {marked && <Mark>{words(marked)}</Mark>}
      {words(after)}
    </h1>
  );
}
