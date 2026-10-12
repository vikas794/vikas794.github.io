import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { runViewTransition } from "../../lib/viewTransition";
import { useHydrated } from "../../hooks/useHydrated";
import { useScroll } from "../../hooks/useScroll";
import { useMotionOk } from "../../motion/media";
import { useScrollDirection } from "../../motion/scrollState";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about/", label: "About" },
  { to: "/experience/", label: "Experience" },
  { to: "/projects/", label: "Work" },
  { to: "/resume/", label: "Résumé" },
  { to: "/contact/", label: "Contact" },
];

export default function SiteHeader({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [sliderReady, setSliderReady] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const pastTop = useScroll(80);
  const direction = useScrollDirection();

  // Hide on the way down, come back on any upward scroll. Always visible at
  // the top, with the menu open, or while something inside has focus.
  const hidden = hydrated && motionOk && pastTop && direction === "down" && !menuOpen && !focusWithin;

  // One highlighter that slides to the active link instead of jumping.
  // Until this runs, the per-link active style (CSS) is the fallback.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !hydrated) return;
    const place = () => {
      const link = nav.querySelector<HTMLElement>('.nav-link[aria-current="page"]');
      if (!link) {
        setSliderReady(false);
        return;
      }
      const h = parseFloat(getComputedStyle(link).fontSize) * 0.5;
      nav.style.setProperty("--sx", `${link.offsetLeft}px`);
      nav.style.setProperty("--sy", `${link.offsetTop + link.offsetHeight - h - 1}px`);
      nav.style.setProperty("--sw", `${link.offsetWidth}px`);
      nav.style.setProperty("--sh", `${h}px`);
      setSliderReady(true);
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [hydrated, pathname]);

  // Slow soft-edged circular reveal from the button, via the View Transitions API. Falls
  // back to an instant swap when the API is unsupported or the user has
  // asked for reduced motion — toggleTheme() itself never changes.
  function handleThemeToggle(event: MouseEvent<HTMLButtonElement>) {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    // Full document extent, not just the viewport — the reveal has to
    // cover the whole scrollable page the transition snapshots, not just
    // whatever's on screen at click time.
    const doc = document.documentElement;
    const radius = Math.hypot(
      Math.max(x, doc.scrollWidth - x),
      Math.max(y, doc.scrollHeight - y)
    );
    doc.style.setProperty("--theme-x", `${x}px`);
    doc.style.setProperty("--theme-y", `${y}px`);
    doc.style.setProperty("--theme-r", `${radius}px`);
    runViewTransition("theme", toggleTheme);
  }

  return (
    <header
      className="vt-persist-header site-header border-b border-rule"
      data-hidden={hidden ? "true" : "false"}
      onFocus={() => setFocusWithin(true)}
      onBlur={() => setFocusWithin(false)}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          to="/"
          className="wordmark font-serif text-xl font-medium tracking-tight no-underline"
          aria-label="Vikas Jaiswal — home"
        >
          Vikas Jaiswal
          <span className="wordmark-dot" aria-hidden="true" />
        </Link>
        <nav
          ref={navRef}
          className="nav-primary relative hidden items-center gap-6 md:flex"
          aria-label="Primary"
          data-slider={sliderReady ? "on" : "off"}
        >
          {sliderReady && <span className="nav-slider" aria-hidden="true" />}
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-decode
              className={({ isActive }) =>
                `nav-link text-small no-underline hover:text-accent ${
                  isActive ? "text-accent" : "text-ink-2"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleThemeToggle}
            className="theme-toggle"
            aria-label="Toggle theme"
            data-theme={theme}
          >
            <span className="theme-icon theme-icon-sun" aria-hidden={theme !== "dark"}>
              <Sun size={18} />
            </span>
            <span className="theme-icon theme-icon-moon" aria-hidden={theme !== "light"}>
              <Moon size={18} />
            </span>
          </button>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={handleThemeToggle}
            className="theme-toggle"
            aria-label="Toggle theme"
            data-theme={theme}
          >
            <span className="theme-icon theme-icon-sun" aria-hidden={theme !== "dark"}>
              <Sun size={18} />
            </span>
            <span className="theme-icon theme-icon-moon" aria-hidden={theme !== "light"}>
              <Moon size={18} />
            </span>
          </button>
          <button
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-rule-strong"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-rule px-5 py-3 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.to} className="border-b border-rule last:border-0">
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `block py-3 no-underline ${isActive ? "text-accent" : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
