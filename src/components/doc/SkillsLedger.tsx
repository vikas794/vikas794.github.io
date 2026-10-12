import { skillGroups, skillLedger } from "../../content/skills";
import Reveal, { RevealItem } from "../Reveal";
import SectionHeading from "../SectionHeading";
import Ticker from "../Ticker";

// The ticker is decoration; the ledger under it is the real, readable list.
const TICKER = skillGroups.flatMap((g) => g.accentTags);

export default function SkillsLedger() {
  return (
    <section id="queue" data-hop="queue" aria-labelledby="stack" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 pt-16 md:px-8 md:pt-24">
        <SectionHeading id="stack" num="04">
          What I work with
        </SectionHeading>
      </div>
      <div className="mt-10">
        <Ticker items={TICKER} />
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <Reveal className="ledger mt-10">
          {skillLedger.map((g) => (
            <RevealItem key={g.label}>
              <span className="ledger-label">{g.label}</span>
              <span className="ledger-value">{g.value}</span>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
