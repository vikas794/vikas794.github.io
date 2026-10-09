import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import Hero from "./Hero";
import { profile } from "../../content/profile";
import { proofStrip } from "../../content/projects";

const heroStat = proofStrip[0];

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  );
}

describe("Hero", () => {
  it("renders the headline as the h1", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1, name: profile.headline })).toBeInTheDocument();
  });

  it("links the flagship stat to its case study", () => {
    renderHero();
    const link = screen.getByRole("link", { name: new RegExp(heroStat.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
    expect(link).toHaveAttribute("href", `/projects/${heroStat.slug}/`);
  });

  it("shows availability and both primary CTAs", () => {
    renderHero();
    expect(screen.getByText(profile.availability)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read the case studies/i })).toHaveAttribute("href", "/projects/");
    expect(screen.getByRole("link", { name: "Résumé" })).toHaveAttribute("href", "/resume/");
  });

  it("renders the accessible hero diagram linking to the case study", () => {
    renderHero();
    expect(screen.getByRole("img", { name: /^Market-tick fan-out, simplified/ })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "How this works — read the fan-out case study" })
    ).toHaveAttribute("href", `/projects/${heroStat.slug}/`);
  });
});
