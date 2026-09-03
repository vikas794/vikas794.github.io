export interface TradeoffRow {
  decision: string;
  optionA: string;
  optionB: string;
  chosen: string;
}

export interface CaseStudyOutcome {
  metric: string;
  before: string;
  after: string;
  method: string;
}

export interface CodeLine {
  code: string;
  note?: string;
}

export interface CodeExcerpt {
  path: string;
  honesty: string;
  lines: CodeLine[];
}

export interface CaseStudy {
  slug: string;
  number: string;
  title: string;
  stack: string;
  summary: string;
  problem: string;
  constraints: string[];
  decisions: TradeoffRow[];
  outcomes: CaseStudyOutcome[];
  codeRef: string;
  code?: CodeExcerpt;
  diagram?: "fanout";
  whatIdDoDifferently: string;
  updated: string;
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "market-ticks-fanout",
    number: "01",
    title: "Streaming live market ticks to thousands of clients from one upstream socket",
    stack: "Kite Connect · WebSocket · Spring Scheduler · Razorpay · iText7 · AWS S3",
    summary:
      "Real-time algo-trading backend with Kite Connect OAuth, WebSocket tick broadcast to concurrent users, Razorpay wallet with GST, and automated PDF payout generation stored on S3.",
    problem:
      "Upstream gives us exactly one Kite Connect socket. Every open trade screen needs the same ticks, immediately, without slowing order placement or billing. Polling per client multiplies upstream load and lags; a naive broadcast blocks request threads. The constraint: fan every tick out to thousands of sessions from that single socket while the order and wallet paths stay untouched.",
    constraints: ["Single upstream socket", "Thousands of concurrent WebSocket sessions", "Order + billing paths must never block on ticks", "Market-hours bursts, no quiet window to catch up"],
    decisions: [
      { decision: "Fan-out", optionA: "Per-user upstream socket", optionB: "Single socket + in-memory broadcast", chosen: "Single socket + broadcast via scheduled pipeline" },
      { decision: "Auth", optionA: "Long-lived shared token", optionB: "OAuth + per-session JWT", chosen: "Kite OAuth upstream, per-room JWT downstream" },
    ],
    outcomes: [
      { metric: "Concurrent tick consumers", before: "Polling per client", after: "Thousands on one socket", method: "WebSocket session count in production" },
      { metric: "Request-thread blocking on market data", before: "Coupled", after: "Zero — async pipeline", method: "Thread-dump + scheduler separation review" },
    ],
    codeRef: "Broadcast-scheduler excerpt, annotated",
    code: {
      path: "BroadcastScheduler.java",
      honesty: "Simplified illustration of the production pattern — structure faithful, details trimmed — not a verbatim paste.",
      lines: [
        { code: "// One socket in; thousands of sessions out. Clients must never slow it." },
        { code: "@Scheduled(fixedDelay = 500)" },
        { code: "void broadcast() {" },
        { code: "  Tick tick = latest.get();", note: "Atomic ref: ingest writes, broadcast reads — no lock on the hot path." },
        { code: "  if (tick == null || tick.sameAs(lastSent)) return;", note: "No change, no traffic: slow clients skip stale ticks instead of queueing." },
        { code: "  lastSent = tick;" },
        { code: "  for (Session s : registry.all()) {", note: "Session registry, not a scan of request threads — orders never block." },
        { code: "    if (!s.wants(tick.instrument())) continue;", note: "Per-session instrument filter keeps every payload minimal." },
        { code: "    s.send(tick);", note: "Fire-and-forget: a dead session logs and drops, never retries inline." },
        { code: "  }" },
        { code: "}" },
      ],
    },
    diagram: "fanout",
    whatIdDoDifferently:
      "Two things. First, per-session backpressure accounting: today a client that stops reading is detected only when its send fails — I'd track unread depth per session and shed the slowest consumers before they cost the rest a tick. Second, a recorded tick-replay harness: market hours are the worst time to discover a fan-out regression, so I'd capture a busy hour of ticks and replay it in CI to prove the broadcast path holds before every deploy.",
    updated: "2026-04-03",
    featured: true,
  },
  {
    slug: "healthcare-backend-trust",
    number: "02",
    title: "Making a healthcare backend fast enough to trust",
    stack: "JWT · Spring Security · ETL · @Async · MS SQL Server",
    summary:
      "High-availability backend for sensitive health records. JWT-secured REST APIs cut integration time 40%. Python ETL pipelines eliminated 80% of manual effort. Async multithreading: +30% throughput, −150ms latency.",
    problem:
      "Partner integrations stall on unclear auth and slow reports while manual record handling eats ops hours on sensitive data.",
    constraints: ["Sensitive health records", "Slow reports block partner onboarding", "Manual ETL does not scale"],
    decisions: [
      { decision: "Ingestion", optionA: "Manual CSV handling", optionB: "Automated Python ETL", chosen: "Automated ETL with cleansing" },
      { decision: "Hot paths", optionA: "Synchronous JPA", optionB: "Async + indexed reads", chosen: "Multithreading + composite indexing" },
    ],
    outcomes: [
      { metric: "External integration time", before: "Baseline", after: "−40%", method: "Partner onboarding time, before/after" },
      { metric: "API throughput", before: "Baseline", after: "+30%", method: "Load test on hot paths" },
      { metric: "Response latency", before: "Baseline", after: "−150ms", method: "p95 on instrumented endpoints" },
      { metric: "Manual data-handling effort", before: "Baseline", after: "−80%", method: "Ops hours on record processing" },
      { metric: "Report generation time", before: "Baseline", after: "−50% (2×)", method: "Timed report runs after indexing" },
    ],
    codeRef: "Index before/after + DDD boundary fragment (follows in the full write-up)",
    whatIdDoDifferently:
      "Version the ETL schemas from day one and add data-quality gates so bad upstream rows fail loudly instead of silently.",
    updated: "2026-04-03",
    featured: true,
  },
  {
    slug: "sql-injection-surface",
    number: "03",
    title: "Closing the SQL injection surface across a live codebase",
    stack: "Spring Security · RBAC · Parameterized Queries · @PreAuthorize",
    summary:
      "Replaced legacy HQL string concatenation with parameterized queries across all modules — closed SQL injection surface entirely. @PreAuthorize-based RBAC for granular multi-tenant control.",
    problem:
      "Legacy HQL concatenation scattered across 30+ modules leaves an injection surface that code review alone cannot bound.",
    constraints: ["Live multi-tenant codebase", "30+ modules", "Zero downtime for the fix"],
    decisions: [
      { decision: "Query style", optionA: "String-concat HQL", optionB: "Parameterized queries", chosen: "Parameterized everywhere" },
      { decision: "Authorization", optionA: "URL-only checks", optionB: "Method-level RBAC", chosen: "@PreAuthorize across modules" },
    ],
    outcomes: [
      { metric: "HQL-concat call sites", before: "Present across modules", after: "Zero", method: "Repo-wide grep + review before/after" },
      { metric: "RBAC coverage", before: "Partial", after: "30+ modules", method: "Annotation audit across modules" },
    ],
    codeRef: "HQL-concat → parameterized diff (follows in the full write-up)",
    whatIdDoDifferently:
      "Add a CI grep-gate and a JPQL allow-list test so concatenation can never be reintroduced. Verification stated honestly: static grep plus review, not a pentest claim.",
    updated: "2026-04-03",
    featured: true,
  },
];

// Home proof strip: every number links to the case study that
// substantiates it (the credibility mechanic). Methods stated always.
export const proofStrip: { value: string; label: string; method: string; slug: string }[] = [
  { value: "1 → thousands", label: "Upstream sockets → concurrent tick consumers", method: "WebSocket session count, production", slug: "market-ticks-fanout" },
  { value: "+30%", label: "API throughput", method: "Load test on instrumented hot paths", slug: "healthcare-backend-trust" },
  { value: "−80%", label: "Manual data-handling effort", method: "Ops hours on record processing", slug: "healthcare-backend-trust" },
  { value: "0", label: "HQL string-concat call sites", method: "Repo-wide grep + review, before/after", slug: "sql-injection-surface" },
];

// Demoted to one-liners — acknowledged, not given equal weight.
export const alsoShipped: { title: string; line: string }[] = [
  { title: "Multi-channel notifications", line: "FCM V1 + WhatsApp Business + SMTP behind a non-blocking @Async hub." },
  { title: "Live video (100MS)", line: "Per-room JWT issuance with EdTech progress tracking." },
  { title: "YouTube Data API", line: "Auto-fetch lecture metadata for course modules." },
  { title: "GPS geofencing", line: "Location-based attendance with boundary checks." },
  { title: "iText7 → S3 invoicing", line: "Templated PDF payouts with GST, stored on AWS S3." },
  { title: "Java Time migration", line: "30+ modules to LocalDate/LocalDateTime, IST standardized." },
];
