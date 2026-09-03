import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useHydrated } from "../hooks/useHydrated";

// The ONE shared entrance primitive, used consistently across every page —
// section entrances are opacity + y:10 via variants with staggerChildren
// .06, never delay: i*0.1 (which grows unboundedly with list length).
// Reduced motion resolves to {opacity:1, y:0}: content PRESENT, not
// fast-faded. Content must never depend on an animation firing to become
// visible — this component never truncates its children.
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
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();

  // Prerender / no-JS / reduced-motion: static, visible content.
  // (Hydration render agrees via the server snapshot, so no mismatch.)
  if (reduce || !hydrated) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
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
