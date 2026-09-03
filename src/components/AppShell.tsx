import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { useTheme } from "../hooks/useTheme";
import Navbar from "./doc/SiteHeader";
import Footer from "./doc/SiteFooter";
import BackToTop from "./doc/BackToTop";

// Route changes move focus to <main>, scroll to top, and announce via a
// polite live region. <main id="main" tabindex="-1"> — no redundant role=main.
export default function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    mainRef.current?.focus({ preventScroll: true });
    const path = location.pathname;
    if (liveRef.current) {
      liveRef.current.textContent = `Navigated to ${path}`;
    }
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1} ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <div ref={liveRef} className="sr-only" aria-live="polite" role="status" />
    </>
  );
}
