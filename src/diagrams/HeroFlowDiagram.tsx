// A compact teaser of the flagship case study's real architecture — not a
// stock illustration. Same rules as the full diagrams: currentColor +
// var(--accent) only, stroke-width 1.5, mono labels, exactly one accented
// node (the thing built). Links through to the full write-up.
export default function HeroFlowDiagram() {
  const box = "fill-none stroke-current stroke-[1.5]";
  const label = "fill-current font-mono";
  return (
    <figure className="hero-diagram">
      <svg
        viewBox="0 0 400 132"
        role="img"
        aria-labelledby="hero-flow-title hero-flow-desc"
        className="h-auto w-full text-ink"
      >
        <title id="hero-flow-title">Market-tick fan-out, simplified</title>
        <desc id="hero-flow-desc">
          One Kite Connect upstream socket feeds the Broadcast Scheduler, which
          fans ticks out to thousands of WebSocket sessions.
        </desc>

        <g>
          <rect x="4" y="40" width="112" height="52" rx="6" className={box} />
          <text x="60" y="62" textAnchor="middle" fontSize="12" className={label}>
            Kite Connect
          </text>
          <text x="60" y="78" textAnchor="middle" fontSize="10" className={label} opacity="0.7">
            1 upstream socket
          </text>
        </g>

        <g>
          <rect x="144" y="34" width="128" height="64" rx="6" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <text x="208" y="60" textAnchor="middle" fontSize="12" className={label}>
            Broadcast
          </text>
          <text x="208" y="76" textAnchor="middle" fontSize="12" className={label}>
            Scheduler
          </text>
          <text x="208" y="90" textAnchor="middle" fontSize="10" className={label} opacity="0.7">
            built here · 500ms
          </text>
        </g>

        <g>
          <rect x="300" y="40" width="96" height="52" rx="6" className={box} />
          <text x="348" y="62" textAnchor="middle" fontSize="12" className={label}>
            1,000s of
          </text>
          <text x="348" y="78" textAnchor="middle" fontSize="12" className={label}>
            sessions
          </text>
        </g>

        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <line x1="116" y1="66" x2="144" y2="66" />
          <line x1="272" y1="66" x2="300" y2="66" />
        </g>
        <g fontSize="10" className={label} opacity="0.75">
          <text x="130" y="58" textAnchor="middle">wss</text>
          <text x="286" y="58" textAnchor="middle">wss</text>
        </g>
      </svg>
    </figure>
  );
}
