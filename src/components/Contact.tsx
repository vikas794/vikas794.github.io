import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Linkedin, Github, Twitter, MessageCircle, MapPin } from "lucide-react";
import { lazy, Suspense } from "react";

const MapSection = lazy(() => import("./MapSection"));

interface ContactProps {
  theme: "light" | "dark";
}

export default function Contact({ theme }: ContactProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const textColor = theme === "dark" ? "a0a0c0" : "495057";
  const titleColor = theme === "dark" ? "6c63ff" : "5c53df";
  const iconColor = theme === "dark" ? "6c63ff" : "5c53df";
  const bgTheme = theme === "dark" ? "transparent" : "transparent";

  return (
    <>
      <section id="contact" className="section contact-section" aria-label="Contact Vikas Jaiswal — Java Spring Boot Developer">
        <div className="container">
          <div className="contact-grid">
            <motion.div 
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65 }}
              className="contact-left"
            >
              <div className="section-eyebrow">// let's connect</div>
              <h2 className="contact-heading">Open to Work.<br/><span className="contact-heading-accent">Let's Talk.</span></h2>
              <p className="contact-sub">Backend engineering roles, interesting product teams, or challenging technical problems. Based in Mumbai — remote or hybrid welcome.</p>

              <div className="contact-links">
                <a href="mailto:vikasjaiswal794@gmail.com" className="contact-link">
                  <div className="cl-icon"><Mail size={18} /></div>
                  <div>
                    <div className="cl-label">Email</div>
                    <div className="cl-value">vikasjaiswal794@gmail.com</div>
                  </div>
                </a>

                <a href="https://www.linkedin.com/in/vikasjaiswall/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="cl-icon"><Linkedin size={18} /></div>
                  <div>
                    <div className="cl-label">LinkedIn</div>
                    <div className="cl-value">linkedin.com/in/vikasjaiswall</div>
                  </div>
                </a>

                <a href="https://github.com/vikas794" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="cl-icon"><Github size={18} /></div>
                  <div>
                    <div className="cl-label">GitHub</div>
                    <div className="cl-value">github.com/vikas794</div>
                  </div>
                </a>

                <a href="https://x.com/VikasJa09548053" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="cl-icon"><Twitter size={18} /></div>
                  <div>
                    <div className="cl-label">X (Twitter)</div>
                    <div className="cl-value">@VikasJa09548053</div>
                  </div>
                </a>

                <a href="https://wa.me/918291519911" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="cl-icon"><MessageCircle size={18} /></div>
                  <div>
                    <div className="cl-label">WhatsApp</div>
                    <div className="cl-value">+91 82915 19911</div>
                  </div>
                </a>

                <a href="https://t.me/Vikas7" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="cl-icon">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="m11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </div>
                  <div>
                    <div className="cl-label">Telegram</div>
                    <div className="cl-value">t.me/Vikas7</div>
                  </div>
                </a>

                <div 
                  className="contact-link contact-link-location" 
                  role="button" 
                  tabIndex={0} 
                  title="View on map"
                  onClick={() => setIsMapOpen(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsMapOpen(true); }}
                >
                  <div className="cl-icon"><MapPin size={18} /></div>
                  <div>
                    <div className="cl-label">Location</div>
                    <div className="cl-value">Santacruz, Mumbai 400055 <span className="map-hint">↗ map</span></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65 }}
              className="contact-right"
            >
              <div className="github-stats-card">
                <div className="gs-title">GitHub Activity</div>
                {/* GitHub Stats Card */}
                <img
                  src={`https://ghstats.dev/api/card?username=vikas794&theme=${theme === 'dark' ? 'dark' : 'gruvbox'}&hide_title=true&border_radius=14`}
                  alt="Vikas GitHub stats"
                  className="gh-stats-img"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Top Languages */}
                <img
                  src={`https://ghstats.dev/api/langs?username=vikas794&theme=${theme === 'dark' ? 'dark' : 'gruvbox'}&hide_border=true&hide_title=true&border_radius=14`}
                  alt="Top languages"
                  className="gh-stats-img"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <img 
                  src={`https://streak-stats.demolab.com?user=vikas794&locale=en&mode=daily&theme=${theme === 'dark' ? 'transparent' : 'gruvbox'}`} 
                  alt="GitHub streak"
                  className="gh-stats-img"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <MapSection isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      </Suspense>
    </>
  );
}
