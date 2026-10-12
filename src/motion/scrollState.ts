import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down";

export interface ScrollSample {
  y: number;
  /** Pixels per second, signed (positive = scrolling down). Eased toward 0 when idle. */
  velocity: number;
  direction: ScrollDirection;
}

// One passive scroll listener and one rAF decay loop shared by every
// consumer (wire, ticker, header). Subscribers are called at most once per
// frame while scrolling; React state is only touched when direction flips.
type Listener = (sample: ScrollSample) => void;

const listeners = new Set<Listener>();
const sample: ScrollSample = { y: 0, velocity: 0, direction: "down" };

let attached = false;
let rafId = 0;
let lastY = 0;
let lastT = 0;

function emit() {
  listeners.forEach((fn) => fn(sample));
}

function tick(now: number) {
  rafId = 0;
  const y = window.scrollY;
  const dt = Math.max(now - lastT, 1);
  const raw = ((y - lastY) / dt) * 1000;
  if (y !== lastY) {
    sample.direction = y > lastY ? "down" : "up";
    sample.velocity = sample.velocity * 0.6 + raw * 0.4;
  } else {
    sample.velocity *= 0.85;
    if (Math.abs(sample.velocity) <= 1) sample.velocity = 0;
  }
  sample.y = y;
  lastY = y;
  lastT = now;
  emit();
  // Keep decaying until velocity settles, so consumers ease back to rest.
  if (Math.abs(sample.velocity) > 1) {
    rafId = requestAnimationFrame(tick);
  }
}

function onScroll() {
  if (!rafId) {
    lastT = performance.now();
    rafId = requestAnimationFrame(tick);
  }
}

function attach() {
  if (attached) return;
  attached = true;
  lastY = sample.y = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
}

function detach() {
  if (!attached || listeners.size > 0) return;
  attached = false;
  window.removeEventListener("scroll", onScroll);
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

/** Subscribe without React state; returns an unsubscribe function. */
export function subscribeScroll(fn: Listener): () => void {
  listeners.add(fn);
  attach();
  return () => {
    listeners.delete(fn);
    detach();
  };
}

/** Re-renders only when the scroll direction flips. */
export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("down");
  useEffect(() => subscribeScroll((s) => setDirection((prev) => (prev === s.direction ? prev : s.direction))), []);
  return direction;
}
