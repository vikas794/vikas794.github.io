import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useHydrated } from "../hooks/useHydrated";

// The ONE shared entrance primitive, used consistently across every page —
// section entrances are opacity + a rise via variants with staggerChildren,
// never delay: i*0.1 (which grows unboundedly with list length).
// Reduced motion resolves to {opacity:1, y:0}: content PRESENT, not
// fast-faded. The trigger is "any part visible" (a fraction of a tall
// container can exceed a phone's viewport and never fire). Content must never depend on an animation firing to become
// visible — this component never truncates its children.
//
// Choreography: a group is one wave. `step` sets the gap between items and
// `rise` (per RevealItem) sets how far each travels, so the lead item can
// travel further than support items instead of every item moving the same.
const DEFAULT_STEP = 0.07;
const DEFAULT_RISE = 24;

const staggerParent = (step: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: 0.04 } },
});

const staggerChild: Variants = {
  hidden: (rise: number) => ({ opacity: 0, y: rise }),
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Reveal({
  children,
  className,
  step = DEFAULT_STEP,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
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
      variants={staggerParent(step)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  rise = DEFAULT_RISE,
}: {
  children: ReactNode;
  className?: string;
  rise?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={staggerChild} custom={rise}>
      {children}
    </motion.div>
  );
}
