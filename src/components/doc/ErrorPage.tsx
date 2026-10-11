import type { ReactNode } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router";
import Reveal, { RevealItem } from "../Reveal";
import Magnetic from "../Magnetic";

interface ErrorPageProps {
  code: string;
  eyebrow: string;
  title: string;
  message: ReactNode;
  /** Shown as a mono "trace line" under the message, e.g. the bad path or a request id. */
  detail?: string;
}

// One shape for every HTTP-flavoured failure the site can hit. The status
// code is the loud thing: giant, accent, a little crooked.
export default function ErrorPage({ code, eyebrow, title, message, detail }: ErrorPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-28">
      <Reveal>
        <RevealItem>
          <p className="label">{eyebrow}</p>
          <p
            aria-hidden="true"
            className="mt-4 font-serif text-[clamp(5rem,3rem+9vw,9rem)] font-medium leading-[0.85] tracking-tight text-accent"
          >
            {code}
          </p>
          <h1 className="t-display mt-6 max-w-[16ch]">{title}</h1>
          <p className="prose mt-6">{message}</p>
          {detail ? (
            <p className="code-line mt-6 font-mono text-code text-ink-3">
              <span aria-hidden="true">/</span>
              <span className="wide-scroll overflow-x-auto">{detail}</span>
            </p>
          ) : null}
        </RevealItem>
        <RevealItem>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/" className="btn btn-primary group no-underline">
                Back to home
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
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
