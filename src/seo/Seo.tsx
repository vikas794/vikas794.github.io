import { canonicalUrl, DEFAULT_OG_IMAGE } from "./site";

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

// Native React 19 metadata: <title>/<meta>/<link> hoist to <head>,
// <script type="application/ld+json"> stays inline in the body (not hoisted).
// The prerender entry splits the hoistable prefix into the document head.
export default function Seo({ title, description, path, image, noindex }: SeoProps) {
  const canonical = canonicalUrl(path);
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {noindex && <meta name="robots" content="noindex" />}
    </>
  );
}
