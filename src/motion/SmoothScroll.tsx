import { useEffect } from "react";
import { useLocation } from "react-router";
import type Lenis from "lenis";
import { getLenis, setLenis } from "./lenisInstance";
import { useHydrated } from "../hooks/useHydrated";
import { useFinePointer, useMotionOk } from "./media";

// Lenis is loaded lazily after hydration and only for mouse/trackpad users
// who have not asked for reduced motion. Touch and reduced-motion visitors
// keep native scrolling. The live instance is held in module state so other
// components can ask it to scroll through `scrollToTarget` (lenisInstance.ts).

export default function SmoothScroll() {
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const finePointer = useFinePointer();
  const { pathname } = useLocation();
  const enabled = hydrated && motionOk && finePointer;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let raf = 0;
    let lenis: Lenis | null = null;

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({ lerp: 0.09, wheelMultiplier: 0.9, anchors: false });
      setLenis(lenis);
      document.documentElement.classList.add("lenis-active");
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("lenis-active");
      lenis?.destroy();
      if (getLenis() === lenis) setLenis(null);
    };
  }, [enabled]);

  // The route transition swaps the page; reset Lenis's internal position so
  // it does not animate back from the previous page's offset.
  useEffect(() => {
    const active = getLenis();
    if (active && !window.location.hash) active.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
