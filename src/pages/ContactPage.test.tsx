import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import ContactPage from "./ContactPage";
import { profile } from "../content/profile";
import { recordSend, resetRateLimit } from "../lib/contactForm";

function renderContact() {
  return render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>
  );
}

describe("ContactPage", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the required fields and a hidden honeypot", () => {
    renderContact();
    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Message")).toBeRequired();
    const honeypot = screen.getByLabelText(/Company \(leave blank\)/i);
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
    expect(honeypot.closest("p")).toHaveAttribute("aria-hidden", "true");
  });

  const MESSAGE = "Hello, we are hiring a backend engineer.";

  function fillAndSend(over: { email?: string; message?: string; honeypot?: string; instant?: boolean } = {}) {
    renderContact();
    if (!over.instant) {
      // Past the "submitted instantly = bot" window.
      const real = Date.now();
      vi.spyOn(Date, "now").mockImplementation(() => real + 10_000);
    }
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: over.email ?? "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: over.message ?? MESSAGE } });
    if (over.honeypot) fireEvent.change(screen.getByLabelText(/Company \(leave blank\)/i), { target: { value: over.honeypot } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  }

  it("posts to Formspree and shows the thank-you state", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));

    fillAndSend();

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://formspree.io/f/xaeeqrjg",
        expect.objectContaining({ method: "POST", headers: { Accept: "application/json" } })
      );
    });

    const heading = await screen.findByText("Thank you!");
    expect(heading).toBeInTheDocument();
    const thankYouLink = heading.closest("div")!.querySelector(`a[href="mailto:${profile.email}"]`);
    expect(thankYouLink).not.toBeNull();
  });

  it("shows the Formspree error and keeps the form when the request is rejected", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ message: "email must be valid" }] }), { status: 422 })
    );

    fillAndSend();

    expect(await screen.findByRole("alert")).toHaveTextContent("email must be valid");
    expect(screen.queryByText("Thank you!")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Ada");
  });

  it("rejects a malformed email or too-short message without sending", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}"));

    fillAndSend({ email: "ada@example", message: "short" });

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("silently drops honeypot and instant submissions without sending", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}"));

    fillAndSend({ honeypot: "Acme Corp" });
    expect(await screen.findByText("Thank you!")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("blocks a second send inside the cooldown and explains why", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}"));
    recordSend(Date.now());

    fillAndSend();

    expect(await screen.findByRole("alert")).toHaveTextContent(/wait \d+ seconds/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reports a Formspree 429 as a retryable error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}", { status: 429 }));

    fillAndSend();

    expect(await screen.findByRole("alert")).toHaveTextContent(/too many requests/i);
  });

  it("shows an error, not a fake success, when the network fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    fillAndSend();

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be sent/i);
    expect(screen.queryByText("Thank you!")).not.toBeInTheDocument();
  });

  it("lists every contact channel as a link", () => {
    renderContact();
    for (const channel of profile.channels) {
      expect(screen.getByRole("link", { name: channel.value })).toHaveAttribute("href", channel.href);
    }
  });
});
