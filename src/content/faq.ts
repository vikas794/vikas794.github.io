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
];
