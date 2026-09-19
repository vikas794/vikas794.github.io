import { useEffect, useRef, useState } from "react";
import type { DocumentProps, PageProps } from "react-pdf";
import { useHydrated } from "../hooks/useHydrated";

type ReactPdfModule = typeof import("react-pdf");

interface Props {
  file: string;
}

const LOADING_TEXT = "Loading résumé preview…";

function FallbackMessage({ file }: { file: string }) {
  return (
    <p className="p-6 text-small">
      Couldn&apos;t load the résumé preview.{" "}
      <a href={file} download>
        Download the résumé instead
      </a>
      , or read the HTML version below.
    </p>
  );
}

// pdfjs-dist touches browser-only globals (DOMMatrix, Worker, canvas) that
// don't exist under Node's SSR/prerender pass, so react-pdf must never be
// imported statically here — only dynamically, inside an effect, which is
// guaranteed to never run during server rendering.
export default function ResumePdfPreview({ file }: Props) {
  const hydrated = useHydrated();
  const [pdf, setPdf] = useState<ReactPdfModule | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    import("react-pdf")
      .then((mod) => {
        if (cancelled) return;
        mod.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        setPdf(mod);
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
    // The container div only mounts once `pdf` is loaded, so this effect
    // must re-run then to attach to the ref (it's null on the first pass).
  }, [pdf]);

  if (error) {
    return <FallbackMessage file={file} />;
  }

  if (!pdf) {
    return <p className="p-6 text-small text-ink-2">{LOADING_TEXT}</p>;
  }

  const { Document, Page } = pdf as unknown as {
    Document: React.ComponentType<DocumentProps>;
    Page: React.ComponentType<PageProps>;
  };

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setPageCount(numPages)}
        onLoadError={() => setError(true)}
        loading={<p className="p-6 text-small text-ink-2">{LOADING_TEXT}</p>}
        error={<FallbackMessage file={file} />}
      >
        {Array.from({ length: pageCount }, (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="mx-auto"
          />
        ))}
      </Document>
    </div>
  );
}
