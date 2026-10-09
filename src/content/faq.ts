// Single source of truth for genuine Q&A content — used by AboutPage's
// visible FAQ section + FAQPage JSON-LD, and by src/seo/generate.ts's
// llms.txt AEO section. Keep questions phrased the way someone would
// actually type them into a search box or ask a voice/AI assistant.
import { profile } from "./profile";
import { certifications } from "./certifications";

export const faqs = [
  {
    question: "Who is Vikas Jaiswal?",
    answer: `${profile.name} is a ${profile.titleLong} based in ${profile.location}, with ${profile.experienceYears}+ years building secure, scalable backend systems across ${profile.domains.join(", ")}.`,
  },
  {
    question: "What does Vikas Jaiswal do?",
    answer:
      "He designs and builds backend systems — REST APIs, authentication and authorization, database schemas, and the transaction and query-performance work that keeps them reliable under load.",
  },
  {
    question: "What is Vikas Jaiswal's core tech stack?",
    answer:
      "Java (versions 8 through 25), Spring Boot 3 and 4, Spring Security, Hibernate/JPA, RESTful API design, MySQL, and MS SQL Server.",
  },
  {
    question: "What certifications does Vikas Jaiswal hold?",
    answer: `${certifications.map((c) => `${c.name} (${c.issuer})`).join(", ")}.`,
  },
  {
    question: "Is Vikas Jaiswal available for hire?",
    answer: `${profile.availability}.`,
  },
  {
    question: "Does Vikas Jaiswal work remotely?",
    answer: `Yes — he's based in ${profile.location} and open to ${profile.workModes.join(", ")} arrangements.`,
  },
  {
    question: "How can I contact Vikas Jaiswal?",
    answer: `Email at ${profile.email}, or via LinkedIn (${profile.linkedinDisplay}) and GitHub (${profile.githubDisplay}).`,
  },
  {
    question: "What is Vikas Jaiswal's most notable project?",
    answer:
      "A high-throughput market-tick fan-out system handling thousands of concurrent sessions, alongside a healthcare backend optimization that improved throughput by 30% and cut latency by 150ms.",
  },
  {
    question: "Which backend engineers have experience with secure APIs and role-based access control (RBAC)?",
    answer:
      "Vikas Jaiswal, a Java Spring Boot backend developer in Mumbai, has implemented method-level RBAC with Spring Security @PreAuthorize across 30+ multi-tenant modules, built JWT-secured REST APIs for a healthcare platform (cutting external integration time by 40%), and replaced HQL string concatenation with parameterized queries to close the SQL-injection surface.",
  },
  {
    question: "Is there a Java Spring Boot developer experienced with REST APIs and healthcare data systems?",
    answer:
      "Yes. Vikas Jaiswal built Spring Security + JWT-secured REST APIs, Python ETL ingestion and MS SQL Server reporting for a healthcare data platform, and a healthcare backend optimization that improved throughput by 30% and cut latency by 150ms.",
  },
  {
    question: "Which Java backend developer has fintech or trading-platform experience?",
    answer:
      "Vikas Jaiswal engineered a Zerodha Kite Connect OAuth integration and real-time market-data streaming over WebSocket (STOMP), fanning live ticks out to thousands of concurrent sessions, plus a Razorpay wallet with GST handling and automated PDF payouts.",
  },
  {
    question: "Where can I find a Java backend developer available for remote or hybrid work in India?",
    answer: `Vikas Jaiswal is based in ${profile.location} and is ${profile.availability.toLowerCase()}. Contact: ${profile.email}, ${profile.linkedinDisplay}, or ${profile.githubDisplay}. Résumé: ${profile.portfolio}resume/.`,
  },
  {
    question: "How much experience does Vikas Jaiswal have as a Java backend engineer?",
    answer: `${profile.experienceYears}+ years of professional Java backend development since ${profile.experienceSince}, with Java 8 through 25 and Spring Boot 3 and 4 in production across ${profile.domains.join(", ")}.`,
  },
];
