import type { ReactNode } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router";
import Reveal, { RevealItem } from "../Reveal";

interface ErrorPageProps {
  code: string;
  eyebrow: string;
  title: string;
  message: ReactNode;
  /** Shown as a mono "trace line" under the message — e.g. the bad path or a request id. */
  detail?: string;
}

// One shape for every HTTP-flavored failure the site can hit — 404 today,
// wired for a client-side error boundary tomorrow. Same ledger-and-rule
// language as the rest of the document, not a generic centered splash.
export default function ErrorPage({ code, eyebrow, title, message, detail }: ErrorPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <RevealItem>
          <p className="label">{eyebrow}</p>
          <p
            aria-hidden="true"
            className="mt-4 font-serif text-[clamp(4rem,3rem+6vw,8rem)] leading-none tracking-tight text-ink-3"
          >
            {code}
          </p>
          <h1 className="t-display mt-2">{title}</h1>
          <p className="prose mt-6">{message}</p>
          {detail ? (
            <p className="code-line mt-6 font-mono text-code text-ink-3">
              <span aria-hidden="true">—</span>
              <span className="wide-scroll overflow-x-auto">{detail}</span>
            </p>
          ) : null}
        </RevealItem>
        <RevealItem>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-primary group no-underline">
              Back to home
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-1"
              />
            </Link>
            <Link to="/contact/" className="btn btn-ghost no-underline">
              <Mail size={16} aria-hidden="true" />
              Contact me
            </Link>
          </div>
        </RevealItem>
      </Reveal>
    </div>
  );
}
