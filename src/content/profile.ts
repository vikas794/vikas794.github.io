export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
}

// Single canonical Telegram handle — previously drifted between
// t.me/Vikas7 (Contact, llms.txt) and t.me/Vikas710 (JSON-LD).
// Canonical choice: Vikas7 (matches Contact + llms.txt majority).
export const TELEGRAM_HANDLE = "Vikas7";
export const TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE}`;

// Single source of truth for career start; years are derived so "N+ years"
// copy never goes stale (rebuilt monthly by scheduled-rebuild.yml).
const EXPERIENCE_START = new Date(Date.UTC(2022, 1, 1)); // Feb 2022

export function computeExperienceYears(now: Date = new Date()): number {
  let years = now.getUTCFullYear() - EXPERIENCE_START.getUTCFullYear();
  if (now.getUTCMonth() < EXPERIENCE_START.getUTCMonth()) years -= 1;
  return Math.max(years, 0);
}

export const profile = {
  name: "Vikas Jaiswal",
  firstName: "Vikas",
  lastName: "Jaiswal",
  headline: "I build the backends that move money, data, and messages",
  role: "Java Backend Developer",
  roleShort: "Java Developer",
  alternateNames: [
    "Vikas Jaiswal Java Developer",
    "Vikas Java Developer",
    "Vikas Jaiswal Spring Boot Developer",
  ] as readonly string[],
  titleLong: "Java Spring Boot Backend Developer",
  badge: "Azure-Certified Java Backend Developer",
  experienceYears: computeExperienceYears(),
  experienceSince: "Feb 2022",
  location: "Mumbai, India",
  locality: "Mumbai",
  region: "Maharashtra",
  country: "IN",
  postalAddress: "Santacruz, Mumbai 400055",
  availability: "Open to backend engineering roles — remote or hybrid",
  workModes: ["remote", "hybrid", "on-site"] as const,
  email: "vikasjaiswal794@gmail.com",
  phoneDisplay: "+91 82915 19911",
  phoneHref: "+918291519911",
  linkedin: "https://www.linkedin.com/in/vikasjaiswall/",
  linkedinDisplay: "linkedin.com/in/vikasjaiswall",
  github: "https://github.com/vikas794",
  githubDisplay: "github.com/vikas794",
  twitter: "https://x.com/VikasJa09548053",
  twitterHandle: "@VikasJa09548053",
  whatsapp: "https://wa.me/918291519911",
  telegram: TELEGRAM_URL,
  telegramDisplay: `t.me/${TELEGRAM_HANDLE}`,
  portfolio: "https://vikas794.github.io/",
  languages: ["English", "Hindi"] as const,
  domains: ["FinTech", "Healthcare", "EdTech", "Logistics"] as const,
  // Site content revision — feeds sitemap lastmod for pages without their
  // own item date. Bump only when page content actually changes.
  updated: "2026-10-09",
  // Hero ledger (right column must stand alone without a photo)
  ledger: [
    { label: "Role", value: "Java Backend Developer" },
    { label: "Stack", value: "Java 8–25 · Spring Boot 4 · MS SQL Server" },
    { label: "Location", value: "Mumbai, India" },
    { label: "Availability", value: "Open to work — remote / hybrid" },
  ] as const,
  channels: [
    { id: "email", label: "Email", value: "vikasjaiswal794@gmail.com", href: "mailto:vikasjaiswal794@gmail.com" },
    { id: "linkedin", label: "LinkedIn", value: "linkedin.com/in/vikasjaiswall", href: "https://www.linkedin.com/in/vikasjaiswall/" },
    { id: "github", label: "GitHub", value: "github.com/vikas794", href: "https://github.com/vikas794" },
    { id: "twitter", label: "X (Twitter)", value: "@VikasJa09548053", href: "https://x.com/VikasJa09548053" },
    { id: "whatsapp", label: "WhatsApp", value: "+91 82915 19911", href: "https://wa.me/918291519911" },
    { id: "telegram", label: "Telegram", value: `t.me/${TELEGRAM_HANDLE}`, href: TELEGRAM_URL },
  ] as ContactChannel[],
};
