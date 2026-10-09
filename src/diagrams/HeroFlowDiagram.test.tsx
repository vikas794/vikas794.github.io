import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeroFlowDiagram from "./HeroFlowDiagram";

describe("HeroFlowDiagram", () => {
  it("exposes an accessible name resolved from its aria-label and desc id", () => {
    const { container } = render(<HeroFlowDiagram />);

    const img = screen.getByRole("img", { name: /^Market-tick fan-out, simplified/ });
    const describedBy = img.getAttribute("aria-describedby")!;
    expect(container.querySelector(`#${describedBy}`)).not.toBeNull();
    expect(container.querySelector("title")).toBeNull();
  });

  it("renders all three architecture nodes", () => {
    const { container } = render(<HeroFlowDiagram />);
    expect(container.querySelectorAll("rect")).toHaveLength(3);
  });
});
