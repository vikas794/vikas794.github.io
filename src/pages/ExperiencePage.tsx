import Seo from "../seo/Seo";
import { experiences } from "../content/experience";

// Editorial rail: sticky mono metadata left, grouped bullets right.
export default function ExperiencePage() {
  return (
    <>
      <Seo
        title="Experience | Vikas Jaiswal · Java Spring Boot Backend Developer"
        description="Professional experience: WEQ Technologies, Medify Nexus, and Wipro — real-time trading, healthcare data, and enterprise backends."
        path="/experience/"
      />
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <p className="label">Career</p>
        <h1 className="mt-4 max-w-[20ch] font-serif text-4xl leading-display tracking-tight md:text-5xl">
          Four years of backends in production.
        </h1>

        <div className="mt-12 flex flex-col gap-14">
          {experiences.map((e) => (
            <article key={e.company} className="rail border-t border-rule pt-8">
              <div className="rail-meta">
                <p>{e.period}</p>
                <p className="mt-2">{e.company}</p>
                <p className="mt-2">{e.tech.slice(0, 4).join(" · ")}</p>
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
                  {e.role}
                  {e.current && (
                    <span className="ml-3 inline-block h-2 w-2 rounded-full bg-accent align-middle" role="img" aria-label="Current role" />
                  )}
                </h2>
                <p className="prose mt-4">{e.productContext}</p>
                {e.groups.map((g) => (
                  <section key={g.label} aria-label={g.label} className="mt-6">
                    <h3 className="font-mono text-xs font-medium uppercase tracking-label text-ink-3">
                      {g.label}
                    </h3>
                    <ul className="mt-3 max-w-prose list-disc pl-5 text-small leading-relaxed">
                      {g.items.map((item) => (
                        <li key={item} className="mt-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
