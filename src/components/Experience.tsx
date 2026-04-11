import { motion } from "motion/react";

const experiences = [
    {
      period: "Jul 2025 — Present",
      role: "Software Developer",
      company: "WEQ Technologies · Mumbai",
      current: true,
      points: [
        "Engineered Zerodha Kite Connect OAuth integration and real-time market data streaming via WebSocket (STOMP) — supporting thousands of concurrent users on a live trading platform",
        "Designed a trade management system covering entry, exit, stop-loss, and bracket orders with Webhook-based real-time sync",
        "Implemented granular RBAC using Spring Security @PreAuthorize across 30+ multi-tenant modules",
        "Built a multi-channel async notification engine: FCM V1, WhatsApp Business API (Aisensy), and SMTP — zero blocking on request threads via @Async",
        "Integrated 100MS SDK with per-room JWT token generation; built automated PDF invoices with iText7 + Thymeleaf → AWS S3",
        "Replaced legacy HQL string concatenation with parameterized queries — eliminated SQL injection surface across all modules",
        "Migrated 30+ modules to Java Time API (LocalDate / LocalDateTime) and standardized IST timezone handling"
      ],
      tech: ["Java 17", "Spring Boot", "Spring Security", "JWT", "Kite Connect SDK", "WebSocket", "iText7", "AWS S3", "FCM V1", "Razorpay", "100MS SDK", "Angular"]
    },
    {
      period: "Jan 2024 — Jul 2025",
      role: "Database Engineer & Backend Developer",
      company: "Medify Nexus · Mumbai",
      current: false,
      points: [
        "Built REST APIs secured with Spring Security + JWT for a healthcare platform — reduced external integration time by 40%",
        "Boosted API throughput 30% and cut response latency 150ms via multithreading and @Async",
        "Automated ETL pipelines (Python) for health record processing — eliminated 80% of manual data-handling effort",
        "Redesigned MS SQL Server schemas for 10+ modules using DDD principles; indexing strategies doubled report generation speed",
        "Enforced header-based auth and externalized runtime configuration for secure, environment-agnostic deployments"
      ],
      tech: ["Spring Security", "JWT", "MS SQL Server", "ETL / Python", "Multithreading", "@Async", "DDD", "Java 8+"]
    },
    {
      period: "Feb 2022 — Jan 2024",
      role: "Associate Software Engineer",
      company: "Wipro Pvt Ltd · Mumbai",
      current: false,
      points: [
        "Developed and maintained Java/Spring Boot/Hibernate backend services across the full SDLC",
        "Delivered 15+ RESTful APIs; rewrote SQL queries and schemas to improve performance by 30%",
        "Collaborated in Agile sprints across a 7-person team using Jira and GitHub — peer reviews and design discussions included"
      ],
      tech: ["Java", "Spring Boot", "Hibernate", "REST APIs", "Agile", "Jira"]
    }
];

export default function Experience() {
  return (
    <section id="experience" className="section exp-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="section-header"
        >
          <div className="section-eyebrow">// career</div>
          <h2 className="section-title">Professional Experience</h2>
        </motion.div>

        <div className="exp-timeline">
          {experiences.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="exp-item"
            >
              <div className="exp-dot"></div>
              <div className="exp-card">
                <div className="exp-card-top">
                  <div>
                    <div className="exp-period">{exp.period}</div>
                    <h3 className="exp-role">{exp.role}</h3>
                    <div className="exp-company">{exp.company}</div>
                  </div>
                  {exp.current && <span className="exp-badge current">Current</span>}
                </div>
                <ul className="exp-list">
                  {exp.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
                <div className="exp-tech">
                  {exp.tech.map((tech, j) => (
                    <span key={j} className="tech">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
