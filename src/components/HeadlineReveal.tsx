import { motion, useReducedMotion } from "motion/react";
import { useHydrated } from "../hooks/useHydrated";

// Word-by-word mask reveal for the page h1. Prerender, no-JS and reduced
// motion get the plain heading; the words stay real text with real spaces, so
// the accessible name is unchanged.
export default function HeadlineReveal({ id, text }: { id: string; text: string }) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();

  if (reduce || !hydrated) {
    return (
      <h1 id={id} className="t-display">
        {text}
      </h1>
    );
  }

  return (
    <h1 id={id} className="t-display" aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span className="word-mask">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          </span>{" "}
        </span>
      ))}
    </h1>
  );
}
