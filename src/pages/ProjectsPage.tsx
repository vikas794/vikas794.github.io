import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import Seo from "../seo/Seo";
import { projectListJsonLd } from "../seo/jsonld";
import { caseStudies, alsoShipped } from "../content/projects";
import Reveal, { RevealItem } from "../components/Reveal";

// Three deep entries plus an Also-shipped ledger. Six equal-weight
// cards signalled nothing was hard.
export default function ProjectsPage() {
  return (
    <>
      <Seo
        title="Projects | Vikas Jaiswal · Case Studies"
        description="Three deep backend case studies: market-tick fan-out, healthcare performance, SQL-injection hardening — plus also-shipped one-liners."
        path="/projects/"
      />
      <script type="application/ld+json">{JSON.stringify(projectListJsonLd())}</script>
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <p className="label">Selected work</p>
        <h1 className="mt-4 max-w-[20ch] font-serif text-4xl leading-display tracking-tight md:text-5xl">
          Three projects, written up properly.
        </h1>
        <p className="prose mt-6">
          Each case study states its constraint, shows the architecture, names the
          trade-offs, and measures the result — including what I&apos;d do differently.
        </p>

        <Reveal className="mt-4 divide-y divide-rule border-t border-rule">
          {caseStudies.map((c) => (
            <RevealItem key={c.slug}>
              <article className="entry-grid group py-8">
                <p className="font-mono text-sm text-ink-3">{c.number}</p>
                <div>
                  <h2 className="font-serif text-2xl leading-snug tracking-tight md:text-3xl">
                    <Link
                      to={`/projects/${c.slug}/`}
                      className="inline-flex items-center gap-2 text-ink no-underline hover:text-accent hover:underline"
                    >
                      {c.title}
                      <ArrowRight
                        size={20}
                        aria-hidden="true"
                        className="shrink-0 opacity-0 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-prose text-small leading-relaxed text-ink-2">
                    {c.summary}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink-3">
                    {c.outcomes.slice(0, 2).map((o) => (
                      <li key={o.metric}>
                        {o.metric}: {o.after}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-mono text-xs leading-relaxed text-ink-3 lg:text-right">{c.stack}</p>
              </article>
            </RevealItem>
          ))}
        </Reveal>

        <section aria-labelledby="also-shipped" className="mt-12">
          <h2 id="also-shipped" className="label">
            Also shipped
          </h2>
          <Reveal className="ledger mt-6">
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
