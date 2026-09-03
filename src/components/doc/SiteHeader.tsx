import { useState } from "react";
import { Link } from "react-router";
import { Moon, Sun } from "lucide-react";

const NAV_LINKS = [
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

  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link to="/" className="font-serif text-xl tracking-tight no-underline" aria-label="Vikas Jaiswal — home">
          Vikas Jaiswal
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-small text-ink-2 no-underline hover:text-accent hover:underline"
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
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
            onClick={toggleTheme}
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
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-rule px-5 py-3 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.to} className="border-b border-rule last:border-0">
                <Link
                  to={l.to}
                  className="block py-3 no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
