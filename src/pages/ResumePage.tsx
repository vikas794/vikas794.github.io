import Seo from "../seo/Seo";
import ResumePdfPreview from "../components/ResumePdfPreview";
import { profile } from "../content/profile";
import { experiences } from "../content/experience";
import { skillGroups } from "../content/skills";
import { certifications } from "../content/certifications";
import { education } from "../content/education";
import { breadcrumbJsonLd } from "../seo/jsonld";
import HeadlineReveal from "../components/HeadlineReveal";

export const PDF_PATH = "/Vikas_Jaiswal_JavaBackendDeveloper.pdf";
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
        title="Résumé | Vikas Jaiswal · Java Developer"
        description="Résumé of Vikas Jaiswal, Java Spring Boot Backend Developer. Download the PDF or read the HTML version."
        path="/resume/"
      />
      <script type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Résumé", path: "/resume/" },
          ])
        )}
      </script>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-24">
        <HeadlineReveal
          id="resume-h1"
          text={`${profile.name}, ${profile.titleLong}`}
          highlight={profile.titleLong}
          className="t-display max-w-[20ch]"
        />
        <p className="mt-8 text-small text-ink-2">
          {profile.location} · {profile.email} · {profile.phoneDisplay}
        </p>
        <p className="mt-6 flex flex-wrap gap-3">
          <a href={PDF_PATH} download className="btn btn-primary no-underline">
            Download résumé — PDF, {PDF_SIZE}
          </a>
        </p>

        <div className="no-print mt-10 border border-rule" role="region" aria-label="Résumé PDF preview">
          <ResumePdfPreview file={PDF_PATH} />
        </div>

        <div className="sec-scope mt-12">
          <h2 className="sec-title">HTML version — ATS-friendly</h2>
          {experiences.map((e) => (
            <section key={e.company} className="mt-8 max-w-evidence">
              <h3 className="t-title">
                {e.role} — {e.company}
              </h3>
              <p className="mt-1 font-mono text-xs text-ink-3">{e.period}</p>
              <p className="mt-3 max-w-prose text-small text-ink-2">{e.productContext}</p>
              {e.groups.map((g) => (
                <div key={g.label} className="mt-4">
                  <h4 className="label">
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

          <section className="mt-12">
            <h3 className="t-title">Skills</h3>
            <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((g) => (
                <div key={g.title} className="border-t border-rule pt-4">
                  <h4 className="label">{g.title}</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {g.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-sm border border-rule bg-paper-2 px-2 py-1 text-small leading-none"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 max-w-evidence">
            <h3 className="t-title">Certifications</h3>
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

          <section className="mt-12 max-w-evidence">
            <h3 className="t-title">Education</h3>
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
