import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useHydrated } from "../hooks/useHydrated";
import Mark from "./Mark";

// Page h1 with an optional highlighted phrase. Animated: each word rises out
// of its own mask, then the highlighter draws. Prerender, no-JS and reduced
// motion get the plain heading (the highlight still shows, it is CSS). The
// words stay real text with real spaces, so the accessible name is unchanged.
function split(text: string, highlight?: string) {
  const i = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || i < 0) return { before: text, marked: "", after: "" };
  return { before: text.slice(0, i), marked: highlight, after: text.slice(i + highlight.length) };
}

export default function HeadlineReveal({
  id,
  text,
  highlight,
  className = "t-display",
}: {
  id: string;
  text: string;
  highlight?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const { before, marked, after } = split(text, highlight);

  if (reduce || !hydrated) {
    return (
      <h1 id={id} className={className}>
        {before}
        {marked && <Mark>{marked}</Mark>}
        {after}
      </h1>
    );
  }

  let n = 0;
  const words = (chunk: string): ReactNode[] =>
    chunk
      .split(/(\s+)/)
      .filter((w) => w.length > 0)
      .map((w, k) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <span key={k} className="word-mask">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.07 * n++, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          </span>
        )
      );

  return (
    <h1 id={id} className={className} aria-label={text}>
      {words(before)}
      {marked && <Mark>{words(marked)}</Mark>}
      {words(after)}
    </h1>
  );
}
