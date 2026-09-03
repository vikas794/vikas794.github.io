export const SITE_URL = "https://vikas794.github.io";

export const CANONICAL_URL = (path: string) => {
  const p = path.endsWith("/") ? path : `${path}/`;
  return `${SITE_URL}${p === "/" ? "" : p}`;
};

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

export const profile = {
  name: "Vikas Jaiswal",
  firstName: "Vikas",
  lastName: "Jaiswal",
  headline: "I build the backends that move money, data, and messages",
  role: "Java Backend Developer",
  titleLong: "Java Spring Boot Backend Developer",
  badge: "Azure-Certified Java Backend Developer",
  experienceYears: 4,
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
  updated: "2026-04-03",
  // Hero ledger (right column must stand alone without a photo)
  ledger: [
    { label: "Role", value: "Java Backend Developer" },
    { label: "Stack", value: "Java 17 · Spring Boot 3 · MS SQL Server" },
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
