import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Minimal in-memory Cache Storage.
function fakeCaches() {
  const store = new Map<string, Response>();
  return {
    store,
    api: {
      open: async () => ({
        match: async (url: string) => store.get(url)?.clone(),
        put: async (url: string, res: Response) => {
          store.set(url, res);
        },
      }),
    },
  };
}

const bytes = () => new Uint8Array([37, 80, 68, 70]).buffer; // "%PDF"

describe("resumeStore", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    fetchMock = vi.fn(async () => new Response(bytes(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("fetches once however many callers ask, including across 'page changes'", async () => {
    vi.stubGlobal("caches", undefined);
    const { loadResume } = await import("./resumeStore");
    await Promise.all([loadResume("/r.pdf"), loadResume("/r.pdf")]);
    await loadResume("/r.pdf");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stores the PDF in Cache Storage and reads it back without the network on a later visit", async () => {
    const c = fakeCaches();
    vi.stubGlobal("caches", c.api);
    const first = await import("./resumeStore");
    await first.loadResume("/r.pdf");
    await vi.waitFor(() => expect(c.store.has("/r.pdf")).toBe(true));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // New page load: module state is gone, the cache is not.
    vi.resetModules();
    const second = await import("./resumeStore");
    const buf = await second.loadResume("/r.pdf");
    expect(new Uint8Array(buf)).toEqual(new Uint8Array([37, 80, 68, 70]));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fetches again once the cached copy is older than 24 hours", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const c = fakeCaches();
    vi.stubGlobal("caches", c.api);
    const first = await import("./resumeStore");
    await first.loadResume("/r.pdf");
    await vi.waitFor(() => expect(c.store.has("/r.pdf")).toBe(true));

    vi.setSystemTime(Date.now() + 25 * 60 * 60 * 1000);
    vi.resetModules();
    const second = await import("./resumeStore");
    await second.loadResume("/r.pdf");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not remember a failed download", async () => {
    vi.stubGlobal("caches", undefined);
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 500 }));
    const { loadResume } = await import("./resumeStore");
    await expect(loadResume("/r.pdf")).rejects.toThrow();
    await expect(loadResume("/r.pdf")).resolves.toBeInstanceOf(ArrayBuffer);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("hands out private copies so pdf.js detaching one does not break the next", async () => {
    vi.stubGlobal("caches", undefined);
    const { loadResumeCopy } = await import("./resumeStore");
    const a = await loadResumeCopy("/r.pdf");
    const b = await loadResumeCopy("/r.pdf");
    expect(a.buffer).not.toBe(b.buffer);
    expect(Array.from(b)).toEqual([37, 80, 68, 70]);
  });
});
