import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups } from "../../content/skills";

// Skills as tabs: a pill track with an indicator that slides under the
// active tab, and panels that move in the direction you travelled. Rendered
// only after hydration; the prerendered page shows the plain ledger instead,
// so every skill is always readable text.
export default function SkillTabs() {
  const base = useId();
  const [{ active, dir }, setState] = useState({ active: 0, dir: 1 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setState({ active: i, dir: i >= active ? 1 : -1 });
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = skillGroups.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    select(next, true);
  };

  const group = skillGroups[active];

  return (
    <div className="skill-tabs">
      <div role="tablist" aria-label="Skill groups" className="skill-track" onKeyDown={onKeyDown}>
        {skillGroups.map((g, i) => (
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
            <ul className="skill-chips">
              {group.tags.map((t, i) => (
                <motion.li
                  key={t}
                  className="chip"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.024, 0.4), duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  {t}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
