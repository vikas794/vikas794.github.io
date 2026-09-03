import { Link } from "react-router";
import { experiences } from "../../content/experience";

export default function WorkHistory() {
  return (
    <section aria-labelledby="work-history" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="work-history" className="label">
            Where I&apos;ve worked
          </h2>
          <Link to="/experience/" className="text-small">
            Full history
          </Link>
        </div>
        <ul className="mt-2 divide-y divide-rule">
          {experiences.map((e) => (
            <li key={e.company} className="history-grid py-6">
              <p className="font-mono text-xs leading-relaxed text-ink-3">{e.period}</p>
              <div>
                <p className="font-serif text-xl tracking-tight">
                  {e.role} — {e.company}
                  {e.current && (
                    <span className="ml-3 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-label="Current role" role="img" />
                  )}
                </p>
                <p className="mt-2 max-w-prose text-small leading-relaxed text-ink-2">
                  {e.productContext}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
