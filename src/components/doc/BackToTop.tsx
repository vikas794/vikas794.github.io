import { ArrowUp } from "lucide-react";
import { useScroll } from "../../hooks/useScroll";

export default function BackToTop() {
  const visible = useScroll(500);

  if (!visible) return null;

  return (
    <button
      className="fixed bottom-6 right-6 z-40 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-rule-strong bg-paper text-ink"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
