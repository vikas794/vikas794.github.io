import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import SiteHeader from "./SiteHeader";

vi.mock("../../lib/viewTransition", () => ({
  runViewTransition: vi.fn((_kind: string, mutate: () => void) => mutate()),
}));

import { runViewTransition } from "../../lib/viewTransition";

function renderHeader(theme: "light" | "dark" = "light", toggleTheme = vi.fn()) {
  return {
    toggleTheme,
    ...render(
      <MemoryRouter initialEntries={["/about/"]}>
        <SiteHeader theme={theme} toggleTheme={toggleTheme} />
      </MemoryRouter>
    ),
  };
}

describe("SiteHeader", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("keeps the mobile menu closed until toggled, then closes it on link click", () => {
    renderHeader();
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    expect(mobileNav).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toggle menu" })).toHaveAttribute("aria-expanded", "true");

    const [mobileHomeLink] = screen.getAllByRole("link", { name: "Home" }).slice(-1);
    fireEvent.click(mobileHomeLink);
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("runs the view transition and invokes toggleTheme on theme toggle click", () => {
    const { toggleTheme } = renderHeader();
    const [desktopToggle] = screen.getAllByRole("button", { name: "Toggle theme" });

    fireEvent.click(desktopToggle);

    expect(runViewTransition).toHaveBeenCalledWith("theme", toggleTheme);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("marks the active nav link", () => {
    renderHeader();
    expect(screen.getAllByRole("link", { name: "About" })[0]).toHaveClass("text-accent");
    expect(screen.getAllByRole("link", { name: "Home" })[0]).not.toHaveClass("text-accent");
  });

  it("reflects the theme prop via data-theme on both toggle buttons", () => {
    renderHeader("dark");
    for (const toggle of screen.getAllByRole("button", { name: "Toggle theme" })) {
      expect(toggle).toHaveAttribute("data-theme", "dark");
    }
  });
});
