import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { experiences } from "../../content/experience";
import Reveal, { RevealItem } from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function WorkHistory() {
  return (
    <section aria-labelledby="work-history" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHeading
          id="work-history"
          num="03"
          action={
            <Link to="/experience/" className="group inline-flex items-center gap-1 text-small">
              Full history
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-1"
              />
            </Link>
          }
        >
          Where I&apos;ve worked
        </SectionHeading>
        <Reveal className="mt-10 divide-y divide-rule border-t border-rule">
          {experiences.map((e) => (
            <RevealItem key={e.company}>
              <div className="history-grid case-row py-8">
                <p className="font-mono text-sm text-ink-2">{e.period}</p>
                <div>
                  <p className="t-title">
                    {e.role}, {e.company}
                    {e.current && (
                      <span
                        className="ml-3 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle"
                        aria-label="Current role"
                        role="img"
                      />
                    )}
                  </p>
                  <p className="mt-3 max-w-prose text-small leading-relaxed text-ink-2">{e.productContext}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
