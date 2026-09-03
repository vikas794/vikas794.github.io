// Accuracy note: Java 21 removed (bank supports Java 8+ / Java 17 only).
// Frontend is Angular / TypeScript / PrimeNG / Thymeleaf / HTML5 / SCSS —
// React appears only as this portfolio's implementation stack, never as a
// professional skill.

export type SkillIconName = "Server" | "Shield" | "Database" | "Zap" | "Box" | "Cloud" | "Layout";

export interface SkillGroup {
  title: string;
  iconName: SkillIconName;
  tags: string[];
  accentTags: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Core Backend",
    iconName: "Server",
    tags: ["Java 8", "Java 17", "Spring Boot", "Spring MVC", "Spring Data JPA", "Hibernate", "REST APIs", "Webhooks", "WebSocket (STOMP)"],
    accentTags: ["Java 17", "Spring Boot", "REST APIs"],
  },
  {
    title: "Security & Auth",
    iconName: "Shield",
    tags: ["Spring Security", "JWT", "OAuth2", "RBAC", "@PreAuthorize", "Parameterized Queries", "AWS Parameter Store"],
    accentTags: ["Spring Security", "JWT", "OAuth2"],
  },
  {
    title: "Database",
    iconName: "Database",
    tags: ["MS SQL Server", "MySQL", "JPA / JPQL", "Query Optimization", "Indexing", "Stored Procedures", "DDD Schema Design"],
    accentTags: ["MS SQL Server", "Query Optimization"],
  },
  {
    title: "Performance",
    iconName: "Zap",
    tags: ["Multithreading", "@Async", "Streams API", "Spring Scheduler", "ETL Pipelines", "Python", "Bash"],
    accentTags: ["Multithreading", "@Async"],
  },
  {
    title: "3rd Party SDKs",
    iconName: "Box",
    tags: ["Kite Connect", "Razorpay", "FCM V1", "WhatsApp API", "100MS SDK", "iText7", "YouTube Data API", "Thymeleaf"],
    accentTags: ["Kite Connect", "100MS SDK"],
  },
  {
    title: "Cloud & DevOps",
    iconName: "Cloud",
    tags: ["AWS S3", "CI/CD Pipelines", "Maven", "Git", "GitHub", "Postman", "Swagger/OpenAPI", "Linux CLI"],
    accentTags: ["AWS S3", "CI/CD Pipelines"],
  },
  {
    title: "Frontend (working knowledge)",
    iconName: "Layout",
    tags: ["Angular", "TypeScript", "PrimeNG", "Thymeleaf", "HTML5", "SCSS"],
    accentTags: ["Angular", "TypeScript"],
  },
];

// Condensed ledger groups for the home page "What I work with" block.
export const skillLedger: { label: string; value: string }[] = [
  { label: "Backend", value: "Java 8, Java 17, Spring Boot 3, Spring MVC, Hibernate, REST APIs" },
  { label: "Security", value: "Spring Security, JWT, OAuth2, RBAC, parameterized queries" },
  { label: "Data", value: "MS SQL Server, MySQL, indexing, DDD schema design" },
  { label: "Frontend", value: "Angular, TypeScript, PrimeNG, Thymeleaf, HTML5, SCSS" },
];
