import { Link } from "react-router";
import { profile } from "../../content/profile";
import Reveal, { RevealItem } from "../Reveal";

export default function ClosingCta() {
  return (
    <section aria-labelledby="contact-cta" className="bg-paper-2">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <RevealItem>
            <p className="label">Contact</p>
            <h2 id="contact-cta" className="t-display mt-4 max-w-[16ch]">
              Hiring for a backend role? Let&apos;s talk.
            </h2>
            <p className="prose mt-6">
              I&apos;m looking for Java backend engineering roles — remote or hybrid from
              Mumbai — on teams where correctness, security, and performance matter.
            </p>
            <p className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="btn btn-primary no-underline">
                {profile.email}
              </a>
              <Link to="/contact/" className="btn btn-ghost no-underline">
                More ways to reach me
              </Link>
            </p>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
