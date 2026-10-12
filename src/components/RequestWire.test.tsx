import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
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
});
