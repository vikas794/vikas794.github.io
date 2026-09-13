import { Link } from "react-router";
import Seo from "../seo/Seo";
import { caseStudies } from "../content/projects";
import { profile } from "../content/profile";
import { breadcrumbJsonLd } from "../seo/jsonld";
import CaseStudyView from "../components/doc/CaseStudy";

export default function ProjectDetailPage({ slug }: { slug: string }) {
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) {
    return (
      <>
        <Seo title="Not found | Vikas Jaiswal" description="This page does not exist." path={`/projects/${slug}/`} noindex />
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h1 className="font-serif text-4xl tracking-tight">Case study not found</h1>
          <p className="mt-4">
            <Link to="/projects/">Back to projects</Link>
          </p>
        </div>
      </>
    );
  }
  const path = `/projects/${study.slug}/`;
  return (
    <>
      <Seo title={`${study.title} | ${profile.name}`} description={study.summary} path={path} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: study.title,
          description: study.summary,
          author: { "@id": "https://vikas794.github.io/#person" },
          publisher: { "@id": "https://vikas794.github.io/#person" },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://vikas794.github.io/projects/${study.slug}/`,
          },
          dateModified: study.updated,
          datePublished: study.updated,
          inLanguage: "en",
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects/" },
            { name: study.title, path: `/projects/${study.slug}/` },
          ])
        )}
      </script>
      <CaseStudyView study={study} />
    </>
  );
}
