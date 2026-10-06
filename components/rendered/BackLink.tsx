import Link from "next/link";
import type { ReactNode } from "react";

/** Renders the stored label as is. The labels already carry their arrow ("← Back to work"), so no icon is added. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="r-back">
      {children}
    </Link>
  );
}
