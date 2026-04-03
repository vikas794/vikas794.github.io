import { motion } from "motion/react";

export default function Highlights() {
  const highlights = [
    {
      number: "01",
      icon: "📈",
      title: "FinTech Trading Platform",
      desc: "Real-time algo-trading backend with Kite Connect OAuth, WebSocket tick broadcast to concurrent users, Razorpay wallet with GST, and automated PDF payout generation stored on S3.",
      stack: "Kite Connect · WebSocket · Razorpay · iText7 · AWS S3"
    },
    {
      number: "02",
      icon: "🏥",
      title: "Healthcare Data Platform",
      desc: "High-availability backend for sensitive health records. JWT-secured REST APIs cut integration time 40%. Python ETL pipelines eliminated 80% of manual effort. Async multithreading: +30% throughput, −150ms latency.",
      stack: "JWT · Spring Security · ETL · @Async · MS SQL Server"
    },
    {
      number: "03",
      icon: "🔔",
      title: "Multi-Channel Notification Engine",
      desc: "Centralized async notification hub: FCM V1 push, WhatsApp Business API (Aisensy), and SMTP email. Non-blocking dispatch via @Async — notification load never touches the main request thread.",
      stack: "FCM V1 · Aisensy · SMTP · @Async · Spring Boot"
    },
    {
      number: "04",
      icon: "🎥",
      title: "Live Video Conferencing",
      desc: "100MS SDK integration with dynamic per-room JWT token generation for secure access control. EdTech modules: course progress tracking, lecture completion, and YouTube Data API for auto-fetching metadata.",
      stack: "100MS SDK · JWT · YouTube API · EdTech"
    },
    {
      number: "05",
      icon: "🔐",
      title: "Security Hardening",
      desc: "Replaced legacy HQL string concatenation with parameterized queries across all modules — closed SQL injection surface entirely. Implemented @PreAuthorize-based RBAC for granular multi-tenant permission control.",
      stack: "Spring Security · RBAC · Parameterized Queries · @PreAuthorize"
    },
    {
      number: "06",
      icon: "📊",
      title: "Database Performance",
      desc: "Redesigned MS SQL Server schemas for 10+ DDD-aligned modules. Indexing strategies cut report time in half. SQL rewrites at Wipro delivered 30% query performance uplift across production workloads.",
      stack: "MS SQL Server · DDD · Indexing · Query Optimization"
    }
  ];

  return (
    <section id="highlights" className="section highlights-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="section-header"
        >
          <div className="section-eyebrow">// notable work</div>
          <h2 className="section-title">Key Projects &amp; Highlights</h2>
        </motion.div>

        <div className="highlights-grid">
          {highlights.map((hl, i) => (
            <motion.div 
              key={hl.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="highlight-card"
            >
              <div className="hl-number">{hl.number}</div>
              <div className="hl-icon">{hl.icon}</div>
              <h3 className="hl-title">{hl.title}</h3>
              <p className="hl-desc">{hl.desc}</p>
              <div className="hl-stack">{hl.stack}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
