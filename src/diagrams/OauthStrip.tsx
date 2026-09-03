// The critical path as a sequence strip: Kite Connect OAuth before any
// tick can flow. Plain HTML (not SVG) so every step stays selectable,
// translatable, and screen-reader linear.
const STEPS = [
  { from: "Browser", to: "Backend", via: "REST · GET /oauth/start", what: "Trade screen requests a login." },
  { from: "Backend", to: "Kite", via: "OAuth2 · redirect", what: "User approves access on Kite." },
  { from: "Kite", to: "Backend", via: "OAuth2 · request_token", what: "Callback returns a one-time token." },
  { from: "Backend", to: "Kite", via: "REST · server-side exchange", what: "Token exchanged for a session access token." },
  { from: "Backend", to: "Browser", via: "WS/STOMP · subscribe", what: "Session JWT issued; ticks start flowing." },
];

export default function OauthStrip() {
  return (
    <figure className="my-8 max-w-evidence">
      <ol className="border-t border-rule">
        {STEPS.map((s, i) => (
          <li
            key={s.via}
            className="strip-grid border-b border-rule py-4"
          >
            <span className="font-mono text-sm text-accent" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-small">
                <span className="font-medium">{s.from}</span>
                <span aria-hidden="true"> → </span>
                <span className="font-medium">{s.to}</span>
              </p>
              <p className="mt-1 font-mono text-xs text-ink-3">{s.via}</p>
              <p className="mt-1 text-small text-ink-2">{s.what}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
        Critical path: no tick flows before the OAuth exchange completes. The
        access token lives server-side; the browser only ever holds its session JWT.
      </figcaption>
    </figure>
  );
}
