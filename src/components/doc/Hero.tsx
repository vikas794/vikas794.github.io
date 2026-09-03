import { Link } from "react-router";
import { profile } from "../../content/profile";
import Reveal, { RevealItem } from "../Reveal";

// Two CTAs only. Right column is a ledger complete on its own —
// a photo later replaces it and pushes the ledger below.
export default function Hero() {
  return (
    <section aria-labelledby="home-hero" className="border-b border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="label">Portfolio · Java backend · Mumbai</p>
          <h1 id="home-hero" className="t-display mt-4">
            {profile.headline}
          </h1>
          <p className="prose mt-6">
            I&apos;m {profile.name}, an Azure-certified {profile.role} with{" "}
            {profile.experienceYears}+ years turning business requirements into secure,
            maintainable enterprise systems across {profile.domains.join(", ").toLowerCase()}.
          </p>
          <p className="mt-4 flex items-center gap-2 text-small text-ink-2">
            <span className="inline-block h-2 w-2 rounded-full bg-positive" aria-hidden="true" />
            {profile.availability}
          </p>
          <Reveal className="mt-8 flex flex-wrap gap-3">
            <RevealItem>
              <Link to="/projects/" className="btn btn-primary no-underline">
                Read the case studies
              </Link>
            </RevealItem>
            <RevealItem>
              <Link to="/resume/" className="btn btn-ghost no-underline">
                Résumé
              </Link>
            </RevealItem>
          </Reveal>
        </div>
        <aside aria-label="At a glance">
          <dl className="ledger">
            {profile.ledger.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
