import type { ReactNode } from "react";

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
  return (
    <div className="section-head">
      <h2 id={id} className="t-section">
        <span className="section-num" aria-hidden="true">
          {num}
        </span>
        {children}
      </h2>
      {action}
    </div>
  );
}
