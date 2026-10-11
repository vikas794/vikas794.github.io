// A slow line of stack names. Purely decorative: the same skills are in the
// ledger below it as real text, so the whole thing is aria-hidden.
export default function Ticker({ items }: { items: string[] }) {
  const row = items.map((t, i) => (
    <span key={`${t}-${i}`} className="ticker-item">
      {t}
    </span>
  ));
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row}
        {row}
      </div>
    </div>
  );
}
