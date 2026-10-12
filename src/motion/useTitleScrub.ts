import { useEffect, useRef } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { useMotionOk } from "./media";
import { subscribeScroll } from "./scrollState";

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

/** Section titles thicken as they cross the middle of the screen (text-stroke, so nothing reflows). */
export function useTitleScrub<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const hydrated = useHydrated();
  const motionOk = useMotionOk();

  useEffect(() => {
    const el = ref.current;
    if (!el || !hydrated || !motionOk) return;
    let last = -1;
    const apply = () => {
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const p = Math.round(clamp((vh * 0.9 - top) / (vh * 0.4)) * 20) / 20;
      if (p === last) return;
      last = p;
      el.style.setProperty("--ts", `${(p * 0.6).toFixed(2)}px`);
    };
    apply();
    const off = subscribeScroll(apply);
    return () => {
      off();
      el.style.removeProperty("--ts");
    };
  }, [hydrated, motionOk]);

  return ref;
}
