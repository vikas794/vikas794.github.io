// Hand-authored inline SVG — not runtime Mermaid. currentColor +
// var(--accent) only, so both themes work from one file. 9 nodes,
// 9 edges, orthogonal routing, every edge labelled with its protocol,
// exactly one element accented: the Broadcast Scheduler (the thing built).
export default function FanoutDiagram() {
  const box = "fill-none stroke-current stroke-[1.5]";
  const label = "fill-current font-mono";
  return (
    <figure className="my-8 max-w-evidence">
      <svg
        viewBox="0 0 680 460"
        role="img"
        aria-labelledby="fanout-title fanout-desc"
        className="h-auto w-full text-ink"
      >
        <title id="fanout-title">Market-tick fan-out architecture</title>
        <desc id="fanout-desc">
          One Kite Connect socket feeds Tick Ingest, then the Broadcast Scheduler,
          which looks up the Session Registry and pushes filtered ticks over
          WebSocket to three browsers. Browsers place orders over REST through
          the Order API, which bills in-process via Wallet. Tick traffic never
          touches the order or wallet paths.
        </desc>

        {/* Row 1: ingest path */}
        <g>
          <rect x="16" y="24" width="150" height="52" rx="6" className={box} />
          <text x="91" y="46" textAnchor="middle" fontSize="13" className={label}>Kite Connect</text>
          <text x="91" y="62" textAnchor="middle" fontSize="11" className={label} opacity="0.7">upstream socket</text>
        </g>
        <g>
          <rect x="206" y="24" width="150" height="52" rx="6" className={box} />
          <text x="281" y="46" textAnchor="middle" fontSize="13" className={label}>Tick Ingest</text>
          <text x="281" y="62" textAnchor="middle" fontSize="11" className={label} opacity="0.7">last tick ref</text>
        </g>
        <g>
          <rect x="396" y="24" width="160" height="52" rx="6" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <text x="476" y="46" textAnchor="middle" fontSize="13" className={label}>Broadcast Scheduler</text>
          <text x="476" y="62" textAnchor="middle" fontSize="11" className={label} opacity="0.7">built here · 500ms</text>
        </g>

        {/* Row 2: state + order paths */}
        <g>
          <rect x="16" y="164" width="150" height="52" rx="6" className={box} />
          <text x="91" y="186" textAnchor="middle" fontSize="13" className={label}>Order API</text>
          <text x="91" y="202" textAnchor="middle" fontSize="11" className={label} opacity="0.7">entry · exit · SL</text>
        </g>
        <g>
          <rect x="206" y="164" width="150" height="52" rx="6" className={box} />
          <text x="281" y="186" textAnchor="middle" fontSize="13" className={label}>Wallet + GST</text>
          <text x="281" y="202" textAnchor="middle" fontSize="11" className={label} opacity="0.7">Razorpay billing</text>
        </g>
        <g>
          <rect x="396" y="164" width="160" height="52" rx="6" className={box} />
          <text x="476" y="186" textAnchor="middle" fontSize="13" className={label}>Session Registry</text>
          <text x="476" y="202" textAnchor="middle" fontSize="11" className={label} opacity="0.7">session → instruments</text>
        </g>

        {/* Row 3: clients */}
        <g>
          <rect x="16" y="330" width="150" height="52" rx="6" className={box} />
          <text x="91" y="352" textAnchor="middle" fontSize="13" className={label}>Browser A</text>
          <text x="91" y="368" textAnchor="middle" fontSize="11" className={label} opacity="0.7">trade screen</text>
        </g>
        <g>
          <rect x="206" y="330" width="150" height="52" rx="6" className={box} />
          <text x="281" y="352" textAnchor="middle" fontSize="13" className={label}>Browser B</text>
          <text x="281" y="368" textAnchor="middle" fontSize="11" className={label} opacity="0.7">trade screen</text>
        </g>
        <g>
          <rect x="396" y="330" width="160" height="52" rx="6" className={box} />
          <text x="476" y="352" textAnchor="middle" fontSize="13" className={label}>Browser C</text>
          <text x="476" y="368" textAnchor="middle" fontSize="11" className={label} opacity="0.7">trade screen</text>
        </g>

        {/* Edges */}
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <line x1="166" y1="50" x2="206" y2="50" />
          <line x1="356" y1="50" x2="396" y2="50" />
          <path d="M 430 76 V 190 H 396" />
          <path d="M 396 50 H 376 V 300" />
          <line x1="91" y1="300" x2="476" y2="300" />
          <line x1="91" y1="300" x2="91" y2="330" />
          <line x1="281" y1="300" x2="281" y2="330" />
          <line x1="476" y1="300" x2="476" y2="330" />
          <line x1="91" y1="330" x2="91" y2="216" />
          <line x1="166" y1="190" x2="206" y2="190" />
        </g>
        <g fontSize="11" className={label} opacity="0.75">
          <text x="186" y="40" textAnchor="middle">wss</text>
          <text x="376" y="40" textAnchor="middle">in-proc</text>
          <text x="413" y="140" textAnchor="middle">lookup</text>
          <text x="300" y="292" textAnchor="middle">WS/STOMP · filtered ticks</text>
          <text x="100" y="275" textAnchor="start">REST · orders</text>
          <text x="186" y="182" textAnchor="middle">in-proc</text>
        </g>
      </svg>
      <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
        Fan-out: one upstream socket feeds thousands of sessions through the
        Broadcast Scheduler. Order and wallet paths never touch tick traffic.
      </figcaption>
    </figure>
  );
}
