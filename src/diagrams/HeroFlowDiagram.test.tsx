import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeroFlowDiagram from "./HeroFlowDiagram";

describe("HeroFlowDiagram", () => {
  it("exposes an accessible name resolved from its title/desc ids", () => {
    const { container } = render(<HeroFlowDiagram />);

    const img = screen.getByRole("img", { name: /^Market-tick fan-out, simplified/ });
    const labelledBy = img.getAttribute("aria-labelledby")!.split(" ");
    for (const id of labelledBy) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  it("renders all three architecture nodes", () => {
    const { container } = render(<HeroFlowDiagram />);
    expect(container.querySelectorAll("rect")).toHaveLength(3);
  });
});
