import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useHydrated } from "../hooks/useHydrated";

// The ONE shared entrance primitive. Section entrances are opacity + y:10
// via variants with staggerChildren .06 capped at 5 children — never
// delay: i*0.1 (a 600ms wait at i=6). Reduced motion resolves to
// {opacity:1, y:0}: content PRESENT, not fast-faded. Content must never
// depend on an animation firing to become visible.
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Reveal({
  children,
  className,
  limit = 5,
}: {
  children: ReactNode;
  className?: string;
  limit?: number;
}) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const items = Array.isArray(children) ? children.slice(0, limit) : children;

  // Prerender / no-JS / reduced-motion: static, visible content.
  // (Hydration render agrees via the server snapshot, so no mismatch.)
  if (reduce || !hydrated) {
    return <div className={className}>{items}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
