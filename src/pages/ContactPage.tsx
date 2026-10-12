import Roll from "../components/Roll";
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import Seo from "../seo/Seo";
import { profile } from "../content/profile";
import { breadcrumbJsonLd } from "../seo/jsonld";
import Reveal, { RevealItem } from "../components/Reveal";
import HeadlineReveal from "../components/HeadlineReveal";
import SectionHeading from "../components/SectionHeading";
import CopyEmail from "../components/CopyEmail";
import Magnetic from "../components/Magnetic";

// The highest-conversion block on the site: role wanted, stack, work mode,
// availability, all explicit. Netlify Forms where hosted on Netlify,
// degrading to direct email everywhere else. No map: Mumbai is a word.
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
    } catch {
      // Ignore network failure (e.g. on pure static hosting like GitHub Pages)
    }

    setSubmitted(true);
  };

  return (
    <>
      <Seo
        title="Contact | Vikas Jaiswal · Open to Work"
        description="Vikas Jaiswal is open to backend roles (remote/hybrid, Mumbai). Email, LinkedIn, GitHub, WhatsApp, Telegram."
        path="/contact/"
      />
      <script type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact/" },
          ])
        )}
      </script>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-24">
        <HeadlineReveal
          id="contact-h1"
          text="Java backend roles, remote or hybrid."
          highlight="remote or hybrid"
          className="t-display max-w-[16ch]"
        />
        <p className="prose mt-8">
          I&apos;m looking for backend work on product teams: Java, Spring Boot 4, security and performance included.
          Remote or hybrid from Mumbai, available now. Email is the fastest way to reach me, and I reply within a day.
        </p>
        <p className="mt-8 flex flex-wrap items-center gap-4">
          <Magnetic>
            <CopyEmail email={profile.email} />
          </Magnetic>
          <a href={`mailto:${profile.email}`} className="btn btn-ghost no-underline">
            Open in mail app
          </a>
        </p>

        <Reveal className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <RevealItem>
            {submitted ? (
              <div className="panel">
                <h2 className="t-title">Thank you!</h2>
                <p className="prose mt-3">
                  Your message has been submitted. If you don&apos;t hear back soon, email me directly at{" "}
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="company"
                onSubmit={handleSubmit}
                onInvalidCapture={(e) => {
                  const el = e.target as HTMLElement;
                  el.classList.remove("shake");
                  void el.offsetWidth;
                  el.classList.add("shake");
                }}
                className="panel"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden" aria-hidden="true">
                  <label>
                    Company (leave blank): <input name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor="contact-name" className="field-label">
                      Name
                    </label>
                    <p className="mt-1 text-xs text-ink-3">Your full name, so I know who&apos;s reaching out.</p>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Priya Sharma"
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="field-label">
                      Email
                    </label>
                    <p className="mt-1 text-xs text-ink-3">Where I should reply. I answer within a day.</p>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="e.g. priya@company.com"
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="field-label">
                      Message
                    </label>
                    <p className="mt-1 text-xs text-ink-3">
                      What you&apos;re hiring for or building: role, stack, timeline, anything relevant.
                    </p>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="e.g. We're hiring a backend engineer (Java, Spring Boot) for a remote/hybrid role in Mumbai, starting next month..."
                      className="field"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary justify-center">
                    <Roll>Send message</Roll>
                  </button>
                  <p className="font-mono text-xs leading-relaxed text-ink-3">
                    Sent via Netlify Forms on Netlify. On static hosts like GitHub Pages, email me directly if you
                    prefer.
                  </p>
                </div>
              </form>
            )}
          </RevealItem>

          <RevealItem>
            <h2 className="t-title">Other ways to reach me</h2>
            <ul className="ledger mt-6">
              {profile.channels.map((c) => (
                <li key={c.id}>
                  <span className="ledger-label">{c.label}</span>
                  <span className="ledger-value">
                    <a
                      href={c.href}
                      target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                    >
                      {c.value}
                    </a>
                  </span>
                </li>
              ))}
              <li>
                <span className="ledger-label">Location</span>
                <span className="ledger-value">{profile.postalAddress}</span>
              </li>
            </ul>
          </RevealItem>
        </Reveal>

        <section aria-labelledby="what-to-send" className="mt-24">
          <SectionHeading id="what-to-send" num="01">
            What to include in your message
          </SectionHeading>
          <p className="prose mt-6">
            A few details let me answer properly on the first reply instead of starting with questions.
          </p>
          <Reveal className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {[
              ["The role and team", "What the backend does and who it serves."],
              ["The stack", "Java version, Spring Boot version, database, and how services are deployed."],
              ["Work mode", "Remote, hybrid or on-site, and the location if it is not remote."],
              ["Timeline", "When you want someone to start and how long the process takes."],
            ].map(([lead, body], i) => (
              <RevealItem key={lead} className="border-t border-rule pt-4">
                <p className="margin-num text-2xl" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-serif text-xl font-medium leading-snug">{lead}</p>
                <p className="mt-1 text-small leading-relaxed text-ink-2">{body}</p>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        <section aria-labelledby="what-i-do" className="mt-24">
          <SectionHeading id="what-i-do" num="02">
            What I can help with
          </SectionHeading>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <p className="prose">
                I work on REST APIs, authentication and authorization, database design, and query and transaction
                performance. If your team needs that kind of work, the <Link to="/projects/">case studies</Link>{" "}
                show how I approach it and what I measured, and my <Link to="/resume/">résumé</Link> has the full
                work history.
              </p>
              <p className="prose mt-4">
                Email is the quickest channel. LinkedIn, WhatsApp and Telegram work too, and I reply within a day.
              </p>
            </div>
            <dl className="ledger">
              <div>
                <dt>Role</dt>
                <dd>{profile.titleLong}</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>{profile.experienceYears}+ years</dd>
              </div>
              <div>
                <dt>Domains</dt>
                <dd>{profile.domains.join(", ")}</dd>
              </div>
              <div>
                <dt>Work mode</dt>
                <dd>{profile.workModes.join(", ")}</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>{profile.languages.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </>
  );
}
