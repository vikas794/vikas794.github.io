import { useState, type MouseEvent } from "react";
import { Link, NavLink } from "react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { runViewTransition } from "../../lib/viewTransition";

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

  // Circular reveal from the button, via the View Transitions API. Falls
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
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link to="/" className="font-serif text-xl tracking-tight no-underline" aria-label="Vikas Jaiswal — home">
          Vikas Jaiswal
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-small no-underline hover:text-accent hover:underline ${
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
