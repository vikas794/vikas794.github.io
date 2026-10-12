// Button label that rolls on hover: the current text slides up and out while
// a copy slides in from below (CSS only, see .roll in index.css). The copy is
// aria-hidden, so assistive tech reads the label once.
export default function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
