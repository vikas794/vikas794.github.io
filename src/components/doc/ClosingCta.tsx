import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { profile } from "../../content/profile";
import Reveal, { RevealItem } from "../Reveal";
import Mark from "../Mark";
import Magnetic from "../Magnetic";
import CopyEmail from "../CopyEmail";

// The page's one solid-ink band. Hiring managers end here, so the email is
// one tap away and the headline says what I want.
export default function ClosingCta() {
  return (
    <section aria-labelledby="contact-cta" className="band-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <RevealItem>
            <h2 id="contact-cta" className="t-display max-w-[14ch]">
              Hiring a backend engineer? <Mark scroll>Let&apos;s talk.</Mark>
            </h2>
            <p className="mt-8 max-w-[34rem] font-serif text-lg leading-snug md:text-xl">
              I&apos;m looking for Java backend work, remote or hybrid from Mumbai, on a team where correctness,
              security and speed matter.
            </p>
            <p className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <CopyEmail email={profile.email} />
              </Magnetic>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost no-underline">
                {profile.email}
              </a>
              <Link to="/contact/" className="btn btn-ghost group no-underline">
                More ways to reach me
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-1"
                />
              </Link>
            </p>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
