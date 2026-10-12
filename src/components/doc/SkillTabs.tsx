import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups } from "../../content/skills";

// "All" is the default view: every group, one below the other, each under
// its own heading. The other tabs filter down to a single group.
const GROUPS = [{ title: "All", sections: skillGroups }, ...skillGroups.map((g) => ({ title: g.title, sections: [g] }))];

export default function SkillTabs() {
  const base = useId();
  const [{ active, dir }, setState] = useState({ active: 0, dir: 1 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setState({ active: i, dir: i >= active ? 1 : -1 });
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = GROUPS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    select(next, true);
  };

  const group = GROUPS[active];

  return (
    <div className="skill-tabs">
      <div role="tablist" aria-label="Filter skills by group" className="skill-track" onKeyDown={onKeyDown}>
        {GROUPS.map((g, i) => (
          <button
            key={g.title}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            className="skill-tab"
            onClick={() => select(i)}
          >
            {i === active && <motion.span layoutId={`${base}-pill`} className="skill-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            <span className="skill-tab-label">{g.title}</span>
          </button>
        ))}
      </div>
      <motion.div layout transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }} className="skill-panel-wrap">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            role="tabpanel"
            id={`${base}-panel`}
            aria-labelledby={`${base}-tab-${active}`}
            initial={{ opacity: 0, x: 24 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 * dir }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="skill-panel"
          >
            <div className="skill-sections">
              {group.sections.map((sec, si) => (
                <section key={sec.title} aria-label={sec.title} className="skill-section">
                  {active === 0 && <h3 className="skill-section-title">{sec.title}</h3>}
                  <ul className="skill-chips">
                    {sec.tags.map((t, i) => (
                      <motion.li
                        key={t}
                        className="chip"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min((si * 3 + i) * 0.024, 0.4),
                          duration: 0.24,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {t}
                      </motion.li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
