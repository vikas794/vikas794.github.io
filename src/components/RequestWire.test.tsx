import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RequestWire from "./RequestWire";

describe("RequestWire", () => {
  it("renders a progress wire with no nodes when the page has no hops", async () => {
    render(
      <MemoryRouter>
        <RequestWire />
      </MemoryRouter>
    );
    expect(screen.getByRole("navigation", { name: "Page sections" })).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("adds a labelled link node for each [data-hop] section", async () => {
    render(
      <MemoryRouter>
        <section id="gateway" data-hop="gateway" />
        <section id="services" data-hop="services" />
        <RequestWire />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(2));
    expect(screen.getByRole("link", { name: "Go to services" })).toHaveAttribute("href", "#services");
  });

  describe("inverted colours over the accent band", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(window, "requestAnimationFrame").mockImplementation(
        (cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number
      );
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => clearTimeout(id));
      Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    });
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    const bandAt = (top: number, bottom: number) => {
      const band = document.getElementById("band")!;
      band.getBoundingClientRect = () => ({ top, bottom, height: bottom - top }) as DOMRect;
      Object.defineProperty(window, "scrollY", { value: Math.random(), configurable: true });
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        vi.advanceTimersByTime(40);
      });
    };

    it("clips the inverted wire to the band's on-screen extent and hides it when the band is off screen", () => {
      const { container } = render(
        <MemoryRouter>
          <section id="band" data-wire-invert />
          <RequestWire />
        </MemoryRouter>
      );
      act(() => vi.advanceTimersByTime(40));
      const inv = container.querySelector<HTMLElement>(".wire-invert")!;

      bandAt(200, 600); // fully on screen
      expect(inv.style.clipPath).toBe("inset(200px 0 200px 0)");

      bandAt(-300, 250); // top edge scrolled past
      expect(inv.style.clipPath).toBe("inset(0px 0 550px 0)");

      bandAt(700, 1100); // bottom of the band is below the fold
      expect(inv.style.clipPath).toBe("inset(700px 0 0px 0)");

      bandAt(-900, -100); // band entirely above the viewport
      expect(inv.style.clipPath).toBe("inset(100% 0 0 0)");
    });
  });
});
