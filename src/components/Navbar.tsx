import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const NAV_LINKS = [
  { href: "#about", desktopLabel: "about", mobileLabel: "about" },
  { href: "#skills", desktopLabel: "skills", mobileLabel: "skills" },
  { href: "#experience", desktopLabel: "exp", mobileLabel: "experience" },
  { href: "#highlights", desktopLabel: "work", mobileLabel: "highlights" },
  { href: "#certifications", desktopLabel: "certs", mobileLabel: "certs" },
  { href: "#contact", desktopLabel: "contact", mobileLabel: "contact" },
];

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`} id="nav">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            <span className="logo-bracket">[</span>VJ<span className="logo-bracket">]</span>
          </a>
          <nav className="nav-links" id="navLinks">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="nav-link">{link.desktopLabel}</a>
            ))}
            <button 
              onClick={toggleTheme} 
              className="ml-4 p-2 rounded-full hover:bg-surface2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} className="text-text-muted hover:text-accent" /> : <Moon size={18} className="text-text-muted hover:text-accent" />}
            </button>
          </nav>
          
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-surface2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} className="text-text-muted" /> : <Moon size={18} className="text-text-muted" />}
            </button>
            <button 
              className={`hamburger ${menuOpen ? "open" : ""}`} 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} id="mobileMenu">
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
            {link.mobileLabel}
          </a>
        ))}
      </div>
    </>
  );
}
