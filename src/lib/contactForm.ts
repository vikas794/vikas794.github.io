// Client-side guards for the contact form. These improve the experience and
// stop casual abuse; they are NOT a security boundary (anyone can POST to the
// endpoint directly). Real enforcement lives in Formspree: spam filtering,
// rate limits, the domain allow-list and optional reCAPTCHA in its dashboard.

export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
} as const;

/** Ignore submissions faster than this after the form appeared (bots). */
export const MIN_FILL_MS = 2500;
/** Minimum gap between two sends from one browser. */
export const COOLDOWN_MS = 30_000;
/** At most this many successful sends per window. */
export const MAX_SENDS = 3;
export const WINDOW_MS = 60 * 60 * 1000;
export const REQUEST_TIMEOUT_MS = 15_000;

// Control characters (except tab/newline/CR in the message) have no place in
// a contact message and are a common header-injection vector.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
// Practical email check: one @, no spaces, dotted domain with a 2+ letter TLD.
const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function clean(values: ContactValues): ContactValues {
  return {
    name: values.name.replace(/\s+/g, " ").trim(),
    email: values.email.trim().toLowerCase(),
    message: values.message.replace(/\r\n/g, "\n").trim(),
  };
}

export function validate(raw: ContactValues): ContactErrors {
  const v = clean(raw);
  const errors: ContactErrors = {};

  if (v.name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  else if (v.name.length > LIMITS.name.max) errors.name = `Keep the name under ${LIMITS.name.max} characters.`;
  else if (CONTROL.test(v.name) || /[\n\r]/.test(v.name)) errors.name = "The name contains characters that aren't allowed.";

  if (!v.email) errors.email = "Please enter your email.";
  else if (v.email.length > LIMITS.email.max || !EMAIL.test(v.email) || v.email.includes(".."))
    errors.email = "That doesn't look like a valid email address.";

  if (v.message.length < LIMITS.message.min) errors.message = `Please write at least ${LIMITS.message.min} characters.`;
  else if (v.message.length > LIMITS.message.max) errors.message = `Keep the message under ${LIMITS.message.max} characters.`;
  else if (CONTROL.test(v.message)) errors.message = "The message contains characters that aren't allowed.";

  return errors;
}

// ---------- per-browser rate limit ----------
const KEY = "contact:sends";
let memory: number[] = [];

function readSends(now: number): number[] {
  let list: number[] = memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) list = JSON.parse(raw) as number[];
  } catch {
    /* storage unavailable: fall back to the in-memory copy */
  }
  return list.filter((t) => typeof t === "number" && now - t < WINDOW_MS);
}

/** Null when sending is allowed, otherwise a message saying when to retry. */
export function rateLimitMessage(now = Date.now()): string | null {
  const sends = readSends(now);
  const last = sends[sends.length - 1];
  if (last !== undefined && now - last < COOLDOWN_MS) {
    return `Please wait ${Math.ceil((COOLDOWN_MS - (now - last)) / 1000)} seconds before sending another message.`;
  }
  if (sends.length >= MAX_SENDS) {
    const mins = Math.ceil((WINDOW_MS - (now - sends[0])) / 60_000);
    return `You've sent several messages already. Please try again in about ${mins} minutes, or email me directly.`;
  }
  return null;
}

export function recordSend(now = Date.now()): void {
  memory = [...readSends(now), now];
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* private mode */
  }
}

export function resetRateLimit(): void {
  memory = [];
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
