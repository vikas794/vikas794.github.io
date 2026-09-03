export interface ExperienceGroup {
  label: string;
  items: string[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  current: boolean;
  // One sentence of product context — what the system is — so bullets are evaluable.
  productContext: string;
  // Bullets grouped under mono sub-labels, weighted by recency.
  // Totals: WEQ 7, Medify 5, Wipro 3.
  groups: ExperienceGroup[];
  tech: string[];
}

export const experiences: Experience[] = [
  {
    period: "Jul 2025 — Present",
    role: "Software Developer",
    company: "WEQ Technologies · Mumbai",
    current: true,
    productContext:
      "A live algo-trading platform for retail traders: Zerodha Kite Connect market data and order execution, real-time WebSocket ticks, wallet billing, and payout invoicing.",
    groups: [
      {
        label: "SHIPPED",
        items: [
          "Engineered Zerodha Kite Connect OAuth integration and real-time market data streaming via WebSocket (STOMP) — supporting thousands of concurrent users on a live trading platform",
          "Designed a trade management system covering entry, exit, stop-loss, and bracket orders with Webhook-based real-time sync",
          "Built a multi-channel async notification engine: FCM V1, WhatsApp Business API (Aisensy), and SMTP — zero blocking on request threads via @Async",
          "Integrated 100MS SDK with per-room JWT token generation; built automated PDF invoices with iText7 + Thymeleaf → AWS S3",
        ],
      },
      {
        label: "HARDENED",
        items: [
          "Implemented granular RBAC using Spring Security @PreAuthorize across 30+ multi-tenant modules",
          "Replaced legacy HQL string concatenation with parameterized queries — eliminated SQL injection surface across all modules",
        ],
      },
      {
        label: "IMPROVED",
        items: [
          "Migrated 30+ modules to Java Time API (LocalDate / LocalDateTime) and standardized IST timezone handling",
        ],
      },
    ],
    tech: [
      "Java 17",
      "Spring Boot",
      "Spring Security",
      "JWT",
      "Kite Connect SDK",
      "WebSocket",
      "iText7",
      "AWS S3",
      "FCM V1",
      "Razorpay",
      "100MS SDK",
      "Angular",
    ],
  },
  {
    period: "Jan 2024 — Jul 2025",
    role: "Database Engineer & Backend Developer",
    company: "Medify Nexus · Mumbai",
    current: false,
    productContext:
      "A healthcare data platform handling sensitive health records: JWT-secured REST APIs for partner integrations, Python ETL ingestion, and MS SQL Server reporting.",
    groups: [
      {
        label: "SHIPPED",
        items: [
          "Built REST APIs secured with Spring Security + JWT for a healthcare platform — reduced external integration time by 40%",
          "Automated ETL pipelines (Python) for health record processing — eliminated 80% of manual data-handling effort",
        ],
      },
      {
        label: "HARDENED",
        items: [
          "Enforced header-based auth and externalized runtime configuration for secure, environment-agnostic deployments",
        ],
      },
      {
        label: "IMPROVED",
        items: [
          "Boosted API throughput 30% and cut response latency 150ms via multithreading and @Async",
          "Redesigned MS SQL Server schemas for 10+ modules using DDD principles; indexing strategies doubled report generation speed",
        ],
      },
    ],
    tech: ["Spring Security", "JWT", "MS SQL Server", "ETL / Python", "Multithreading", "@Async", "DDD", "Java 8+"],
  },
  {
    period: "Feb 2022 — Jan 2024",
    role: "Associate Software Engineer",
    company: "Wipro Pvt Ltd · Mumbai",
    current: false,
    productContext:
      "Enterprise backend services delivered across the full SDLC in Agile sprints — REST APIs backed by Hibernate and tuned SQL.",
    groups: [
      {
        label: "SHIPPED",
        items: [
          "Developed and maintained Java/Spring Boot/Hibernate backend services across the full SDLC",
          "Delivered 15+ RESTful APIs; rewrote SQL queries and schemas to improve performance by 30%",
        ],
      },
      {
        label: "TEAM",
        items: [
          "Collaborated in Agile sprints across a 7-person team using Jira and GitHub — peer reviews and design discussions included",
        ],
      },
    ],
    tech: ["Java", "Spring Boot", "Hibernate", "REST APIs", "Agile", "Jira"],
  },
];
