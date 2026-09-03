import Seo from "../seo/Seo";
import { profile } from "../content/profile";
import { experiences } from "../content/experience";
import { skillGroups } from "../content/skills";
import { certifications } from "../content/certifications";
import { education } from "../content/education";

const PDF_PATH = "/Vikas_Jaiswal_JavaBackendDeveloper.pdf";
const PDF_SIZE = "54 KB";

// Download states format and size — no visible date. A last-updated
// timestamp reads as "hasn't been touched since" even when current;
// profile.updated still feeds the sitemap lastmod (SEO-only, invisible).
// The same content follows as accessible HTML — recruiters paste into ATS
// fields, and PDFs are poorly tagged. The print sheet in index.css renders
// a clean one-pager.
export default function ResumePage() {
  return (
    <>
      <Seo
        title="Résumé | Vikas Jaiswal · Java Spring Boot Backend Developer"
        description="Résumé of Vikas Jaiswal, Java Spring Boot Backend Developer (4+ years). Download PDF or read the accessible HTML version."
        path="/resume/"
      />
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <p className="label">Résumé</p>
        <h1 className="mt-4 font-serif text-4xl leading-display tracking-tight md:text-5xl">
          {profile.name} — {profile.titleLong}
        </h1>
        <p className="mt-6 text-small text-ink-2">
          {profile.location} · {profile.email} · {profile.phoneDisplay}
        </p>
        <p className="mt-6 flex flex-wrap gap-3">
          <a href={PDF_PATH} download className="btn btn-primary no-underline">
            Download résumé — PDF, {PDF_SIZE}
          </a>
        </p>

        <div className="no-print mt-10 border border-rule" role="region" aria-label="Résumé PDF preview">
          <object data={PDF_PATH} type="application/pdf" className="pdf-viewer w-full">
            <p className="p-6 text-small">
              Your browser can&apos;t preview PDFs.{" "}
              <a href={PDF_PATH} download>
                Download the résumé instead
              </a>
              , or read the HTML version below.
            </p>
          </object>
        </div>

        <div className="mt-12 max-w-evidence">
          <h2 className="label">HTML version — ATS-friendly</h2>
          {experiences.map((e) => (
            <section key={e.company} className="mt-8">
              <h3 className="font-serif text-2xl tracking-tight">
                {e.role} — {e.company}
              </h3>
              <p className="mt-1 font-mono text-xs text-ink-3">{e.period}</p>
              <p className="mt-3 max-w-prose text-small text-ink-2">{e.productContext}</p>
              {e.groups.map((g) => (
                <div key={g.label} className="mt-4">
                  <h4 className="font-mono text-xs font-medium uppercase tracking-label text-ink-3">
                    {g.label}
                  </h4>
                  <ul className="mt-2 list-disc pl-5 text-small leading-relaxed">
                    {g.items.map((p) => (
                      <li key={p} className="mt-1">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}

          <section className="mt-10">
            <h3 className="font-serif text-2xl tracking-tight">Skills</h3>
            {skillGroups.map((g) => (
              <p key={g.title} className="mt-3 text-small leading-relaxed">
                <strong>{g.title}:</strong> {g.tags.join(", ")}
              </p>
            ))}
          </section>

          <section className="mt-10">
            <h3 className="font-serif text-2xl tracking-tight">Certifications</h3>
            <ul className="mt-3 list-disc pl-5 text-small leading-relaxed">
              {certifications.map((c) => (
                <li key={c.id} className="mt-1">
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.name}
                  </a>{" "}
                  — {c.issuer}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h3 className="font-serif text-2xl tracking-tight">Education</h3>
            <ul className="mt-3 list-disc pl-5 text-small leading-relaxed">
              {education.map((e) => (
                <li key={e.school}>
                  {e.degree} — {e.school}, {e.location} ({e.period}) | {e.score}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
