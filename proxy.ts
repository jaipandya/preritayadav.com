import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.endsWith(".md")) {
    const stripped = pathname.slice(0, -3);
    const pagePath = stripped === "" || stripped === "/" ? "" : stripped;

    const url = request.nextUrl.clone();
    url.pathname = pagePath ? `/md${pagePath}` : "/md";

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*.md",
};
