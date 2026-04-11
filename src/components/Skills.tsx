import { motion } from "motion/react";
import { Server, Shield, Database, Zap, Box, Cloud } from "lucide-react";

const skills = [
  {
    title: "Core Backend",
    icon: <Server size={20} />,
    colorClass: "ic-blue",
    tags: ["Java 8", "Java 17", "Java 21", "Spring Boot", "Spring MVC", "Spring Data JPA", "Hibernate", "REST APIs", "Webhooks", "WebSocket (STOMP)"],
    accentTags: ["Java 17", "Java 21", "Spring Boot", "REST APIs"]
  },
  {
    title: "Security & Auth",
    icon: <Shield size={20} />,
    colorClass: "ic-green",
    tags: ["Spring Security", "JWT", "OAuth2", "RBAC", "@PreAuthorize", "Parameterized Queries", "AWS Parameter Store"],
    accentTags: ["Spring Security", "JWT", "OAuth2"]
  },
  {
    title: "Database",
    icon: <Database size={20} />,
    colorClass: "ic-orange",
    tags: ["MS SQL Server", "MySQL", "JPA / JPQL", "Query Optimization", "Indexing", "Stored Procedures", "DDD Schema Design"],
    accentTags: ["MS SQL Server", "Query Optimization"]
  },
  {
    title: "Performance",
    icon: <Zap size={20} />,
    colorClass: "ic-cyan",
    tags: ["Multithreading", "@Async", "Streams API", "Spring Scheduler", "ETL Pipelines", "Python", "Bash"],
    accentTags: ["Multithreading", "@Async"]
  },
  {
    title: "3rd Party SDKs",
    icon: <Box size={20} />,
    colorClass: "ic-purple",
    tags: ["Kite Connect", "Razorpay", "FCM V1", "WhatsApp API", "100MS SDK", "iText7", "YouTube Data API", "Thymeleaf"],
    accentTags: ["Kite Connect", "100MS SDK"]
  },
  {
    title: "Cloud & DevOps",
    icon: <Cloud size={20} />,
    colorClass: "ic-teal",
    tags: ["AWS S3", "CI/CD Pipelines", "Maven", "Git", "GitHub", "Postman", "Swagger/OpenAPI", "Linux CLI"],
    accentTags: ["AWS S3", "CI/CD Pipelines"]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="section-header"
        >
          <div className="section-eyebrow">// toolbox</div>
          <h2 className="section-title">Technical Skills — Java, Spring Boot &amp; Cloud</h2>
        </motion.div>

        <div className="skills-grid">
          {skills.map((skill, i) => (
            <motion.div 
              key={skill.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="skill-card"
            >
              <div className="skill-card-header">
                <div className={`skill-icon-wrap ${skill.colorClass}`}>
                  {skill.icon}
                </div>
                <div className="skill-card-title">{skill.title}</div>
              </div>
              <div className="skill-tags">
                {skill.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`tag ${skill.accentTags?.includes(tag) ? 'tag-accent' : ''}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
