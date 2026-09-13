import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ErrorBoundary from "./ErrorBoundary";

const ProblemChild = () => {
  throw new Error("Test explosion");
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Normal Child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Normal Child")).toBeInTheDocument();
  });

  it("catches errors and renders 500 error page fallback", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Error 500 · Application Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(screen.getByText(/Test explosion/)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
