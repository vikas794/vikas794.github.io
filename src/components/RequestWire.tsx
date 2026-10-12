import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useHydrated } from "../hooks/useHydrated";
import { useMotionOk } from "../motion/media";
import { scrollToTarget } from "../motion/lenisInstance";
import { subscribeScroll } from "../motion/scrollState";

// "The Request": a thin wire down the left edge. The part already travelled
// is drawn in the accent colour and a pulse rides its head. Sections that
// carry `data-hop="label"` become nodes the pulse passes through; pages with
// no hops (case studies, about...) get the wire as a plain progress line.
// Scrolling up rewinds everything. All positions are written straight to the
// DOM from the shared scroll store, so scrolling never re-renders React.
//
// Decorative except the node links, which duplicate the page's own sections
// and are keyboard reachable. Rendered after hydration only (nothing is
// content, and it is fixed-position so it cannot shift layout).

interface Hop {
  id: string;
  label: string;
  /** Scroll progress (0..1) at which this section's top crosses 60% of the viewport. */
  at: number;
}

const TOP_INSET = 84;
const BOTTOM_INSET = 28;
const TAIL_BASE = 24;
const TAIL_MAX = 140;

function measureHops(): Hop[] {
  const vh = window.innerHeight;
  const scrollable = Math.max(document.documentElement.scrollHeight - vh, 1);
  const out: Hop[] = [];
  document.querySelectorAll<HTMLElement>("[data-hop]").forEach((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    const at = Math.min(Math.max((top - vh * 0.6) / scrollable, 0), 1);
    out.push({ id: el.id, label: el.dataset.hop ?? el.id, at });
  });
  return out;
}

export default function RequestWire() {
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const { pathname } = useLocation();
  const [hops, setHops] = useState<Hop[]>([]);

  const travelled = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(HTMLAnchorElement | null)[]>([]);
  const progressRef = useRef(0);
  const hopsRef = useRef<Hop[]>([]);
  const lit = useRef<boolean[]>([]);

  // Measure hop positions now and whenever the document resizes.
  useEffect(() => {
    if (!hydrated) return;
    const measure = () => {
      const next = measureHops();
      hopsRef.current = next;
      lit.current = [];
      setHops(next);
    };
    // Wait a frame so the new route's DOM is in place before measuring.
    let raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(document.documentElement);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [hydrated, pathname]);

  // Drive the wire from scroll.
  useEffect(() => {
    if (!hydrated) return;
    const trackH = () => Math.max(window.innerHeight - TOP_INSET - BOTTOM_INSET, 1);

    const apply = (y: number, velocity: number, direction: "up" | "down") => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(y / scrollable, 0), 1);
      progressRef.current = p;
      const h = trackH();

      if (travelled.current) travelled.current.style.transform = `scaleY(${p.toFixed(4)})`;

      if (pulse.current && motionOk) {
        const tail = Math.min(TAIL_BASE + Math.abs(velocity) * 0.04, TAIL_MAX);
        const head = p * h;
        // Tail trails behind the head: above when moving down, below when moving up.
        const top = direction === "down" ? head - tail : head;
        pulse.current.style.height = `${tail}px`;
        pulse.current.style.transform = `translateY(${top}px)`;
        pulse.current.dataset.dir = direction;
        pulse.current.style.opacity = p > 0.002 ? "1" : "0";
      }

      hopsRef.current.forEach((hop, i) => {
        const on = p >= hop.at - 0.0005;
        if (lit.current[i] === on) return;
        lit.current[i] = on;
        const el = nodeEls.current[i];
        if (!el) return;
        el.dataset.lit = on ? "true" : "false";
        if (on && motionOk) {
          el.classList.remove("wire-node-pulse");
          void el.offsetWidth;
          el.classList.add("wire-node-pulse");
        }
      });
    };

    const off = subscribeScroll((s) => apply(s.y, s.velocity, s.direction));
    apply(window.scrollY, 0, "down");
    return off;
  }, [hydrated, motionOk, hops]);

  if (!hydrated) return null;

  return (
    <nav aria-label="Page sections" className="request-wire" data-motion={motionOk ? "on" : "off"}>
      <div className="wire-track" aria-hidden="true">
        <div className="wire-line" />
        <div ref={travelled} className="wire-travelled" />
        {motionOk && <div ref={pulse} className="wire-pulse" />}
      </div>
      {hops.length > 0 && (
        <ul className="wire-nodes">
          {hops.map((hop, i) => (
            <li key={hop.id} className="wire-node-item" style={{ top: `${hop.at * 100}%` }}>
              <a
                ref={(el) => {
                  nodeEls.current[i] = el;
                }}
                href={`#${hop.id}`}
                className="wire-node"
                data-lit="false"
                aria-label={`Go to ${hop.label}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(`#${hop.id}`);
                  history.replaceState(null, "", `#${hop.id}`);
                }}
              >
                <span className="wire-label">{hop.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
