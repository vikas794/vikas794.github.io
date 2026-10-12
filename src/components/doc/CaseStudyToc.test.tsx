import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CaseStudyToc } from "./CaseStudy";

const toc = [
  { id: "problem", label: "Problem" },
  { id: "decisions", label: "Decisions" },
  { id: "results", label: "Results" },
];

// Headings stacked 600px apart; `scrollY` decides where each one sits on screen.
let scrollY = 0;
function placeHeadings() {
  toc.forEach((t, i) => {
    const el = document.getElementById(t.id)!;
    el.getBoundingClientRect = () => ({ top: i * 600 - scrollY }) as DOMRect;
  });
}

function scrollTo(y: number) {
  scrollY = y;
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  placeHeadings();
  act(() => {
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(40);
  });
}

describe("CaseStudyToc", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      (cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number
    );
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => clearTimeout(id));
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    scrollY = 0;
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("marks the section being read and moves the mark as you scroll, both ways", () => {
    render(
      <>
        <CaseStudyToc toc={toc} />
        {toc.map((t) => (
          <h2 key={t.id} id={t.id}>
            {t.label}
          </h2>
        ))}
      </>
    );
    placeHeadings();
    scrollTo(0);
    // Problem heading is at the top (0 <= 240): it is the current section.
    expect(screen.getByRole("link", { name: "Problem" })).toHaveAttribute("aria-current", "location");

    scrollTo(700);
    expect(screen.getByRole("link", { name: "Decisions" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Problem" })).not.toHaveAttribute("aria-current");

    scrollTo(1300);
    expect(screen.getByRole("link", { name: "Results" })).toHaveAttribute("aria-current", "location");

    scrollTo(100);
    expect(screen.getByRole("link", { name: "Problem" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Results" })).not.toHaveAttribute("aria-current");
  });
});
