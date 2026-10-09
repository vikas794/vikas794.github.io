import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FanoutDiagram from "./FanoutDiagram";

describe("FanoutDiagram", () => {
  it("exposes an accessible name resolved from its aria-label and desc id", () => {
    const { container } = render(<FanoutDiagram />);

    const img = screen.getByRole("img", { name: /^Market-tick fan-out architecture/ });
    const describedBy = img.getAttribute("aria-describedby")!;
    expect(container.querySelector(`#${describedBy}`)).not.toBeNull();
    expect(container.querySelector("title")).toBeNull();
  });

  it("renders all nine architecture nodes", () => {
    const { container } = render(<FanoutDiagram />);
    expect(container.querySelectorAll("rect")).toHaveLength(9);
  });
});
