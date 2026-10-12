import { Link } from "react-router";
import { proofStrip } from "../../content/projects";
import Reveal, { RevealItem } from "../Reveal";
import SectionHeading from "../SectionHeading";
import CountUp from "../CountUp";

// The page's one solid-accent band (DESIGN.md section 3). Every number
// links to the case study that substantiates it, and states its method.
export default function ProofStrip() {
  return (
    <section id="auth" data-hop="auth" aria-labelledby="proof" className="band-accent">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHeading id="proof" num="01">
          Results, measured
        </SectionHeading>
        <Reveal className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-8">
          {proofStrip.map((m) => (
            <RevealItem key={m.label}>
              <Link to={`/projects/${m.slug}/`} className="metric metric-lg group no-underline">
                <CountUp value={m.value} className="metric-num" />
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
