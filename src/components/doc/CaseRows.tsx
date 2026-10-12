import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { caseStudies } from "../../content/projects";
import { useHydrated } from "../../hooks/useHydrated";
import { useDesktopWidth, useMotionOk } from "../../motion/media";
import Reveal, { RevealItem } from "../Reveal";
import SectionHeading from "../SectionHeading";
import CaseRow from "./CaseRow";
import { PinnedTrack, SwipeTrack } from "./CaseTrack";

// Big ruled rows, not cards. Three deep: six equal cards signalled nothing
// was hard.
//
// The rows are the prerendered, no-JS and reduced-motion version. After
// hydration, with motion allowed, they become a pinned horizontal track on
// desktop and a swipe row on narrower screens. Same studies, same links.
export default function CaseRows() {
  const hydrated = useHydrated();
  const motionOk = useMotionOk();
  const desktop = useDesktopWidth();

  const heading = (
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
  );

  const track = hydrated && motionOk ? (desktop ? "pinned" : "swipe") : "rows";

  return (
    <section id="services" data-hop="services" aria-labelledby="selected-work" className="border-b border-rule">
      {track === "pinned" && <PinnedTrack heading={heading} />}
      {track === "swipe" && (
        <div className="py-16 md:py-24">
          <SwipeTrack heading={heading} />
        </div>
      )}
      {track === "rows" && (
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          {heading}
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
      )}
    </section>
  );
}
