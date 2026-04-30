import { motion } from "motion/react";

interface DomainItem {
  icon: string;
  name: string;
  desc: string;
}

const DOMAINS: DomainItem[] = [
  {
    icon: "📈",
    name: "FinTech / Algo Trading",
    desc: "Zerodha Kite Connect integration, real-time market data streaming, trade management with WebSocket"
  },
  {
    icon: "🏥",
    name: "Healthcare",
    desc: "HIPAA-sensitive data handling, Python ETL pipelines, SQL performance optimization"
  },
  {
    icon: "📚",
    name: "EdTech",
    desc: "Course management platform, YouTube Data API integration, live video via 100MS SDK"
  },
  {
    icon: "🚛",
    name: "Logistics",
    desc: "GPS-based attendance, geofencing, dynamic reporting dashboards"
  }
];

const QUICK_FACTS: DomainItem[] = [
  {
    icon: "👤",
    name: "Vikas Jaiswal",
    desc: "Java Spring Boot Backend Developer · 4+ years experience"
  },
  {
    icon: "📍",
    name: "Mumbai, Maharashtra, India",
    desc: "Open to remote, hybrid, or on-site roles"
  },
  {
    icon: "🛠️",
    name: "Core Stack",
    desc: "Java 17, Spring Boot 3, Spring Security, JWT, REST APIs, AWS, Hibernate"
  },
  {
    icon: "🏢",
    name: "Currently at WEQ Technologies",
    desc: "Building real-time trading platform with Kite Connect & WebSocket"
  }
];

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
              {DOMAINS.map((domain) => (
                <div key={domain.name} className="domain-item">
                  <span className="domain-icon">{domain.icon}</span>
                  <div>
                    <div className="domain-name">{domain.name}</div>
                    <div className="domain-desc">{domain.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* LLM-Friendly: Structured Quick Facts card */}
            <div className="domains-card" style={{ marginTop: '1.25rem' }}>
              <div className="domains-title">Quick Facts</div>
              {QUICK_FACTS.map((fact) => (
                <div key={fact.name} className="domain-item">
                  <span className="domain-icon">{fact.icon}</span>
                  <div>
                    <div className="domain-name">{fact.name}</div>
                    <div className="domain-desc">{fact.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
