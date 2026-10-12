import { afterEach, describe, expect, it, vi } from "vitest";

const loadResume = vi.fn(() => Promise.resolve(new ArrayBuffer(4)));
vi.mock("./resumeStore", () => ({ loadResume: (...a: unknown[]) => loadResume(...(a as [])) }));
vi.mock("react-pdf", () => ({}));

function setReadyState(state: "loading" | "complete") {
  Object.defineProperty(document, "readyState", { value: state, configurable: true });
}

describe("prefetchResumeAssets", () => {
  afterEach(() => {
    vi.clearAllMocks();
    setReadyState("complete");
  });

  it("waits for the page to finish loading, then fetches the résumé once when idle", async () => {
    vi.resetModules();
    setReadyState("loading");
    const idle = vi.fn((cb: () => void) => cb());
    vi.stubGlobal("requestIdleCallback", idle);
    window.requestIdleCallback = idle as unknown as typeof window.requestIdleCallback;

    const { prefetchResumeAssets } = await import("./prefetchResume");
    prefetchResumeAssets();
    expect(loadResume).not.toHaveBeenCalled();

    window.dispatchEvent(new Event("load"));
    expect(loadResume).toHaveBeenCalledTimes(1);
    expect(loadResume).toHaveBeenCalledWith("/Vikas_Jaiswal_JavaBackendDeveloper.pdf");
  });

  it("runs only once per tab, however many times it is called (route changes)", async () => {
    vi.resetModules();
    setReadyState("complete");
    const idle = vi.fn((cb: () => void) => cb());
    window.requestIdleCallback = idle as unknown as typeof window.requestIdleCallback;

    const { prefetchResumeAssets } = await import("./prefetchResume");
    prefetchResumeAssets();
    prefetchResumeAssets();
    prefetchResumeAssets();
    expect(loadResume).toHaveBeenCalledTimes(1);
  });
});
