import { profile } from "../../content/profile";

// Compact single row: identity on the left, links on the right. It wraps to
// two short lines on small screens and takes only the height it needs.
export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-mono text-xs tracking-wide text-ink-3">
          {profile.name} · {profile.titleLong} · {profile.location}
        </p>
        <ul className="flex flex-wrap gap-x-5 text-small">
          <li>
            <a
              className="inline-flex min-h-11 items-center"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className="inline-flex min-h-11 items-center"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a className="inline-flex min-h-11 items-center" href={`mailto:${profile.email}`}>
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
