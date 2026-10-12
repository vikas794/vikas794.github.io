import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { CaseStudy } from "../../content/projects";

// The card form of a case study, used only inside the horizontal track
// (CaseTrack). Same data and link as CaseRow, so the two never drift.
export default function CaseCard({ study: c }: { study: CaseStudy }) {
  return (
    <article className="case-card group">
      <p className="margin-num case-card-num" aria-hidden="true">
        {c.number}
      </p>
      <h3 className="t-title md:text-[1.75rem]">
        <Link to={`/projects/${c.slug}/`} className="case-card-link inline-flex items-start gap-3 text-ink no-underline">
          <span className="decoration-accent decoration-2 underline-offset-8 group-hover:underline">{c.title}</span>
          <ArrowRight
            size={22}
            aria-hidden="true"
            className="mt-2 shrink-0 -translate-x-2 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100"
          />
        </Link>
      </h3>
      <p className="mt-3 text-small leading-relaxed text-ink-2 line-clamp-4">{c.summary}</p>
      <p className="metric metric-sm mt-6">
        <span className="metric-num tabular">{c.outcomes[0].after}</span>
        <span className="metric-label">{c.outcomes[0].metric}</span>
      </p>
      <p className="mt-auto pt-6 font-mono text-xs leading-relaxed text-ink-3">{c.stack}</p>
    </article>
  );
}
