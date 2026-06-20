import { useState } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { lazy, Suspense } from "react";
import { contactLinks } from "../data/contact";

const MapSection = lazy(() => import("./MapSection"));
import MapLoadingFallback from "./MapLoadingFallback";

interface ContactProps {
  theme: "light" | "dark";
}

export default function Contact({ theme }: ContactProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

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
                {contactLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target={link.id !== "email" ? "_blank" : undefined}
                    rel={link.id !== "email" ? "noopener noreferrer" : undefined}
                    className="contact-link"
                  >
                    <div className="cl-icon">{link.icon}</div>
                    <div className="cl-content">
                      <div className="cl-label">{link.label}</div>
                      <div className="cl-value">{link.value}</div>
                    </div>
                  </a>
                ))}

                <div 
                  className="contact-link contact-link-location" 
                  role="button" 
                  tabIndex={0} 
                  title="View on map"
                  onClick={() => setIsMapOpen(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsMapOpen(true); }}
                >
                  <div className="cl-icon"><MapPin size={18} /></div>
                  <div className="cl-content">
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

      <Suspense fallback={<MapLoadingFallback isOpen={isMapOpen} />}>
        <MapSection isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      </Suspense>
    </>
  );
}
