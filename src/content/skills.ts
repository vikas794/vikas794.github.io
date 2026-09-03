// Accuracy note: breadth is Java 8 through 25, with Spring Boot 4 current.
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
    tags: ["Java 8", "Java 17", "Java 21", "Java 25", "Spring Boot 3", "Spring Boot 4", "Spring MVC", "Spring Data JPA", "Hibernate", "REST APIs", "Webhooks", "WebSocket (STOMP)"],
    accentTags: ["Java 25", "Spring Boot 4", "REST APIs"],
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
// "Certified" surfaces credentials on the home page itself — the full
// list with verification links lives on /about/ and /resume/.
export const skillLedger: { label: string; value: string }[] = [
  { label: "Backend", value: "Java 8–25, Spring Boot 3/4, Spring MVC, Hibernate, REST APIs" },
  { label: "Security", value: "Spring Security, JWT, OAuth2, RBAC, parameterized queries" },
  { label: "Data", value: "MS SQL Server, MySQL, indexing, DDD schema design" },
  { label: "Frontend", value: "Angular, TypeScript, PrimeNG, Thymeleaf, HTML5, SCSS" },
  { label: "Certified", value: "Azure AZ-900, Azure DP-900, Google Cloud GenAI" },
];
