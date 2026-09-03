import Seo from "../seo/Seo";
import { profile } from "../content/profile";

// The highest-conversion block on the site: role wanted, stack, work mode,
// availability — explicit. Netlify Forms where hosted on Netlify, degrading
// to direct email everywhere else. No map: Mumbai is a word.
export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact | Vikas Jaiswal · Open to Work"
        description="Vikas Jaiswal is open to backend engineering roles (remote/hybrid, Mumbai). Email, LinkedIn, GitHub, WhatsApp, Telegram."
        path="/contact/"
      />
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <p className="label">Contact</p>
        <h1 className="mt-4 max-w-[20ch] font-serif text-4xl leading-display tracking-tight md:text-5xl">
          Java backend roles, remote or hybrid.
        </h1>
        <p className="prose mt-6">
          I&apos;m looking for backend engineering work on product teams — Java 17,
          Spring Boot, security and performance included — remote or hybrid from
          Mumbai, available now. The fastest way to reach me is email; I reply
          within a day.
        </p>

        <div className="mt-10 grid max-w-evidence gap-10 lg:grid-cols-2">
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="company"
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
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="mt-2 min-h-11 w-full rounded-md border border-rule-strong bg-paper px-3 py-2 text-small"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="font-mono text-xs uppercase tracking-label text-ink-3">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-2 min-h-11 w-full rounded-md border border-rule-strong bg-paper px-3 py-2 text-small"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-label text-ink-3">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="mt-2 w-full rounded-md border border-rule-strong bg-paper px-3 py-2 text-small"
                />
              </div>
              <button type="submit" className="btn btn-primary justify-center">
                Send message
              </button>
              <p className="font-mono text-xs leading-relaxed text-ink-3">
                Sent via Netlify Forms on the Netlify mirror. On GitHub Pages, forms
                don&apos;t process — email me directly instead.
              </p>
            </div>
          </form>

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
        </div>
      </div>
    </>
  );
}
