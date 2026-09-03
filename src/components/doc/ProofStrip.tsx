import { Link } from "react-router";
import { proofStrip } from "../../content/projects";
import Reveal, { RevealItem } from "../Reveal";

// Every number links to the case study that substantiates it.
export default function ProofStrip() {
  return (
    <section aria-labelledby="proof" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <h2 id="proof" className="label">
          Results, measured
        </h2>
        <Reveal className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {proofStrip.map((m) => (
            <RevealItem key={m.label}>
              <Link
                to={`/projects/${m.slug}/`}
                className="metric group no-underline"
                aria-label={`${m.value} ${m.label} — read the case study`}
              >
                <span className="metric-num group-hover:text-accent">{m.value}</span>
                <span className="metric-label">{m.label}</span>
                <span className="metric-method">{m.method}</span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
