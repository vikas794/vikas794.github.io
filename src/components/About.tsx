import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-grid">
          <motion.div 
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65 }}
            className="about-left"
          >
            <div className="section-eyebrow">// who I am</div>
            <h2 className="section-title">A Builder at the Backend</h2>
            <p className="about-body">
              I'm a backend-first engineer who's spent 4+ years turning complex business 
              requirements into clean, maintainable Java systems. My work spans real-time 
              trading platforms, healthcare data pipelines, payment workflows, and live 
              video infrastructure — always with a focus on correctness, security, and performance.
            </p>
            <p className="about-body">
              Beyond code, I care about <strong>system design</strong> — how services talk 
              to each other, where transactions should begin and end, and what fails when 
              load spikes. I've debugged JPA transaction boundaries at 2 AM. I've replaced 
              HQL string concatenation with parameterized queries before it became a breach. 
              That attention to detail is what I bring to every team.
            </p>
            <div className="about-badges">
              <span className="about-badge">🏗️ System Design</span>
              <span className="about-badge">🔐 Security-first</span>
              <span className="about-badge">⚡ Performance tuning</span>
              <span className="about-badge">📐 Clean code</span>
              <span className="about-badge">🤝 Agile teams</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65 }}
            className="about-right"
          >
            <div className="domains-card">
              <div className="domains-title">Domains worked in</div>
              <div className="domain-item">
                <span className="domain-icon">📈</span>
                <div>
                  <div className="domain-name">FinTech / Algo Trading</div>
                  <div className="domain-desc">Zerodha Kite, real-time market data, trade management</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">🏥</span>
                <div>
                  <div className="domain-name">Healthcare</div>
                  <div className="domain-desc">HIPAA-sensitive data, ETL pipelines, SQL performance</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">📚</span>
                <div>
                  <div className="domain-name">EdTech</div>
                  <div className="domain-desc">Course management, YouTube API, live video (100MS)</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">🚛</span>
                <div>
                  <div className="domain-name">Logistics</div>
                  <div className="domain-desc">GPS attendance, geofencing, dynamic reporting</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
