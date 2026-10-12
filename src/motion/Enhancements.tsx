import { useEffect } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { useFinePointer, useMotionOk } from "./media";

// Loads the pointer-only effects (cursor ring, card tilt, text decode,
// button fill direction, mouse-shake egg) as a separate chunk once the page
// is idle. Gated on a fine pointer, motion allowed and no forced colours, so
// touch, reduced-motion and high-contrast visitors never download or run it.
export default function Enhancements() {
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const fine = useFinePointer();

  useEffect(() => {
    if (!hydrated || !motionOk || !fine) return;
    if (window.matchMedia("(forced-colors: active)").matches) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    const load = () =>
      import("./pointerEffects").then((m) => {
        if (!cancelled) stop = m.initPointerEffects();
      });
    const ric = window.requestIdleCallback as ((cb: () => void, o?: { timeout: number }) => number) | undefined;
    const cic = window.cancelIdleCallback as ((id: number) => void) | undefined;
    const idle = ric ? ric(load, { timeout: 2000 }) : window.setTimeout(load, 300);
    return () => {
      cancelled = true;
      if (ric && cic) cic(idle);
      else clearTimeout(idle);
      stop?.();
    };
  }, [hydrated, motionOk, fine]);

  return null;
}
