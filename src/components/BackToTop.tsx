import { ArrowUp } from "lucide-react";
import { useScroll } from "../hooks/useScroll";

export default function BackToTop() {
  const visible = useScroll(500);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button 
      className={`back-to-top ${visible ? "visible" : ""}`} 
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
