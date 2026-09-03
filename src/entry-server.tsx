import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import { expandRoutes } from "./routes/manifest";

const ROOT_OPEN = '<div id="root">';
const HOISTABLE_ONLY = /^(?:<title>[^]*?<\/title>|<meta [^>]*\/>|<link [^>]*\/>)*$/;

export async function render(url: string) {
  const errors: unknown[] = [];
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <div id="root">
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </div>
    </StrictMode>,
    {
      onError(e) {
        errors.push(e);
      },
    }
  );
  let out = "";
  for await (const c of prelude) out += c;
  if (errors.length) throw new AggregateError(errors, `SSR errors on ${url}`);

  const i = out.indexOf(ROOT_OPEN);
  if (i < 0) throw new Error(`prerender: root marker missing for ${url}`);
  const head = out.slice(0, i);
  const rootHtml = out.slice(i);

  if (!HOISTABLE_ONLY.test(head)) throw new Error(`non-hoistable content before #root on ${url}`);
  if (rootHtml.includes("data-msg=") || rootHtml.includes("<!--$!-->"))
    throw new Error(`client-render fallback emitted on ${url}`);
  if (!/<title>/.test(head)) throw new Error(`no <title> emitted for ${url}`);

  return { head, rootHtml };
}

// The SSG script (plain Node ESM, no tsx) imports this bundle —
// expandRoutes() feeds prerender AND the sitemap generator from one array.
export const routePaths: string[] = expandRoutes();
