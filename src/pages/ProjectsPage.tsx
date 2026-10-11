import Seo from "../seo/Seo";
import { projectListJsonLd, breadcrumbJsonLd } from "../seo/jsonld";
import { caseStudies, alsoShipped } from "../content/projects";
import Reveal, { RevealItem } from "../components/Reveal";
import HeadlineReveal from "../components/HeadlineReveal";
import SectionHeading from "../components/SectionHeading";
import CaseRow from "../components/doc/CaseRow";

// Three deep entries plus an Also-shipped ledger. Six equal-weight cards
// signalled nothing was hard. Same row as the Home page.
export default function ProjectsPage() {
  return (
    <>
      <Seo
        title="Projects | Vikas Jaiswal · Case Studies"
        description="Three backend case studies: market-tick fan-out, healthcare performance and SQL-injection hardening."
        path="/projects/"
      />
      <script type="application/ld+json">{JSON.stringify(projectListJsonLd())}</script>
      <script type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects/" },
          ])
        )}
      </script>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-24">
        <HeadlineReveal
          id="projects-h1"
          text="Three projects, written up properly."
          highlight="written up properly"
          className="t-display max-w-[16ch]"
        />
        <p className="prose mt-8">
          Each case study states its constraint, shows the architecture, names the trade-offs, and measures the
          result. Each one also says what I&apos;d do differently.
        </p>

        <Reveal className="mt-16 divide-y divide-rule border-t border-rule">
          {caseStudies.map((c) => (
            <RevealItem key={c.slug}>
              <CaseRow study={c} as="h2" />
            </RevealItem>
          ))}
        </Reveal>

        <section aria-labelledby="also-shipped" className="mt-28">
          <SectionHeading id="also-shipped" num="01">
            Also shipped
          </SectionHeading>
          <Reveal className="ledger mt-8">
            {alsoShipped.map((a) => (
              <RevealItem key={a.title}>
                <span className="ledger-label">{a.title}</span>
                <span className="ledger-value">{a.line}</span>
              </RevealItem>
            ))}
          </Reveal>
        </section>
      </div>
    </>
  );
}
