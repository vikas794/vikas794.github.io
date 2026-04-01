import { motion } from "motion/react";

export default function Certifications() {
  const certs = [
    {
      logo: "MS",
      logoClass: "ms",
      name: "Azure Fundamentals",
      issuer: "Microsoft · AZ-900"
    },
    {
      logo: "MS",
      logoClass: "ms",
      name: "Azure Data Fundamentals",
      issuer: "Microsoft · DP-900"
    },
    {
      logo: "G",
      logoClass: "ggl",
      name: "Introduction to Generative AI",
      issuer: "Google Cloud"
    }
  ];

  return (
    <section id="certifications" className="section certs-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="section-header"
        >
          <div className="section-eyebrow">// credentials</div>
          <h2 className="section-title">Certifications</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="certs-row"
        >
          {certs.map((cert, i) => (
            <div key={i} className="cert-card">
              <div className={`cert-logo ${cert.logoClass}`}>{cert.logo}</div>
              <div>
                <div className="cert-name">{cert.name}</div>
                <div className="cert-issuer">{cert.issuer}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
