import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useHydrated } from "../hooks/useHydrated";

// Counts a leading number up once, when it scrolls into view. The final
// value is always the server-rendered text, so no-JS, prerender and reduced
// motion all show the real number. Values with words after the number
// (for example "1 → Thousands") are left alone.
const COUNTABLE = /^([+\-−]?)(\d[\d,]*)([%x×]?)$/;

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const hydrated = useHydrated();

  useEffect(() => {
    const node = ref.current;
    const match = COUNTABLE.exec(value);
    if (!node || !match || !inView || reduce || !hydrated) return;
    const target = Number(match[2].replace(/,/g, ""));
    if (target === 0) return;
    const sign = match[1];
    const suffix = match[3];
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${sign}${Math.round(v).toLocaleString("en-US")}${suffix}`;
      },
      onComplete: () => {
        node.textContent = value;
      },
    });
    return () => {
      controls.stop();
      node.textContent = value;
    };
  }, [inView, reduce, hydrated, value]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {value}
    </span>
  );
}
