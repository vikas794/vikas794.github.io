import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { caseStudies } from "../../content/projects";
import CaseCard from "./CaseCard";

const featured = caseStudies.filter((c) => c.featured);

// Pinned horizontal track (desktop, motion allowed). The wrapper is as tall
// as the distance the cards have to travel, and a sticky stage inside it
// turns vertical scroll into sideways travel. Nothing is hijacked: it is
// plain scroll position driving a transform, so scrolling back up rewinds it
// and keyboard focus can always reach every card (see focusCard).
export function PinnedTrack({ heading }: { heading: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const numX = useTransform(x, (v) => `${-v * 0.15}px`); // artwork drifts at 0.85 of the frame

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const stage = track.parentElement;
      if (!stage) return;
      setDist(Math.max(track.scrollWidth - stage.clientWidth, 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    if (track.parentElement) ro.observe(track.parentElement);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(featured.length - 1, Math.round(p * (featured.length - 1)));
    setIndex((prev) => (prev === next ? prev : next));
  });

  // Bring a card into view by moving the page, never by scrolling the stage.
  const focusCard = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap || featured.length < 2) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const target = top + (i / (featured.length - 1)) * (wrap.offsetHeight - window.innerHeight);
    window.scrollTo({ top: target, behavior: "instant" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>(".case-card-link"));
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (at < 0) return;
    const next = links[at + (e.key === "ArrowRight" ? 1 : -1)];
    if (!next) return;
    e.preventDefault();
    focusCard(links.indexOf(next));
    next.focus({ preventScroll: true });
  };

  return (
    <div ref={wrapRef} className="case-pin" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="case-pin-stage">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{heading}</div>
        <div
          className="case-pin-viewport"
          data-cursor="Scroll"
          onKeyDown={onKeyDown}
          onFocusCapture={(e) => {
            const card = (e.target as HTMLElement).closest(".case-card");
            const slot = card?.parentElement;
            const i = slot ? Array.from(trackRef.current?.children ?? []).indexOf(slot) : -1;
            if (i >= 0) focusCard(i);
            e.currentTarget.scrollLeft = 0;
          }}
        >
          <motion.div ref={trackRef} className="case-track" style={{ x }}>
            {featured.map((c) => (
              <motion.div key={c.slug} className="case-slot" style={{ ["--num-x" as string]: numX }}>
                <CaseCard study={c} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 md:px-8" aria-hidden="true">
          <span className="case-pin-bar">
            <motion.span className="case-pin-bar-fill" style={{ scaleX: scrollYProgress }} />
          </span>
          <span className="font-mono text-xs text-ink-3 tabular">
            {index + 1} of {featured.length}
          </span>
        </div>
      </div>
    </div>
  );
}

// Below the pin breakpoint: a native horizontal swipe row with scroll-snap
// and a peek of the next card. No scroll hijacking.
export function SwipeTrack({ heading }: { heading: ReactNode }) {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{heading}</div>
      <div
        className="case-swipe"
        onScroll={(e) => {
          const el = e.currentTarget;
          const card = el.firstElementChild as HTMLElement | null;
          if (!card) return;
          const step = card.offsetWidth + 16;
          const next = Math.min(featured.length - 1, Math.round(el.scrollLeft / step));
          setIndex((prev) => (prev === next ? prev : next));
        }}
      >
        {featured.map((c) => (
          <div key={c.slug} className="case-swipe-slot">
            <CaseCard study={c} />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-4 flex w-full max-w-6xl items-center gap-3 px-5 md:px-8" aria-hidden="true">
        <span className="flex gap-2">
          {featured.map((c, i) => (
            <span key={c.slug} className="case-dot" data-on={i === index ? "true" : "false"} />
          ))}
        </span>
        <span className="font-mono text-xs text-ink-3 tabular">
          {index + 1} of {featured.length}
        </span>
      </div>
    </div>
  );
}
