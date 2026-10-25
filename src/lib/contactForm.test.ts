import { describe, it, expect, beforeEach } from "vitest";
import {
  COOLDOWN_MS,
  MAX_SENDS,
  WINDOW_MS,
  clean,
  rateLimitMessage,
  recordSend,
  resetRateLimit,
  validate,
} from "./contactForm";

const ok = { name: "Ada Lovelace", email: "ada@example.com", message: "We are hiring a backend engineer." };

describe("validate", () => {
  it("accepts a normal submission", () => {
    expect(validate(ok)).toEqual({});
  });

  it.each(["", "ada", "ada@", "@example.com", "ada@example", "a b@example.com", "ada@@example.com", "ada@exa..mple.com", "ada@example.c"])(
    "rejects email %j",
    (email) => {
      expect(validate({ ...ok, email }).email).toBeTruthy();
    }
  );

  it("rejects header-injection and control characters", () => {
    expect(validate({ ...ok, email: "ada@example.com\nBcc: x@y.com" }).email).toBeTruthy();
    expect(validate({ ...ok, name: "Ada\u0000" }).name).toBeTruthy();
    expect(validate({ ...ok, message: "hello there\u0007 friend" }).message).toBeTruthy();
  });

  it("enforces length limits", () => {
    expect(validate({ ...ok, name: "A" }).name).toBeTruthy();
    expect(validate({ ...ok, name: "A".repeat(101) }).name).toBeTruthy();
    expect(validate({ ...ok, message: "short" }).message).toBeTruthy();
    expect(validate({ ...ok, message: "x".repeat(2001) }).message).toBeTruthy();
    expect(validate({ ...ok, email: `${"a".repeat(250)}@x.io` }).email).toBeTruthy();
  });

  it("allows newlines and tabs in the message", () => {
    expect(validate({ ...ok, message: "Line one here\n\tLine two here" })).toEqual({});
  });
});

describe("clean", () => {
  it("trims, collapses name whitespace and lowercases the email", () => {
    expect(clean({ name: "  Ada   Lovelace ", email: " ADA@Example.COM ", message: " hi\r\nthere " })).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "hi\nthere",
    });
  });
});

describe("rate limit", () => {
  beforeEach(() => resetRateLimit());

  it("allows the first send", () => {
    expect(rateLimitMessage()).toBeNull();
  });

  it("enforces the cooldown, then allows again", () => {
    const t0 = 1_000_000;
    recordSend(t0);
    expect(rateLimitMessage(t0 + 1000)).toMatch(/wait/i);
    expect(rateLimitMessage(t0 + COOLDOWN_MS + 1)).toBeNull();
  });

  it("caps sends per window and recovers after it", () => {
    const t0 = 5_000_000;
    for (let i = 0; i < MAX_SENDS; i++) recordSend(t0 + i * (COOLDOWN_MS + 1));
    const later = t0 + MAX_SENDS * (COOLDOWN_MS + 1);
    expect(rateLimitMessage(later)).toMatch(/several messages/i);
    expect(rateLimitMessage(t0 + WINDOW_MS + COOLDOWN_MS * MAX_SENDS)).toBeNull();
  });
});
