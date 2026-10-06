import type { Metadata } from "next";

export const SITE_URL = "https://preritayadav.com";
export const SITE_NAME = "Prerita Yadav";

/**
 * Page metadata with its own canonical URL, Open Graph and Twitter text.
 * A page that sets `openGraph` replaces the root layout's whole object (Next merges one level deep),
 * so url, siteName, type and locale are repeated here. The share image comes from the page's
 * `opengraph-image.tsx`, which Next adds to both Open Graph and Twitter.
 * `title` is the short page title; the root template adds " | Prerita Yadav".
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Path on the canvas site, e.g. `/about`. */
  path: string;
}): Metadata {
  const shareTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}
