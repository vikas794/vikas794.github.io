import { skillLedger } from "../../content/skills";
import Reveal, { RevealItem } from "../Reveal";

export default function SkillsLedger() {
  return (
    <section aria-labelledby="stack" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <h2 id="stack" className="label">
          What I work with
        </h2>
        <Reveal className="ledger mt-6">
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
