// Fetch-once store for the résumé PDF.
//
// - One shared promise per URL: the viewer, the idle warm-up and any number
//   of route changes all get the same download, never a second request.
// - Persisted in Cache Storage, so a repeat visit reads the PDF from disk
//   instead of the network. An entry is trusted for 24 hours, then fetched
//   again once so an updated résumé still reaches returning visitors.
// - Where Cache Storage is unavailable (private mode, old browsers) the
//   in-memory promise still prevents re-fetching while the tab is open.
//
// Browser only: never import this from anything that is server-rendered
// without guarding the call, since it touches `caches` and `fetch`.

const CACHE_NAME = "resume-v1";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const STAMP_HEADER = "x-cached-at";

const inflight = new Map<string, Promise<ArrayBuffer>>();

async function readCached(url: string): Promise<ArrayBuffer | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(url);
    if (!hit) return null;
    const stamp = Number(hit.headers.get(STAMP_HEADER));
    if (!stamp || Date.now() - stamp > MAX_AGE_MS) return null;
    return await hit.arrayBuffer();
  } catch {
    return null;
  }
}

async function writeCached(url: string, body: ArrayBuffer): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      url,
      new Response(body, {
        headers: { "content-type": "application/pdf", [STAMP_HEADER]: String(Date.now()) },
      })
    );
  } catch {
    /* storage full or blocked: the in-memory copy is enough */
  }
}

async function load(url: string): Promise<ArrayBuffer> {
  const cached = await readCached(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Résumé request failed: ${res.status}`);
  const body = await res.arrayBuffer();
  void writeCached(url, body);
  return body;
}

/** The PDF's bytes, fetched at most once per tab and cached across visits. */
export function loadResume(url: string): Promise<ArrayBuffer> {
  let p = inflight.get(url);
  if (!p) {
    p = load(url);
    inflight.set(url, p);
    // A failed attempt must not poison later calls.
    p.catch(() => inflight.delete(url));
  }
  return p;
}

/** A private copy of the bytes: pdf.js transfers (detaches) the buffer it is given. */
export async function loadResumeCopy(url: string): Promise<Uint8Array> {
  return new Uint8Array((await loadResume(url)).slice(0));
}
