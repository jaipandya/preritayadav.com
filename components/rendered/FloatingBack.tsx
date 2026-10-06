"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useContent } from "@/lib/useContentOverrides";

/**
 * Round back button that appears after scrolling past the top of a case study.
 * The accessible name is the same (editable) label as the inline back link.
 */
export function FloatingBack({ href, k, fallback }: { href: string; k: string; fallback: string }) {
  const [visible, setVisible] = useState(false);
  const label = useContent(k, fallback);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link href={href} className="r-float-back" data-visible={visible} aria-label={label} tabIndex={visible ? 0 : -1}>
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 8H3M7 4L3 8l4 4" />
      </svg>
    </Link>
  );
}
