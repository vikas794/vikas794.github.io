import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useTheme } from "../hooks/useTheme";
import { useHydrated } from "../hooks/useHydrated";
import { prefetchResumeAssets } from "../lib/prefetchResume";
import Navbar from "./doc/SiteHeader";
import Footer from "./doc/SiteFooter";
import BackToTop from "./doc/BackToTop";
import ErrorBoundary from "./ErrorBoundary";

// Route changes move focus to <main>, scroll to top, and announce via a
// polite live region. <main id="main" tabindex="-1"> — no redundant role=main.
export default function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    if (hydrated) prefetchResumeAssets();
  }, [hydrated]);

  useEffect(() => {
    // "instant" so the global smooth-scroll rule never animates the reset
    // underneath the route transition; hash links keep their own scroll.
    if (typeof window !== "undefined" && !location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    mainRef.current?.focus({ preventScroll: true });
    const path = location.pathname;
    if (liveRef.current) {
      liveRef.current.textContent = `Navigated to ${path}`;
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {hydrated && !reduce && <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX: progress }} />}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1} ref={mainRef}>
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
      <div ref={liveRef} className="sr-only" aria-live="polite" role="status" />
    </>
  );
}
