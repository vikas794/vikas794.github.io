import { useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

// Pointer devices only: the child leans toward the cursor, up to 6px.
// Does nothing on touch, under reduced motion, or without JavaScript.
export default function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  function finePointer() {
    return typeof window !== "undefined" && !!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  }

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || reduce || !finePointer()) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transform = `translate(${(dx * 6).toFixed(1)}px, ${(dy * 4).toFixed(1)}px)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <span ref={ref} className={`magnetic ${className ?? ""}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </span>
  );
}
