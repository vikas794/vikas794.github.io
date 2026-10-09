import { Link } from "react-router";
import type { CaseStudy } from "../../content/projects";
import FanoutDiagram from "../../diagrams/FanoutDiagram";
import OauthStrip from "../../diagrams/OauthStrip";
import CodeBlock from "./CodeBlock";
import Reveal, { RevealItem } from "../Reveal";

const TOC = [
  { id: "problem", label: "Problem" },
  { id: "constraints", label: "Constraints" },
  { id: "architecture", label: "Architecture" },
  { id: "critical-path", label: "Critical path" },
  { id: "decisions", label: "Decisions" },
  { id: "code", label: "Code" },
  { id: "results", label: "Results" },
  { id: "differently", label: "Differently" },
];

export function CaseStudyHeader({ study }: { study: CaseStudy }) {
  return (
    <Reveal>
      <RevealItem>
        <p className="label">Case study {study.number}</p>
        <h1 className="mt-4 max-w-[22ch] font-serif text-4xl leading-display tracking-tight md:text-5xl">
          {study.title}
        </h1>
        <p className="prose mt-6">{study.summary}</p>
        <dl className="ledger mt-8 max-w-evidence">
          <div>
            <dt>Stack</dt>
            <dd>{study.stack}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{study.updated}</dd>
          </div>
        </dl>
      </RevealItem>
    </Reveal>
  );
}

export function CaseStudyToc({
  toc,
}: {
  toc: { id: string; label: string }[];
}) {
  return (
    <nav className="rail-meta" aria-label="On this page">
      {toc.map((t) => (
        <a key={t.id} href={`#${t.id}`} className="block py-1 no-underline hover:text-accent hover:underline">
          {t.label}
        </a>
      ))}
    </nav>
  );
}

export function CaseStudyConstraints({ constraints }: { constraints: string[] }) {
  return (
    <section aria-labelledby="constraints" className="mt-10">
      <h2 id="constraints" className="label">
        Constraints
      </h2>
      <ul className="mt-4 max-w-prose list-disc pl-5 text-small leading-relaxed">
        {constraints.map((c) => (
          <li key={c} className="mt-1">
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CaseStudyDecisionsTable({ decisions }: { decisions: CaseStudy["decisions"] }) {
  return (
    <section aria-labelledby="decisions" className="mt-10">
      <h2 id="decisions" className="label">
        Decisions and trade-offs
      </h2>
      <div
        className="mt-4 max-w-evidence overflow-x-auto border border-rule"
        tabIndex={0}
        role="region"
        aria-label="Decisions and trade-offs"
      >
        <table className="wide-scroll w-full text-left text-small">
          <thead>
            <tr className="border-b border-rule bg-paper-2 font-mono text-xs text-ink-3">
              <th className="px-4 py-3 font-medium">Decision</th>
              <th className="px-4 py-3 font-medium">Option A</th>
              <th className="px-4 py-3 font-medium">Option B</th>
              <th className="px-4 py-3 font-medium">Chosen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {decisions.map((d) => (
              <tr key={d.decision}>
                <td className="px-4 py-3 font-medium">{d.decision}</td>
                <td className="px-4 py-3 text-ink-2">{d.optionA}</td>
                <td className="px-4 py-3 text-ink-2">{d.optionB}</td>
                <td className="px-4 py-3">{d.chosen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CaseStudyCodeExcerpt({ code }: { code: NonNullable<CaseStudy["code"]> }) {
  return (
    <section aria-labelledby="code" className="mt-10">
      <h2 id="code" className="label">
        Code that mattered
      </h2>
      <Reveal>
        <RevealItem>
          <CodeBlock code={code} />
        </RevealItem>
      </Reveal>
    </section>
  );
}

export function CaseStudyResultsTable({ outcomes }: { outcomes: CaseStudy["outcomes"] }) {
  return (
    <section aria-labelledby="results" className="mt-10">
      <h2 id="results" className="label" tabIndex={-1}>
        Results
      </h2>
      <div
        className="mt-4 max-w-evidence overflow-x-auto border border-rule"
        tabIndex={0}
        role="region"
        aria-label="Results, before and after"
      >
        <table className="wide-scroll w-full text-left text-small">
          <thead>
            <tr className="border-b border-rule bg-paper-2 font-mono text-xs text-ink-3">
              <th className="px-4 py-3 font-medium">Metric</th>
              <th className="px-4 py-3 font-medium">Before</th>
              <th className="px-4 py-3 font-medium">After</th>
              <th className="px-4 py-3 font-medium">How measured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {outcomes.map((o) => (
              <tr key={o.metric}>
                <td className="px-4 py-3 font-medium">{o.metric}</td>
                <td className="px-4 py-3 text-ink-2">{o.before}</td>
                <td className="px-4 py-3 text-ink-2">{o.after}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-3">{o.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CaseStudyRetrospective({ text }: { text: string }) {
  return (
    <section aria-labelledby="differently" className="mt-10">
      <h2 id="differently" className="label">
        What I&apos;d do differently
      </h2>
      <p className="prose mt-4">{text}</p>
    </section>
  );
}

// Nine fixed blocks, sticky TOC in the rail. A number without a stated
// method reads as invented; "what I'd do differently" is the seniority signal.
export default function CaseStudyView({ study }: { study: CaseStudy }) {
  const hasDiagram = study.diagram === "fanout";
  const visibleToc = TOC.filter(
    (t) =>
      (t.id !== "architecture" && t.id !== "critical-path" && t.id !== "code") ||
      (hasDiagram && (t.id === "architecture" || t.id === "critical-path")) ||
      (t.id === "code" && study.code)
  );

  return (
    <article className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
      <a href="#results" className="skip-link">
        Skip to results
      </a>

      <CaseStudyHeader study={study} />

      <div className="rail mt-12">
        <CaseStudyToc toc={visibleToc} />

        <div className="min-w-0">
          <section aria-labelledby="problem">
            <h2 id="problem" className="label">
              The problem
            </h2>
            <p className="prose mt-4">{study.problem}</p>
          </section>

          <CaseStudyConstraints constraints={study.constraints} />

          {hasDiagram && (
            <>
              <section aria-labelledby="architecture" className="mt-10">
                <h2 id="architecture" className="label">
                  Architecture
                </h2>
                <FanoutDiagram />
              </section>
              <section aria-labelledby="critical-path" className="mt-10">
                <h2 id="critical-path" className="label">
                  The critical path
                </h2>
                <OauthStrip />
              </section>
            </>
          )}

          <CaseStudyDecisionsTable decisions={study.decisions} />

          {study.code && <CaseStudyCodeExcerpt code={study.code} />}

          <CaseStudyResultsTable outcomes={study.outcomes} />

          <CaseStudyRetrospective text={study.whatIdDoDifferently} />

          <p className="mt-12 border-t border-rule pt-6">
            <Link to="/projects/">Back to projects</Link>
          </p>
        </div>
      </div>
    </article>
  );
}
