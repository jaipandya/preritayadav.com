"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function PencilIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 1.5l3 3L5 14H2v-3z" />
      <path d="M9.5 3.5l3 3" />
    </svg>
  );
}

export function SketchToggle() {
  const pathname = usePathname();
  const sketchPath = pathname.replace(/^\/rendered/, "") || "/";

  return (
    <Link href={sketchPath} className="r-sketch-toggle" title="Switch to sketch version">
      <PencilIcon />
      Sketch
    </Link>
  );
}
