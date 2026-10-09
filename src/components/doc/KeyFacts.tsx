import { profile } from "../../content/profile";
import { certifications } from "../../content/certifications";

// Plain-sentence summary of the facts people (and answer engines) ask for.
// Derived from src/content so it cannot drift from the rest of the site.
export default function KeyFacts() {
  return (
    <section aria-labelledby="key-facts" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <h2 id="key-facts" className="label">
          Key facts
        </h2>
        <p className="prose mt-4">
          {profile.name} is a {profile.titleLong} with {profile.experienceYears}+ years of
          experience (since {profile.experienceSince}), based in {profile.location}. The
          work is in Java 8–25 and Spring Boot across {profile.domains.join(", ").toLowerCase()}.
          Certifications include {certifications.slice(0, 2).map((c) => c.shortName).join(" and ")}.
          The flagship project fans one upstream market-data socket out to thousands of
          concurrent WebSocket sessions. {profile.availability}.
        </p>
      </div>
    </section>
  );
}
