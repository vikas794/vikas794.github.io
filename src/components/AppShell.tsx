import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { useTheme } from "../hooks/useTheme";
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
  // The very first paint (SSR + hydration) already looks right — only the
  // navigations that follow should play the entrance animation. A plain
  // CSS animation (not JS-driven) so it isn't at the mercy of rAF
  // throttling and replays for free whenever `key` forces a remount.
  const skipEntrance = useRef(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    mainRef.current?.focus({ preventScroll: true });
    const path = location.pathname;
    if (liveRef.current) {
      liveRef.current.textContent = `Navigated to ${path}`;
    }
    skipEntrance.current = false;
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1} ref={mainRef}>
        <div key={location.pathname} className={skipEntrance.current ? undefined : "page-enter"}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
      <BackToTop />
      <div ref={liveRef} className="sr-only" aria-live="polite" role="status" />
    </>
  );
}
