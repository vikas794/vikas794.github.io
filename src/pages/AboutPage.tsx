import Seo from "../seo/Seo";
import { profile } from "../content/profile";
import { certifications } from "../content/certifications";
import Reveal, { RevealItem } from "../components/Reveal";

// First person, active, specific. "How I work" carries opinions —
// four years of experience demonstrating judgment rather than tenure.
const HOW_I_WORK = [
  {
    lead: "API design: the contract is the product.",
    body: "I design the request and response shapes before writing logic, because every field I add is a promise to every future integrator. Versioning is a last resort, not a plan — I'd rather get the contract right once than maintain three generations of it.",
  },
  {
    lead: "Security: deny by default, verify at the method.",
    body: "URL rules alone never survived contact with a real multi-tenant codebase — that's why I put @PreAuthorize on the methods across 30+ modules and replaced every concatenated HQL query with parameters. Permissions should read like a sentence on the code they protect.",
  },
  {
    lead: "Performance: measure the hot path, then touch it.",
    body: "I don't optimize by instinct. The Medify numbers — +30% throughput, −150ms, halved report times — came from instrumenting first, then indexing and multithreading exactly where the profiles pointed. An optimization without a before/after measurement is just a change.",
  },
  {
    lead: "Working with a team: small reviews, honest trade-offs.",
    body: "I keep pull requests small enough to review properly and write down what I didn't choose — the options table in each case study here is how I actually argue decisions at work. Peer review caught more of my bugs than any tool, so I return the favor carefully.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About | Vikas Jaiswal · Java Spring Boot Backend Developer"
        description="How Vikas Jaiswal works: API design, security, performance, and team opinions from 4+ years of backend engineering, plus Azure certifications."
        path="/about/"
      />
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <p className="label">About</p>
        <h1 className="mt-4 max-w-[20ch] font-serif text-4xl leading-display tracking-tight md:text-5xl">
          I turn business requirements into boring, reliable backends.
        </h1>
        <p className="prose mt-6">
          I&apos;m {profile.name}, a {profile.role} with {profile.experienceYears}+ years
          across {profile.domains.join(", ").toLowerCase()}. My work lives where nobody
          looks until it breaks: transaction boundaries, auth checks, query plans, and
          retry behavior. I like it there.
        </p>

        <section aria-labelledby="how-i-work" className="mt-12">
          <h2 id="how-i-work" className="label">
            How I work
          </h2>
          <Reveal className="mt-6 grid max-w-evidence gap-8 md:grid-cols-2">
            {HOW_I_WORK.map((h) => (
              <RevealItem key={h.lead} className="border-t border-rule pt-4">
                <p className="text-small leading-relaxed text-ink-2">
                  <strong className="text-ink">{h.lead}</strong> {h.body}
                </p>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        <section aria-labelledby="credentials" className="mt-12">
          <h2 id="credentials" className="label">
            Credentials
          </h2>
          <Reveal className="ledger mt-6 max-w-evidence">
            {certifications.map((c) => (
              <RevealItem key={c.id}>
                <span className="ledger-label">{c.issuer}</span>
                <span className="ledger-value">
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.name}
                  </a>
                </span>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        <section aria-labelledby="outside" className="mt-12">
          <h2 id="outside" className="label">
            Outside the code
          </h2>
          <p className="prose mt-6">
            I&apos;m based in Santacruz, Mumbai. Outside work, most hours go to family —
            and to staying current with the Java and Spring ecosystem, which is how the
            Azure certifications above happened.
          </p>
        </section>
      </div>
    </>
  );
}
