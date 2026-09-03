import { profile } from "../content/profile";
import { experiences } from "../content/experience";
import { certifications } from "../content/certifications";
import { caseStudies } from "../content/projects";
import { SITE_URL } from "./site";

// All JSON-LD derives from src/content — the five-way drift
// (inline JSX ↔ index.html ↔ llms.txt ↔ sitemap ↔ noscript) is impossible.
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    givenName: profile.firstName,
    familyName: profile.lastName,
    url: `${SITE_URL}/`,
    jobTitle: profile.titleLong,
    description: `${profile.name} is a ${profile.titleLong} with ${profile.experienceYears}+ years of professional experience building secure, scalable enterprise backend systems.`,
    knowsAbout: [
      "Java",
      "Java 17",
      "Spring Boot",
      "Spring Boot 3",
      "Spring Security",
      "REST APIs",
      "JWT",
      "OAuth2",
      "Angular",
      "TypeScript",
      "MS SQL Server",
      "MySQL",
    ],
    knowsLanguage: [...profile.languages],
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.locality,
      addressRegion: profile.region,
      addressCountry: profile.country,
    },
    email: profile.email,
    telephone: profile.phoneHref,
    sameAs: [profile.linkedin, profile.github, profile.twitter, profile.telegram],
    worksFor: {
      "@type": "Organization",
      name: "WEQ Technologies",
      address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: `${profile.name} — ${profile.titleLong} Portfolio`,
    url: `${SITE_URL}/`,
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  };
}

export function profilePageJsonLd(path: string) {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

export function projectListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Key Projects by ${profile.name}`,
    itemListElement: caseStudies.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: c.title,
        description: c.summary,
        author: { "@id": `${SITE_URL}/#person` },
      },
    })),
  };
}

export function experienceSummary() {
  return experiences.map((e) => `${e.role} at ${e.company} (${e.period})`).join("; ");
}
