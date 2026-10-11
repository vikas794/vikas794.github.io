import Seo from "../seo/Seo";
import { profile } from "../content/profile";
import { certifications } from "../content/certifications";
import { faqs } from "../content/faq";
import { breadcrumbJsonLd, faqPageJsonLd } from "../seo/jsonld";
import Reveal, { RevealItem } from "../components/Reveal";
import HeadlineReveal from "../components/HeadlineReveal";
import SectionHeading from "../components/SectionHeading";

// First person, active, specific. "How I work" carries opinions: four years
// of experience demonstrating judgment rather than tenure.
const HOW_I_WORK = [
  {
    lead: "API design: the contract is the product.",
    body: "I design the request and response shapes before writing logic, because every field I add is a promise to every future integrator. Versioning is a last resort, not a plan. I'd rather get the contract right once than maintain three generations of it.",
  },
  {
    lead: "Security: deny by default, verify at the method.",
    body: "URL rules alone never survived contact with a real multi-tenant codebase. So I put @PreAuthorize on the methods across 30+ modules and replaced every concatenated HQL query with parameters. Permissions should read like a sentence on the code they protect.",
  },
  {
    lead: "Performance: measure the hot path, then touch it.",
    body: "I don't optimize by instinct. The Medify numbers (+30% throughput, −150ms, halved report times) came from instrumenting first, then indexing and multithreading exactly where the profiles pointed. An optimization without a before/after measurement is just a change.",
  },
  {
    lead: "Working with a team: small reviews, honest trade-offs.",
    body: "I keep pull requests small enough to review properly and write down what I didn't choose. The options table in each case study here is how I argue decisions at work. Peer review caught more of my bugs than any tool, so I return the favour carefully.",
  },
];

// Staggered two-column layout: every second principle steps down.
export default function AboutPage() {
  return (
    <>
      <Seo
        title="About | Vikas Jaiswal · Java Backend Developer"
        description="How Vikas Jaiswal works: API design, security, performance and team opinions from 4+ years of backend work."
        path="/about/"
      />
      <script type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about/" },
          ])
        )}
      </script>
      <script type="application/ld+json">{JSON.stringify(faqPageJsonLd(faqs))}</script>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-24">
        <HeadlineReveal
          id="about-h1"
          text="I turn business requirements into boring, reliable backends."
          highlight="boring, reliable"
          className="t-display max-w-[18ch]"
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <p className="font-serif text-xl leading-snug tracking-tight lg:col-span-8 lg:max-w-none lg:text-[1.75rem]">
            I&apos;m {profile.name}, a {profile.role} with {profile.experienceYears}+ years across{" "}
            {profile.domains.join(", ").toLowerCase()}. My work lives where nobody looks until it breaks:{" "}
            <em>transaction boundaries, auth checks, query plans, retry behaviour.</em> I like it there.
          </p>
        </div>

        <section aria-labelledby="how-i-work" className="mt-24">
          <SectionHeading id="how-i-work" num="01">
            How I work
          </SectionHeading>
          <Reveal className="mt-10 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {HOW_I_WORK.map((h, i) => (
              <RevealItem key={h.lead} className="border-t border-rule pt-5">
                <p className="margin-num text-4xl" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 text-small leading-relaxed text-ink-2">
                  <strong className="font-serif text-xl font-medium leading-snug text-ink md:text-2xl">{h.lead}</strong>
                  <span className="mt-3 block">{h.body}</span>
                </p>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        <section aria-labelledby="credentials" className="mt-28">
          <SectionHeading id="credentials" num="02">
            Credentials
          </SectionHeading>
          <Reveal className="ledger mt-8 max-w-evidence">
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

        <section aria-labelledby="faq" className="mt-28">
          <SectionHeading id="faq" num="03">
            Frequently asked questions
          </SectionHeading>
          <Reveal className="mt-8 max-w-evidence divide-y divide-rule border-t border-rule">
            {faqs.map((f) => (
              <RevealItem key={f.question}>
                <details className="facts group py-5">
                  <summary className="cursor-pointer font-serif text-xl text-ink marker:content-none">
                    {f.question}
                  </summary>
                  <p className="prose mt-3 text-small text-ink-2">{f.answer}</p>
                </details>
              </RevealItem>
            ))}
          </Reveal>
        </section>
      </div>
    </>
  );
}
