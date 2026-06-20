import { useState, useEffect } from "react";

// Singleton scroll manager to avoid multiple window listeners
const subscribers = new Set<(scrollY: number) => void>();

let isListenerAttached = false;

const handleScroll = () => {
  const scrollY = window.scrollY;
  subscribers.forEach((callback) => callback(scrollY));
};

export function useScroll(threshold: number): boolean {
  const [isScrolled, setIsScrolled] = useState(
    typeof window !== "undefined" ? window.scrollY > threshold : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isListenerAttached) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      isListenerAttached = true;
    }

    const checkScroll = (currentScrollY: number) => {
      setIsScrolled(currentScrollY > threshold);
    };

    subscribers.add(checkScroll);

    // Initial check
    checkScroll(window.scrollY);

    return () => {
      subscribers.delete(checkScroll);
      if (subscribers.size === 0) {
        window.removeEventListener("scroll", handleScroll);
        isListenerAttached = false;
      }
    };
  }, [threshold]);

  return isScrolled;
}
