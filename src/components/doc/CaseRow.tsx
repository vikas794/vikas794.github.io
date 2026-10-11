import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { CaseStudy } from "../../content/projects";

// One row, used on Home and on Projects so the two never drift apart.
// Big margin number, serif title, one measured result, mono stack. On hover
// the row fills with the soft accent (see .case-row in index.css).
export default function CaseRow({ study: c, as: Heading = "h3" }: { study: CaseStudy; as?: "h2" | "h3" }) {
  return (
    <article className="entry-grid case-row group py-10 md:py-14">
      <p className="margin-num row-num" aria-hidden="true">
        {c.number}
      </p>
      <div>
        <Heading className="t-title md:text-[1.75rem]">
          <Link to={`/projects/${c.slug}/`} className="inline-flex items-center gap-3 text-ink no-underline">
            <span className="decoration-accent decoration-2 underline-offset-8 group-hover:underline">{c.title}</span>
            <ArrowRight
              size={24}
              aria-hidden="true"
              className="shrink-0 -translate-x-2 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </Link>
        </Heading>
        <p className="mt-3 max-w-prose text-small leading-relaxed text-ink-2 line-clamp-2">{c.summary}</p>
        <p className="metric metric-sm mt-5">
          <span className="metric-num tabular">{c.outcomes[0].after}</span>
          <span className="metric-label">{c.outcomes[0].metric}</span>
        </p>
      </div>
      <p className="font-mono text-xs leading-relaxed text-ink-3 lg:text-right">{c.stack}</p>
    </article>
  );
}
