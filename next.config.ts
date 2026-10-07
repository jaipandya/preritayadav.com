import type { NextConfig } from "next";

/**
 * Hosts search engines may index. Any other host that serves this site (draft subdomain, *.vercel.app, previews) is kept out.
 * Local development is not a duplicate of the live site, so it is left alone too.
 * A negative lookahead, because `has` can only match a value, not exclude one. Keep in sync with docs/seo.md.
 */
const INDEXABLE_HOSTS = ["preritayadav\\.com", "www\\.preritayadav\\.com", "localhost", "127\\.0\\.0\\.1"];
const OTHER_HOST = `(?!(?:${INDEXABLE_HOSTS.join("|")})$).+`;

const nextConfig: NextConfig = {
  transpilePackages: ["tldraw"],
  devIndicators: false,
  // These two replace the old proxy.ts, which ran a function on every request. Config rules cost nothing on Vercel.
  async rewrites() {
    // /about.md and /work/<slug>.md serve the prerendered plain text copy at /md/about and /md/work/<slug>.
    return [{ source: "/:path+.md", destination: "/md/:path+" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: OTHER_HOST }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
