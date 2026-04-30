import { useState, useCallback } from "react";
import { ExternalLink, X, Award, Eye } from "lucide-react";
import Modal from "./Modal";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  url: string;
  canEmbed: boolean;
  type: "google" | "microsoft";
}

const CERTS: Certificate[] = [
  {
    id: "google-skill-1",
    name: "Introduction to Generative AI, Google Cloud",
    issuer: "Google Cloud",
    url: "https://www.skills.google/public_profiles/473f841d-c7bd-493d-a580-34e95d39d039/badges/4599767",
    canEmbed: false, // Force false because Google blocks iframe embedding
    type: "google",
  },
  {
    id: "credly-1",
    name: "Microsoft Certified: Azure Data Fundamentals (DP-900)",
    issuer: "Microsoft",
    url: "https://www.credly.com/badges/e78e744f-b633-47b2-b53d-06b6b03f3099",
    canEmbed: false, // Credly blocks iframes
    type: "microsoft",
  },
  {
    id: "credly-2",
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    url: "https://www.credly.com/badges/976dd21a-0f47-4552-9afb-29bf515857c1",
    canEmbed: false, // Credly blocks iframes
    type: "microsoft",
  },
];

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const closePortal = useCallback(() => {
    setSelectedCert(null);
  }, []);

  return (
    <section id="certifications" className="section certs-section">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">// credentials</div>
          <h2 className="section-title">Certification Registry</h2>
        </div>

        <div className="certs-row">
          {CERTS.map((cert) => (
            <div
              key={cert.id}
              className="cert-card"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCert(cert)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedCert(cert); }}
            >
              <div className={`cert-logo ${cert.type === 'google' ? 'ggl' : 'ms'}`}>
                <Award size={22} />
              </div>
              <div className="flex-1">
                <div className="cert-name">{cert.name}</div>
                <div className="cert-issuer">{cert.issuer}</div>
              </div>
              <div className="text-text-dim">
                <Eye size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Following MapSection Pattern */}
      <Modal isOpen={!!selectedCert} onClose={closePortal}>
        <div className="cert-modal-header">
          <div>
            <div className="cert-modal-title">{selectedCert?.name}</div>
            <div className="cert-modal-subtitle">Direct Verification Pathway</div>
          </div>
          <button className="cert-close" onClick={closePortal} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="cert-modal-body">
          {selectedCert && (
            <div className="cert-preview-fallback">
              <div className="fallback-badge-preview">
                < Award size={80} className="text-accent opacity-50" />
              </div>
              <h3 className="cert-preview-title">{selectedCert.issuer} Secured Badge</h3>
              <p className="fallback-text">
                For security and authenticity, this credential is hosted on its respective
                official secure platform. Direct embedding is restricted to maintain record integrity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <a
                  href={selectedCert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <ExternalLink size={16} />
                  Validate Authenticity
                </a>
                <button className="btn btn-ghost" onClick={closePortal}>Return to Site</button>
              </div>
            </div>
          )}
        </div>

        <div className="cert-modal-footer">
          <div className="text-xs text-text-dim mr-auto hidden sm:block">
            Verified via {selectedCert?.issuer} official registry.
          </div>
          <button className="btn btn-ghost" onClick={closePortal}>Close</button>
          {selectedCert && (
            <a
              href={selectedCert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink size={16} />
              Open Registry Page
            </a>
          )}
        </div>
      </Modal>
    </section>
  );
}
