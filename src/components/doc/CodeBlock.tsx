import type { CodeExcerpt } from "../../content/projects";

// No fake IDE chrome, no traffic lights. Real file path as a mono label,
// deliberately quieter than an editor theme — the annotations are louder
// than the syntax. Focusable scroll region.
export default function CodeBlock({ code }: { code: CodeExcerpt }) {
  return (
    <figure className="my-8 max-w-evidence">
      <p className="border border-rule border-b-0 bg-paper-2 px-4 py-2 font-mono text-xs text-ink-2">
        {code.path}
      </p>
      <div
        className="overflow-x-auto border border-rule"
        tabIndex={0}
        role="region"
        aria-label={`Code excerpt from ${code.path}`}
      >
        <pre className="wide-scroll p-0 font-mono text-code leading-6">
          <code>
            {code.lines.map((l, i) => {
              const comment = l.code.trimStart().startsWith("//");
              return (
                <span key={i} className="code-line border-b border-rule/60 last:border-0">
                  <span className="select-none px-3 py-0.5 text-right text-ink-3" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={`px-3 py-0.5 ${comment ? "text-ink-3" : "text-ink"}`}>{l.code || " "}</span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
      <div className="border border-t-0 border-rule bg-paper-2 px-4 py-3">
        <ul className="grid gap-2 sm:grid-cols-2">
          {code.lines.flatMap((l, i) =>
            l.note
              ? [
                  <li key={i} className="text-code leading-relaxed text-ink-2">
                    <span className="font-mono text-xs text-accent">L{i + 1}</span> — {l.note}
                  </li>,
                ]
              : []
          )}
        </ul>
        <p className="mt-3 font-mono text-xs leading-relaxed text-ink-3">{code.honesty}</p>
      </div>
    </figure>
  );
}
