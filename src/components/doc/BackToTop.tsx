import { ArrowUp } from "lucide-react";
import { useScroll } from "../../hooks/useScroll";
import { scrollToTarget } from "../../motion/lenisInstance";

export default function BackToTop() {
  const visible = useScroll(500);

  if (!visible) return null;

  return (
    <button
      className="vt-persist-fab fixed bottom-4 right-3 z-40 opacity-90 md:bottom-6 md:right-6 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-rule-strong bg-paper text-ink"
      onClick={() => scrollToTarget(0, Math.min(1.4, 0.5 + window.scrollY / 4000))}
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
