import { useState, type FormEvent } from "react";
import Seo from "../seo/Seo";
import { profile } from "../content/profile";
import { breadcrumbJsonLd } from "../seo/jsonld";
import Reveal, { RevealItem } from "../components/Reveal";

// The highest-conversion block on the site: role wanted, stack, work mode,
// availability — explicit. Netlify Forms where hosted on Netlify, degrading
// to direct email everywhere else. No map: Mumbai is a word.
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
        description="Vikas Jaiswal is open to backend engineering roles (remote/hybrid, Mumbai). Email, LinkedIn, GitHub, WhatsApp, Telegram."
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
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <p className="label">Contact</p>
        <h1 className="mt-4 max-w-[20ch] font-serif text-4xl leading-display tracking-tight md:text-5xl">
          Java backend roles, remote or hybrid.
        </h1>
        <p className="prose mt-6">
          I&apos;m looking for backend engineering work on product teams — Java,
          Spring Boot 4, security and performance included — remote or hybrid from
          Mumbai, available now. The fastest way to reach me is email; I reply
          within a day.
        </p>

        <Reveal className="mt-10 grid max-w-evidence gap-10 lg:grid-cols-2">
          <RevealItem>
          {submitted ? (
            <div className="border-t border-rule pt-6">
              <h2 className="text-xl font-medium text-ink-1">Thank you!</h2>
              <p className="prose mt-3">
                Your message has been submitted. If you don&apos;t hear back soon, feel free to reach out directly via email at{" "}
                <a href={`mailto:${profile.email}`} className="text-accent underline">
                  {profile.email}
                </a>.
              </p>
            </div>
          ) : (
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="company"
              onSubmit={handleSubmit}
              className="border-t border-rule pt-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden" aria-hidden="true">
                <label>
                  Company (leave blank): <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </p>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="contact-name" className="font-mono text-xs uppercase tracking-label text-ink-3">
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
                    className="mt-2 min-h-11 w-full rounded-md border border-rule-strong bg-paper px-3 py-2 text-small"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="font-mono text-xs uppercase tracking-label text-ink-3">
                    Email
                  </label>
                  <p className="mt-1 text-xs text-ink-3">Where I should reply — I&apos;ll respond within a day.</p>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="e.g. priya@company.com"
                    className="mt-2 min-h-11 w-full rounded-md border border-rule-strong bg-paper px-3 py-2 text-small"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-label text-ink-3">
                    Message
                  </label>
                  <p className="mt-1 text-xs text-ink-3">
                    What you&apos;re hiring for or building — role, stack, timeline, anything relevant.
                  </p>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="e.g. We're hiring a backend engineer (Java, Spring Boot) for a remote/hybrid role in Mumbai, starting next month..."
                    className="mt-2 w-full rounded-md border border-rule-strong bg-paper px-3 py-2 text-small"
                  />
                </div>
                <button type="submit" className="btn btn-primary justify-center">
                  Send message
                </button>
                <p className="font-mono text-xs leading-relaxed text-ink-3">
                  Sent via Netlify Forms on Netlify. On static hosts like GitHub Pages, email me directly if preferred.
                </p>
              </div>
            </form>
          )}
          </RevealItem>

          <RevealItem>
            <div className="border-t border-rule pt-6">
              <h2 className="label">Channels</h2>
              <ul className="ledger mt-6">
                {profile.channels.map((c) => (
                  <li key={c.id}>
                    <span className="ledger-label">{c.label}</span>
                    <span className="ledger-value">
                      <a href={c.href} target={c.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">
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
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </>
  );
}
