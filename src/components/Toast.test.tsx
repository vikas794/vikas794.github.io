import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ToastHost, { showToast } from "./Toast";

describe("Toast", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("announces politely, then clears itself", () => {
    render(<ToastHost />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    act(() => showToast("Email copied"));
    expect(screen.getByText("Email copied")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2500));
    expect(screen.queryByText("Email copied")).not.toBeInTheDocument();
  });

  it("restarts the timer when a second toast replaces the first", () => {
    render(<ToastHost />);
    act(() => showToast("One"));
    act(() => vi.advanceTimersByTime(2000));
    act(() => showToast("Two"));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("Two")).toBeInTheDocument();
  });
});
