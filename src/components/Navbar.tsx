import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

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
            <a href="#about" className="nav-link">about</a>
            <a href="#skills" className="nav-link">skills</a>
            <a href="#experience" className="nav-link">exp</a>
            <a href="#highlights" className="nav-link">work</a>
            <a href="#contact" className="nav-link">contact</a>
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
        <a href="#about" className="mobile-link" onClick={() => setMenuOpen(false)}>about</a>
        <a href="#skills" className="mobile-link" onClick={() => setMenuOpen(false)}>skills</a>
        <a href="#experience" className="mobile-link" onClick={() => setMenuOpen(false)}>experience</a>
        <a href="#highlights" className="mobile-link" onClick={() => setMenuOpen(false)}>highlights</a>
        <a href="#contact" className="mobile-link" onClick={() => setMenuOpen(false)}>contact</a>
      </div>
    </>
  );
}
