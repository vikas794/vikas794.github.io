import { profile } from "../../content/profile";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-mono text-xs tracking-wide text-ink-3">
          {profile.name} · {profile.titleLong} · {profile.location}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-small">
          <li>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>Email</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
