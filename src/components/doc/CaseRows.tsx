import { Link } from "react-router";
import { caseStudies } from "../../content/projects";
import Reveal, { RevealItem } from "../Reveal";

// Ruled editorial rows, not cards. Three deep — six equal cards
// signalled nothing was hard.
export default function CaseRows() {
  return (
    <section aria-labelledby="selected-work" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="selected-work" className="label">
            Selected work
          </h2>
          <Link to="/projects/" className="text-small">
            All projects
          </Link>
        </div>
        <Reveal className="mt-2 divide-y divide-rule">
          {caseStudies
            .filter((c) => c.featured)
            .map((c) => (
              <RevealItem key={c.slug}>
                <article className="entry-grid py-8">
                  <p className="font-mono text-sm text-ink-3">{c.number}</p>
                  <div>
                    <h3 className="font-serif text-2xl leading-snug tracking-tight md:text-3xl">
                      <Link to={`/projects/${c.slug}/`} className="text-ink no-underline hover:text-accent hover:underline">
                        {c.title}
                      </Link>
                    </h3>
                    <p className="mt-3 max-w-prose text-small leading-relaxed text-ink-2">
                      {c.summary}
                    </p>
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-ink-3 lg:text-right">
                    {c.stack}
                  </p>
                </article>
              </RevealItem>
            ))}
        </Reveal>
      </div>
    </section>
  );
}
