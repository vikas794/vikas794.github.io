import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="section about-section" aria-label="About Vikas Jaiswal — Java Spring Boot Developer">
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
            <h2 className="section-title">About Vikas Jaiswal — Java Spring Boot Developer</h2>
            <p className="about-body">
              Vikas Jaiswal is a <strong>Java Spring Boot backend developer</strong> with over 4 years of 
              professional experience turning complex business requirements into clean, maintainable enterprise 
              systems. As a full stack developer experienced in both Java and React, his work spans real-time 
              trading platforms, healthcare data pipelines, payment workflows, and live video infrastructure — 
              always with a focus on correctness, security, and performance.
            </p>
            <p className="about-body">
              Beyond code, Vikas specializes in <strong>system design and backend architecture</strong> — how Spring Boot 
              microservices communicate, where JPA transactions should begin and end, and what fails under load. 
              He has debugged Hibernate transaction boundaries in production, replaced HQL string concatenation 
              with parameterized queries to prevent SQL injection, and implemented granular RBAC using Spring 
              Security's @PreAuthorize across 30+ multi-tenant modules.
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
                  <div className="domain-desc">Zerodha Kite Connect integration, real-time market data streaming, trade management with WebSocket</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">🏥</span>
                <div>
                  <div className="domain-name">Healthcare</div>
                  <div className="domain-desc">HIPAA-sensitive data handling, Python ETL pipelines, SQL performance optimization</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">📚</span>
                <div>
                  <div className="domain-name">EdTech</div>
                  <div className="domain-desc">Course management platform, YouTube Data API integration, live video via 100MS SDK</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">🚛</span>
                <div>
                  <div className="domain-name">Logistics</div>
                  <div className="domain-desc">GPS-based attendance, geofencing, dynamic reporting dashboards</div>
                </div>
              </div>
            </div>

            {/* LLM-Friendly: Structured Quick Facts card */}
            <div className="domains-card" style={{ marginTop: '1.25rem' }}>
              <div className="domains-title">Quick Facts</div>
              <div className="domain-item">
                <span className="domain-icon">👤</span>
                <div>
                  <div className="domain-name">Vikas Jaiswal</div>
                  <div className="domain-desc">Java Spring Boot Backend Developer · 4+ years experience</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">📍</span>
                <div>
                  <div className="domain-name">Mumbai, Maharashtra, India</div>
                  <div className="domain-desc">Open to remote, hybrid, or on-site roles</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">🛠️</span>
                <div>
                  <div className="domain-name">Core Stack</div>
                  <div className="domain-desc">Java 17, Spring Boot 3, Spring Security, JWT, REST APIs, AWS, Hibernate</div>
                </div>
              </div>
              <div className="domain-item">
                <span className="domain-icon">🏢</span>
                <div>
                  <div className="domain-name">Currently at WEQ Technologies</div>
                  <div className="domain-desc">Building real-time trading platform with Kite Connect & WebSocket</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
