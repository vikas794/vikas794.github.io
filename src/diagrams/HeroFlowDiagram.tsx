import { motion, useReducedMotion, type Variants } from "motion/react";
import { useHydrated } from "../hooks/useHydrated";

// A compact teaser of the flagship case study's real architecture — not a
// stock illustration. Same rules as the full diagrams: currentColor +
// var(--accent) only, stroke-width 1.5, mono labels, exactly one accented
// node (the thing built). Links through to the full write-up.
//
// On scroll-in, the diagram draws itself left to right — box, wire, box,
// wire, box — matching the actual direction ticks flow through the system.
// Prerender / no-JS / reduced-motion: fully static SVG, all content present.
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
};

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function HeroFlowDiagram() {
  const box = "fill-none stroke-current stroke-[1.5]";
  const label = "fill-current font-mono";
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const static_ = reduce || !hydrated;

  const Svg = static_ ? "svg" : motion.svg;
  const G = static_ ? "g" : motion.g;
  const Line = static_ ? "line" : motion.line;

  const svgProps = static_
    ? {}
    : {
        variants: stagger,
        initial: "hidden",
        whileInView: "show" as const,
        viewport: { once: true, amount: 0.5 },
      };

  return (
    <figure className="hero-diagram">
      <Svg
        viewBox="0 0 400 132"
        role="img"
        aria-labelledby="hero-flow-title hero-flow-desc"
        className="h-auto w-full text-ink"
        {...svgProps}
      >
        <title id="hero-flow-title">Market-tick fan-out, simplified</title>
        <desc id="hero-flow-desc">
          One Kite Connect upstream socket feeds the Broadcast Scheduler, which
          fans ticks out to thousands of WebSocket sessions.
        </desc>

        <G variants={static_ ? undefined : fadeUp}>
          <rect x="4" y="40" width="112" height="52" rx="6" className={box} />
          <text x="60" y="62" textAnchor="middle" fontSize="12" className={label}>
            Kite Connect
          </text>
          <text x="60" y="78" textAnchor="middle" fontSize="10" className={label} opacity="0.7">
            1 upstream socket
          </text>
        </G>

        <G variants={static_ ? undefined : fadeUp}>
          <Line
            x1="116"
            y1="66"
            x2="144"
            y2="66"
            stroke="currentColor"
            strokeWidth="1.5"
            variants={static_ ? undefined : draw}
          />
          <text x="130" y="58" textAnchor="middle" fontSize="10" className={label} opacity="0.75">
            wss
          </text>
        </G>

        <G variants={static_ ? undefined : fadeUp}>
          <rect x="144" y="34" width="128" height="64" rx="6" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <text x="208" y="60" textAnchor="middle" fontSize="12" className={label}>
            Broadcast
          </text>
          <text x="208" y="76" textAnchor="middle" fontSize="12" className={label}>
            Scheduler
          </text>
          <text x="208" y="90" textAnchor="middle" fontSize="10" className={label} opacity="0.7">
            built here · 500ms
          </text>
        </G>

        <G variants={static_ ? undefined : fadeUp}>
          <Line
            x1="272"
            y1="66"
            x2="300"
            y2="66"
            stroke="currentColor"
            strokeWidth="1.5"
            variants={static_ ? undefined : draw}
          />
          <text x="286" y="58" textAnchor="middle" fontSize="10" className={label} opacity="0.75">
            wss
          </text>
        </G>

        <G variants={static_ ? undefined : fadeUp}>
          <rect x="300" y="40" width="96" height="52" rx="6" className={box} />
          <text x="348" y="62" textAnchor="middle" fontSize="12" className={label}>
            1,000s of
          </text>
          <text x="348" y="78" textAnchor="middle" fontSize="12" className={label}>
            sessions
          </text>
        </G>
      </Svg>
    </figure>
  );
}
