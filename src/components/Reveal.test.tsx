import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

const useReducedMotionMock = vi.fn();
const useHydratedMock = vi.fn();

vi.mock("motion/react", async () => {
  const actual = await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => useReducedMotionMock() };
});

vi.mock("../hooks/useHydrated", () => ({
  useHydrated: () => useHydratedMock(),
}));

import Reveal, { RevealItem } from "./Reveal";

describe("Reveal / RevealItem", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children synchronously when reduced motion is requested", () => {
    useReducedMotionMock.mockReturnValue(true);
    useHydratedMock.mockReturnValue(true);

    render(
      <Reveal>
        <span>content</span>
      </Reveal>
    );

    expect(screen.getByText("content")).toBeVisible();
  });

  it("renders children synchronously before hydration, regardless of motion preference", () => {
    useReducedMotionMock.mockReturnValue(false);
    useHydratedMock.mockReturnValue(false);

    render(
      <Reveal>
        <span>prerendered</span>
      </Reveal>
    );

    expect(screen.getByText("prerendered")).toBeVisible();
  });

  it("still renders children immediately once hydrated with motion enabled", () => {
    useReducedMotionMock.mockReturnValue(false);
    useHydratedMock.mockReturnValue(true);

    render(
      <Reveal>
        <span>animated</span>
      </Reveal>
    );

    // whileInView never fires under jsdom's mocked IntersectionObserver —
    // content must still be present, not hidden behind the animation.
    expect(screen.getByText("animated")).toBeInTheDocument();
  });

  it("RevealItem renders a plain fallback under reduced motion", () => {
    useReducedMotionMock.mockReturnValue(true);

    render(
      <RevealItem>
        <span>item</span>
      </RevealItem>
    );

    expect(screen.getByText("item")).toBeVisible();
  });

  it("RevealItem renders content when motion is enabled", () => {
    useReducedMotionMock.mockReturnValue(false);

    render(
      <RevealItem>
        <span>item-animated</span>
      </RevealItem>
    );

    expect(screen.getByText("item-animated")).toBeInTheDocument();
  });
});
