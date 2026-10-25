import Roll from "../components/Roll";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import Seo from "../seo/Seo";
import { profile } from "../content/profile";
import { breadcrumbJsonLd } from "../seo/jsonld";
import Reveal, { RevealItem } from "../components/Reveal";
import HeadlineReveal from "../components/HeadlineReveal";
import SectionHeading from "../components/SectionHeading";
import CopyEmail from "../components/CopyEmail";
import Magnetic from "../components/Magnetic";
import {
  LIMITS,
  MIN_FILL_MS,
  REQUEST_TIMEOUT_MS,
  clean,
  rateLimitMessage,
  recordSend,
  validate,
  type ContactErrors,
} from "../lib/contactForm";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaeeqrjg";

// The highest-conversion block on the site: role wanted, stack, work mode,
// availability, all explicit. The form posts to Formspree, which works on any
// static host; if it fails the visitor sees the error and the direct email.
// No map: Mumbai is a word.
export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactErrors>({});
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(e.currentTarget);

    // Bots: a filled honeypot or an instant submit gets a silent "sent" and
    // nothing leaves the browser.
    if (String(data.get("_gotcha") ?? "") !== "" || Date.now() - shownAt.current < MIN_FILL_MS) {
      setStatus("sent");
      return;
    }

    const values = clean({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    });
    const invalid = validate(values);
    setFieldErrors(invalid);
    if (Object.keys(invalid).length > 0) {
      setError("");
      setStatus("idle");
      return;
    }

    const limited = rateLimitMessage();
    if (limited) {
      setError(limited);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");
    const body = new FormData();
    for (const [k, v] of Object.entries(values)) body.set(k, v);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
        signal: controller.signal,
      });
      if (res.ok) {
        recordSend();
        setStatus("sent");
        return;
      }
      if (res.status === 429) {
        setError("Too many requests right now.");
      } else {
        const json = (await res.json().catch(() => null)) as { errors?: { message: string }[] } | null;
        setError(json?.errors?.map((x) => x.message).join(", ") || "The message could not be sent.");
      }
    } catch (err) {
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "The request timed out: the message could not be sent."
          : "Network error: the message could not be sent."
      );
    } finally {
      window.clearTimeout(timer);
    }
    setStatus("error");
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
            {status === "sent" ? (
              <div className="panel">
                <h2 className="t-title">Thank you!</h2>
                <p className="prose mt-3">
                  Your message has been submitted. If you don&apos;t hear back soon, email me directly at{" "}
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
              </div>
            ) : (
              <form
                action={FORMSPREE_ENDPOINT}
                method="POST"
                onSubmit={handleSubmit}
                onInvalidCapture={(e) => {
                  const el = e.target as HTMLElement;
                  el.classList.remove("shake");
                  void el.offsetWidth;
                  el.classList.add("shake");
                }}
                className="panel"
              >
                <p className="hidden" aria-hidden="true">
                  <label>
                    Company (leave blank): <input name="_gotcha" tabIndex={-1} autoComplete="off" />
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
                      maxLength={LIMITS.name.max}
                      aria-invalid={fieldErrors.name ? true : undefined}
                      aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                      autoComplete="name"
                      placeholder="e.g. Priya Sharma"
                      className="field"
                    />
                    {fieldErrors.name && (
                      <p id="contact-name-error" role="alert" className="mt-1 text-xs text-accent">
                        {fieldErrors.name}
                      </p>
                    )}
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
                      maxLength={LIMITS.email.max}
                      aria-invalid={fieldErrors.email ? true : undefined}
                      aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                      autoComplete="email"
                      placeholder="e.g. priya@company.com"
                      className="field"
                    />
                    {fieldErrors.email && (
                      <p id="contact-email-error" role="alert" className="mt-1 text-xs text-accent">
                        {fieldErrors.email}
                      </p>
                    )}
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
                      data-lenis-prevent
                      required
                      maxLength={LIMITS.message.max}
                      aria-invalid={fieldErrors.message ? true : undefined}
                      aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                      rows={5}
                      placeholder="e.g. We're hiring a backend engineer (Java, Spring Boot) for a remote/hybrid role in Mumbai, starting next month..."
                      className="field"
                    />
                    <p className="mt-1 text-right font-mono text-xs text-ink-3" aria-hidden="true">
                      Up to {LIMITS.message.max} characters
                    </p>
                    {fieldErrors.message && (
                      <p id="contact-message-error" role="alert" className="mt-1 text-xs text-accent">
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary justify-center" disabled={status === "sending"}>
                    <Roll>{status === "sending" ? "Sending…" : "Send message"}</Roll>
                  </button>
                  {status === "error" && (
                    <p role="alert" className="text-small text-accent">
                      {error} Please try again, or email me directly at{" "}
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                    </p>
                  )}
                  <p className="font-mono text-xs leading-relaxed text-ink-3">
                    Sent via Formspree. If you prefer, email me directly.
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
