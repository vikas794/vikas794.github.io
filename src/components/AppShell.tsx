import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { useTheme } from "../hooks/useTheme";
import { useHydrated } from "../hooks/useHydrated";
import { prefetchResumeAssets } from "../lib/prefetchResume";
import Navbar from "./doc/SiteHeader";
import Footer from "./doc/SiteFooter";
import BackToTop from "./doc/BackToTop";
import HeroSpotlight from "./HeroSpotlight";
import ErrorBoundary from "./ErrorBoundary";
import SmoothScroll from "../motion/SmoothScroll";
import RequestWire from "./RequestWire";
import ToastHost from "./Toast";
import Enhancements from "../motion/Enhancements";

// Route changes move focus to <main>, scroll to top, and announce via a
// polite live region. <main id="main" tabindex="-1"> — no redundant role=main.
export default function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

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
      <SmoothScroll />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Enhancements />
      <ToastHost />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1} ref={mainRef} className="relative isolate">
        <HeroSpotlight />
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
      <RequestWire />
      <div ref={liveRef} className="sr-only" aria-live="polite" role="status" />
    </>
  );
}
