import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import CustomErrorPage from "./CustomErrorPage";

describe("CustomErrorPage", () => {
  it("renders 404 error page details correctly", () => {
    render(
      <MemoryRouter initialEntries={["/error/404/"]}>
        <Routes>
          <Route path="/error/:code/" element={<CustomErrorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Error 404 · Not Found")).toBeInTheDocument();
    expect(screen.getByText("This page doesn't exist.")).toBeInTheDocument();
  });

  it("renders 500 error page details correctly", () => {
    render(
      <MemoryRouter initialEntries={["/error/500/"]}>
        <Routes>
          <Route path="/error/:code/" element={<CustomErrorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Error 500 · Internal Server Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders fallback for arbitrary unknown 4xx status code", () => {
    render(
      <MemoryRouter initialEntries={["/error/418/"]}>
        <Routes>
          <Route path="/error/:code/" element={<CustomErrorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("418")).toBeInTheDocument();
    expect(screen.getByText("Error 418 · Client Error")).toBeInTheDocument();
    expect(screen.getByText("Client Error (418)")).toBeInTheDocument();
  });

  it("renders via code prop", () => {
    render(
      <MemoryRouter>
        <CustomErrorPage code="403" />
      </MemoryRouter>
    );

    expect(screen.getByText("403")).toBeInTheDocument();
    expect(screen.getByText("Error 403 · Forbidden")).toBeInTheDocument();
    expect(screen.getByText("Access Forbidden")).toBeInTheDocument();
  });
});
