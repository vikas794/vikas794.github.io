import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

const useHydratedMock = vi.fn();

vi.mock("../hooks/useHydrated", () => ({
  useHydrated: () => useHydratedMock(),
}));

vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: {} as { workerSrc?: string } },
  Document: ({
    file,
    onLoadSuccess,
    onLoadError,
    children,
  }: {
    file: string;
    onLoadSuccess: (info: { numPages: number }) => void;
    onLoadError: () => void;
    children: React.ReactNode;
  }) => {
    useEffect(() => {
      if (file === "/broken.pdf") {
        onLoadError();
      } else {
        onLoadSuccess({ numPages: 2 });
      }
    }, [file, onLoadError, onLoadSuccess]);
    return <div data-testid="document">{children}</div>;
  },
  Page: ({ pageNumber }: { pageNumber: number }) => <div data-testid={`page-${pageNumber}`} />,
}));

import ResumePdfPreview from "./ResumePdfPreview";

describe("ResumePdfPreview", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading text before hydration", () => {
    useHydratedMock.mockReturnValue(false);

    render(<ResumePdfPreview file="/resume.pdf" />);

    expect(screen.getByText("Loading résumé preview…")).toBeInTheDocument();
    expect(screen.queryByTestId("document")).not.toBeInTheDocument();
  });

  it("renders the PDF pages once hydrated and loaded", async () => {
    useHydratedMock.mockReturnValue(true);

    render(<ResumePdfPreview file="/resume.pdf" />);

    await waitFor(() => {
      expect(screen.getByTestId("page-1")).toBeInTheDocument();
    });
    expect(screen.getByTestId("page-2")).toBeInTheDocument();
  });

  it("shows a download fallback when the PDF fails to load", async () => {
    useHydratedMock.mockReturnValue(true);

    render(<ResumePdfPreview file="/broken.pdf" />);

    await waitFor(() => {
      expect(screen.getByText(/Couldn't load the résumé preview/)).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /Download the résumé instead/ })).toHaveAttribute(
      "href",
      "/broken.pdf"
    );
  });
});
