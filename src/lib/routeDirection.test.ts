import { describe, expect, it } from "vitest";
import { routeDirection } from "./routeDirection";

describe("routeDirection", () => {
  it("goes forward to later nav sections", () => {
    expect(routeDirection("/", "/contact/")).toBe("forward");
    expect(routeDirection("/about/", "/projects/")).toBe("forward");
  });

  it("goes back to earlier nav sections", () => {
    expect(routeDirection("/contact/", "/about/")).toBe("back");
    expect(routeDirection("/resume/", "/")).toBe("back");
  });

  it("treats project detail as deeper within projects", () => {
    expect(routeDirection("/projects/", "/projects/foo/")).toBe("forward");
    expect(routeDirection("/projects/foo/", "/projects/")).toBe("back");
  });

  it("sends unknown paths after all sections", () => {
    expect(routeDirection("/contact/", "/nope/")).toBe("forward");
    expect(routeDirection("/nope/", "/")).toBe("back");
  });
});
