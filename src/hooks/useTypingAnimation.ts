import { useState, useEffect } from "react";

export function useTypingAnimation(phrases: string[]) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timeout: NodeJS.Timeout;

    if (deleting) {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx((c) => c - 1), 45);
      } else {
        setDeleting(false);
        setPhraseIdx((p) => (p + 1) % phrases.length);
      }
    } else {
      if (charIdx < phrase.length) {
        timeout = setTimeout(() => setCharIdx((c) => c + 1), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases]);

  return phrases[phraseIdx].slice(0, charIdx);
}
