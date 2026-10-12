import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useScroll } from "../../hooks/useScroll";
import { profile } from "../../content/profile";
import { proofStrip } from "../../content/projects";
import Reveal, { RevealItem } from "../Reveal";
import HeadlineReveal from "../HeadlineReveal";
import Magnetic from "../Magnetic";
import Roll from "../Roll";
import HeroFlowDiagram from "../../diagrams/HeroFlowDiagram";

// The flagship proof point, promoted out of ProofStrip into the hero itself
// so a number lands in the first viewport, not the second section.
const heroStat = proofStrip[0];

// Two columns from lg: headline, copy and CTAs on the left; stat, diagram
// and ledger on the right, level with the headline. Everything that matters
// to a recruiter is visible without scrolling.
export default function Hero() {
  const scrolled = useScroll(120);
  return (
    <section id="gateway" data-hop="gateway" aria-labelledby="home-hero" className="relative border-b border-rule">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 font-mono text-xs text-ink-2">
            <span className="inline-block h-2 w-2 rounded-full bg-positive" aria-hidden="true" />
            {profile.availability}
          </p>

          <HeadlineReveal
            id="home-hero"
            text={profile.headline}
            highlight="money, data, and messages"
            className="t-mega mt-5"
            reactive
            introOnce
          />

          <p className="prose mt-6">
            I&apos;m {profile.firstName}, a Java Spring Boot developer in {profile.locality}. For{" "}
            {profile.experienceYears}+ years I&apos;ve built secure, fast services for{" "}
            {profile.domains.join(", ").toLowerCase()}, and I measure what I ship.
          </p>

          <Reveal className="mt-8 flex flex-wrap items-center gap-4">
            <RevealItem>
              <Magnetic>
                <Link to="/projects/" className="btn btn-primary group no-underline">
                  <Roll>Read the case studies</Roll>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-out group-hover:translate-x-1.5"
                  />
                </Link>
              </Magnetic>
            </RevealItem>
            <RevealItem>
              <Link to="/resume/" className="btn btn-ghost no-underline">
                Résumé
              </Link>
            </RevealItem>
          </Reveal>
        </div>

        <aside aria-label="At a glance" className="lg:col-span-5">
          <Reveal>
            <RevealItem>
              <Link to={`/projects/${heroStat.slug}/`} className="stat-float group no-underline">
                <span className="hero-stat-num block tabular">{heroStat.value}</span>
                <span className="hero-stat-label mt-2 block">{heroStat.label}</span>
              </Link>
            </RevealItem>
            <RevealItem className="mt-5">
              <Link to={`/projects/${heroStat.slug}/`} className="hero-diagram group block no-underline">
                <HeroFlowDiagram />
                <span className="mt-3 flex items-center gap-1 text-small text-ink-2 group-hover:text-accent">
                  How this works
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-out group-hover:translate-x-1.5"
                  />
                </span>
              </Link>
            </RevealItem>
          </Reveal>
        </aside>
      </div>
      <span
        aria-hidden="true"
        className="scroll-cue absolute bottom-6 left-8 hidden md:block"
        style={{ opacity: scrolled ? 0 : 1 }}
      />
    </section>
  );
}
