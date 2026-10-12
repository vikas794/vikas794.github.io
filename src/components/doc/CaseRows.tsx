import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { caseStudies } from "../../content/projects";
import Reveal, { RevealItem } from "../Reveal";
import SectionHeading from "../SectionHeading";
import CaseRow from "./CaseRow";

// Big ruled rows, not cards. Three deep: six equal cards signalled nothing
// was hard.
export default function CaseRows() {
  return (
    <section id="services" data-hop="services" aria-labelledby="selected-work" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHeading
          id="selected-work"
          num="02"
          action={
            <Link to="/projects/" className="group inline-flex items-center gap-1 text-small">
              All projects
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-1"
              />
            </Link>
          }
        >
          Selected work
        </SectionHeading>
        <Reveal className="mt-10 divide-y divide-rule border-t border-rule">
          {caseStudies
            .filter((c) => c.featured)
            .map((c) => (
              <RevealItem key={c.slug}>
                <CaseRow study={c} />
              </RevealItem>
            ))}
        </Reveal>
      </div>
    </section>
  );
}
