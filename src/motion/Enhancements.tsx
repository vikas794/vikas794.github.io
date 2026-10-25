import { useEffect } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { useFinePointer, useMotionOk } from "./media";

// Loads the pointer effects (cursor ring, card tilt, button fill direction,
// mouse-shake egg) as a separate chunk once the page is idle. Touch gets the
// card tilt and press state only; the mouse-only parts stay behind a fine
// pointer. Reduced-motion and high-contrast visitors never run it.
export default function Enhancements() {
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const fine = useFinePointer();

  useEffect(() => {
    if (!hydrated || !motionOk) return;
    if (window.matchMedia("(forced-colors: active)").matches) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    const load = () =>
      import("./pointerEffects").then((m) => {
        if (!cancelled) stop = m.initPointerEffects(fine);
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
