import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Hosts search engines may index. Any other host that serves this site (draft subdomain, *.vercel.app, previews) is kept out. */
const INDEXABLE_HOSTS = new Set(["preritayadav.com", "www.preritayadav.com"]);

function isIndexableHost(host: string) {
  const name = host.split(":")[0].toLowerCase();
  // Local development is not a duplicate of the live site, so leave it alone.
  return INDEXABLE_HOSTS.has(name) || name === "localhost" || name === "127.0.0.1";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response: NextResponse;
  if (pathname.endsWith(".md")) {
    const stripped = pathname.slice(0, -3);
    const pagePath = stripped === "" || stripped === "/" ? "" : stripped;

    const url = request.nextUrl.clone();
    url.pathname = pagePath ? `/md${pagePath}` : "/md";

    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }

  // The same pages are served on several hosts. Only the main domain should appear in search results.
  if (!isIndexableHost(request.headers.get("host") ?? "")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
