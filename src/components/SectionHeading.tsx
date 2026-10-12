import type { ReactNode } from "react";
import { useTitleScrub } from "../motion/useTitleScrub";

// Margin number + real serif h2 (+ optional action on the right). Replaces
// the tracked-out uppercase label above every section.
export default function SectionHeading({
  id,
  num,
  children,
  action,
}: {
  id: string;
  num: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const ref = useTitleScrub<HTMLHeadingElement>();
  return (
    <div className="section-head">
      <h2 id={id} ref={ref} className="t-section title-scrub">
        <span className="section-num" aria-hidden="true">
          {num}
        </span>
        {children}
      </h2>
      {action}
    </div>
  );
}
