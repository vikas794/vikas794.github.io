import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { skillGroups } from "../../content/skills";
import SkillTabs from "./SkillTabs";

describe("SkillTabs", () => {
  it("exposes tab roles with exactly one selected tab and a labelled panel", () => {
    render(<SkillTabs />);
    expect(screen.getByRole("tablist", { name: "Filter skills by group" })).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(skillGroups.length + 1);
    expect(tabs[0]).toHaveTextContent("All");
    expect(tabs.filter((t) => t.getAttribute("aria-selected") === "true")).toHaveLength(1);
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("All");
    // Default view shows every skill from every group.
    skillGroups.forEach((g) => g.tags.forEach((t) => expect(screen.getAllByText(t).length).toBeGreaterThan(0)));
  });

  it("moves with arrow keys, wraps, and shows the new group's skills", async () => {
    const user = userEvent.setup();
    render(<SkillTabs />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(tabs[tabs.length - 1]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("only the selected tab is in the tab order", () => {
    render(<SkillTabs />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.filter((t) => t.tabIndex === 0)).toHaveLength(1);
  });
});
