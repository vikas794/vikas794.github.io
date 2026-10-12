import { useEffect, useRef, useState } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { useMotionOk } from "../motion/media";
import { subscribeScroll } from "../motion/scrollState";

// A line of stack names. Purely decorative: the same skills are in the
// ledger below it as real text, so the whole thing is aria-hidden.
//
// Enhanced (hydrated, motion allowed): it drifts left at a steady pace,
// speeds up while you scroll down, runs backwards while you scroll up, and
// eases back to its base pace when scrolling stops. It pauses on hover and
// while off-screen. Otherwise the plain CSS drift (or nothing, under reduced
// motion) applies.
const BASE_SPEED = 40; // px/s
const BASE_SPEED_SMALL = 28;
const GAIN = 0.6;

export default function Ticker({ items }: { items: string[] }) {
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!hydrated || !motionOk || !root || !track) return;

    setEnhanced(true);
    let x = 0;
    let speed = 0;
    let scrollV = 0;
    let dir: "up" | "down" = "down";
    let hovering = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    let loopWidth = 0;

    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      loopWidth = track.scrollWidth / 2 + gap / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const offScroll = subscribeScroll((s) => {
      scrollV = s.velocity;
      dir = s.direction;
    });

    const tick = (now: number) => {
      raf = 0;
      if (!visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const base = window.innerWidth < 768 ? BASE_SPEED_SMALL : BASE_SPEED;
      const scrolling = Math.abs(scrollV) > 20;
      const sign = scrolling && dir === "up" ? -1 : 1;
      const target = hovering ? 0 : sign * (base + Math.abs(scrollV) * GAIN);
      // Ease toward the target pace (about 600ms) so reversals feel weighty.
      speed += (target - speed) * (1 - Math.exp(-dt / 0.2));
      x -= speed * dt;
      if (loopWidth > 0) x = ((x % loopWidth) + loopWidth) % loopWidth - loopWidth;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(root);

    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      offScroll();
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      track.style.transform = "";
      setEnhanced(false);
    };
  }, [hydrated, motionOk]);

  const row = items.map((t, i) => (
    <span key={`${t}-${i}`} className="ticker-item">
      {t}
    </span>
  ));
  return (
    <div ref={rootRef} className="ticker" aria-hidden="true" data-js={enhanced ? "true" : "false"}>
      <div ref={trackRef} className="ticker-track">
        {row}
        {row}
      </div>
    </div>
  );
}
