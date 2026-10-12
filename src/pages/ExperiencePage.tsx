import Seo from "../seo/Seo";
import { experiences } from "../content/experience";
import { breadcrumbJsonLd } from "../seo/jsonld";
import Reveal, { RevealItem } from "../components/Reveal";
import HeadlineReveal from "../components/HeadlineReveal";
import { DrawLine, WipeLine } from "../motion/ScrollWipe";

// A timeline: the period hangs in the margin in oversized type (sticky on
// desktop), a rust rule and dot run down the content column.
export default function ExperiencePage() {
  return (
    <>
      <Seo
        title="Experience | Vikas Jaiswal · Java Developer"
        description="Experience at WEQ Technologies, Medify Nexus and Wipro: real-time trading, healthcare data and enterprise backends."
        path="/experience/"
      />
      <script type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Experience", path: "/experience/" },
          ])
        )}
      </script>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-24">
        <HeadlineReveal
          id="experience-h1"
          text="Four years of backends in production."
          highlight="in production"
          className="t-display max-w-[16ch]"
        />

        <Reveal className="mt-20 flex flex-col gap-24">
          {experiences.map((e) => (
            <RevealItem key={e.company}>
              <article className="rail pt-2">
                <div className="rail-meta">
                  <p className="font-serif text-2xl leading-tight text-accent lg:text-3xl">{e.period}</p>
                  <p className="mt-3">{e.company}</p>
                  <p className="mt-2">{e.tech.slice(0, 4).join(" · ")}</p>
                </div>
                <div className="rail-body relative min-w-0 border-l-2 border-accent pl-6 md:pl-10">
                  <DrawLine />
                  <span
                    className="rail-dot absolute -left-[0.45rem] top-2 h-3 w-3 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <h2 className="t-title">
                    {e.role}
                    {e.current && (
                      <span
                        className="ml-3 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle"
                        role="img"
                        aria-label="Current role"
                      />
                    )}
                  </h2>
                  <p className="prose mt-4">{e.productContext}</p>
                  {e.groups.map((g) => (
                    <section key={g.label} aria-label={g.label} className="mt-8">
                      <p className="label">{g.label}</p>
                      <ul className="mt-3 max-w-prose list-disc pl-5 text-small leading-relaxed marker:text-accent">
                        {g.items.map((item) => (
                          <li key={item} className="mt-2">
                            <WipeLine>{item}</WipeLine>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </>
  );
}
