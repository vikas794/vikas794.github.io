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
// Sections marked `data-wire-invert` (the solid accent band) flip the wire
// to the paper colour while it passes over them: a second, decorative copy
// of the wire in the inverted colours is clipped to the band's on-screen
// extent, so the colour change follows the band edge exactly as you scroll.
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

function Track({ motionOk }: { motionOk: boolean }) {
  return (
    <div className="wire-track" aria-hidden="true">
      <div className="wire-line" />
      <div className="wire-travelled" />
      {motionOk && <div className="wire-pulse" />}
    </div>
  );
}

export default function RequestWire() {
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const { pathname } = useLocation();
  const [hops, setHops] = useState<Hop[]>([]);

  const root = useRef<HTMLElement>(null);
  const invert = useRef<HTMLDivElement>(null);
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

  // Drive the wire (both colour layers) from scroll.
  useEffect(() => {
    const nav = root.current;
    if (!hydrated || !nav) return;
    const trackH = () => Math.max(window.innerHeight - TOP_INSET - BOTTOM_INSET, 1);

    const apply = (y: number, velocity: number, direction: "up" | "down") => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(y / scrollable, 0), 1);
      const h = trackH();

      nav.querySelectorAll<HTMLElement>(".wire-travelled").forEach((el) => {
        el.style.transform = `scaleY(${p.toFixed(4)})`;
      });

      if (motionOk) {
        const tail = Math.min(TAIL_BASE + Math.abs(velocity) * 0.04, TAIL_MAX);
        const head = p * h;
        // Tail trails behind the head: above when moving down, below when moving up.
        const top = direction === "down" ? head - tail : head;
        nav.querySelectorAll<HTMLElement>(".wire-pulse").forEach((el) => {
          el.style.height = `${tail}px`;
          el.style.transform = `translateY(${top}px)`;
          el.dataset.dir = direction;
          el.style.opacity = p > 0.002 ? "1" : "0";
        });
      }

      hopsRef.current.forEach((hop, i) => {
        const on = p >= hop.at - 0.0005;
        if (lit.current[i] === on) return;
        lit.current[i] = on;
        nav.querySelectorAll<HTMLElement>(`.wire-node[data-i="${i}"]`).forEach((el) => {
          el.dataset.lit = on ? "true" : "false";
          if (on && motionOk) {
            el.classList.remove("wire-node-pulse");
            void el.offsetWidth;
            el.classList.add("wire-node-pulse");
          }
        });
      });

      // Clip the inverted layer to wherever the accent band is on screen.
      const inv = invert.current;
      if (inv) {
        const band = document.querySelector<HTMLElement>("[data-wire-invert]");
        const vh = window.innerHeight;
        if (band) {
          const r = band.getBoundingClientRect();
          const t = Math.max(r.top, 0);
          const b = Math.min(r.bottom, vh);
          inv.style.clipPath = b > t ? `inset(${t}px 0 ${vh - b}px 0)` : "inset(100% 0 0 0)";
        } else {
          inv.style.clipPath = "inset(100% 0 0 0)";
        }
      }
    };

    const off = subscribeScroll((s) => apply(s.y, s.velocity, s.direction));
    apply(window.scrollY, 0, "down");
    return off;
  }, [hydrated, motionOk, hops]);

  if (!hydrated) return null;

  return (
    <nav ref={root} aria-label="Page sections" className="request-wire" data-motion={motionOk ? "on" : "off"}>
      <Track motionOk={motionOk} />
      {hops.length > 0 && (
        <ul className="wire-nodes">
          {hops.map((hop, i) => (
            <li key={hop.id} className="wire-node-item" style={{ top: `${hop.at * 100}%` }}>
              <a
                href={`#${hop.id}`}
                className="wire-node"
                data-i={i}
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

      {/* Inverted copy, shown only over the accent band. */}
      <div ref={invert} className="wire-invert" aria-hidden="true">
        <Track motionOk={motionOk} />
        {hops.length > 0 && (
          <ul className="wire-nodes">
            {hops.map((hop, i) => (
              <li key={hop.id} className="wire-node-item" style={{ top: `${hop.at * 100}%` }}>
                <span className="wire-node" data-i={i} data-lit="false">
                  <span className="wire-label">{hop.label}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
