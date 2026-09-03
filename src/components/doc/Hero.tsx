import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { profile } from "../../content/profile";
import { proofStrip } from "../../content/projects";
import Reveal, { RevealItem } from "../Reveal";
import HeroFlowDiagram from "../../diagrams/HeroFlowDiagram";

// The flagship proof point, promoted out of ProofStrip into the hero itself
// so a number lands in the first viewport, not the second section.
const heroStat = proofStrip[0];

// Right column: a real diagram grounding the headline in actual work,
// then a ledger complete on its own — a photo later replaces the diagram
// and pushes the ledger below.
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
            I&apos;m {profile.name}, an Azure-certified {profile.role}. {profile.experienceYears}+
            years turning hard requirements into secure, fast systems across{" "}
            {profile.domains.join(", ").toLowerCase()}.
          </p>
          <Reveal className="mt-8">
            <RevealItem>
              <Link
                to={`/projects/${heroStat.slug}/`}
                className="hero-stat group no-underline"
                aria-label={`${heroStat.value} ${heroStat.label} — read the case study`}
              >
                <span className="hero-stat-num group-hover:text-accent">{heroStat.value}</span>
                <span className="hero-stat-label">{heroStat.label}</span>
              </Link>
            </RevealItem>
          </Reveal>
          <p className="mt-6 flex items-center gap-2 text-small text-ink-2">
            <span className="inline-block h-2 w-2 rounded-full bg-positive" aria-hidden="true" />
            {profile.availability}
          </p>
          <Reveal className="mt-8 flex flex-wrap gap-3">
            <RevealItem>
              <Link to="/projects/" className="btn btn-primary group no-underline">
                Read the case studies
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-1"
                />
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
          <Reveal>
            <RevealItem>
              <Link
                to={`/projects/${heroStat.slug}/`}
                className="hero-diagram group block no-underline"
                aria-label="How the fan-out works — read the case study"
              >
                <HeroFlowDiagram />
                <span className="mt-3 flex items-center gap-1 text-small text-ink-2 group-hover:text-accent">
                  How this works
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </RevealItem>
          </Reveal>
          <dl className="ledger mt-6">
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
