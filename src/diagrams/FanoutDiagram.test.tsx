import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FanoutDiagram from "./FanoutDiagram";

describe("FanoutDiagram", () => {
  it("exposes an accessible name resolved from its title/desc ids", () => {
    const { container } = render(<FanoutDiagram />);

    const img = screen.getByRole("img", { name: /^Market-tick fan-out architecture/ });
    const labelledBy = img.getAttribute("aria-labelledby")!.split(" ");
    for (const id of labelledBy) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  it("renders all nine architecture nodes", () => {
    const { container } = render(<FanoutDiagram />);
    expect(container.querySelectorAll("rect")).toHaveLength(9);
  });
});
