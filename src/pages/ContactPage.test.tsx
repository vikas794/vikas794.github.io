import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import ContactPage from "./ContactPage";
import { profile } from "../content/profile";

function renderContact() {
  return render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>
  );
}

describe("ContactPage", () => {
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

  it("submits via Netlify Forms POST and shows the thank-you state", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response());

    renderContact();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );
    });

    const heading = await screen.findByText("Thank you!");
    expect(heading).toBeInTheDocument();
    const thankYouLink = heading.closest("div")!.querySelector(`a[href="mailto:${profile.email}"]`);
    expect(thankYouLink).not.toBeNull();
  });

  it("still shows the thank-you state when the network request fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    renderContact();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Thank you!")).toBeInTheDocument();
  });

  it("lists every contact channel as a link", () => {
    renderContact();
    for (const channel of profile.channels) {
      expect(screen.getByRole("link", { name: channel.value })).toHaveAttribute("href", channel.href);
    }
  });
});
