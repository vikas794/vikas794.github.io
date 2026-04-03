export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-logo">[VJ]</span>
            <span className="footer-copy">© {new Date().getFullYear()} Vikas Jaiswal · Java Spring Boot Backend Developer · Mumbai, India</span>
          </div>
          <div className="footer-right">
            Built with ❤️ &amp; hosted on <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer">GitHub Pages</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
