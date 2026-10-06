import Image from "next/image";
import type { CSSProperties } from "react";
import { markSources } from "./markSources";

/** Logo tile for a case study. Decorative: the company name is always next to it. */
export function Mark({ slug, company, size = "md" }: { slug: string; company: string; size?: "md" | "lg" }) {
  const source = markSources[slug];
  const px = size === "lg" ? 44 : 36;
  return (
    <span
      className="r-mark"
      data-size={size}
      data-fit={source?.fit}
      data-fallback={source ? undefined : "true"}
      style={source?.pad !== undefined ? ({ "--pad": `${source.pad}px` } as CSSProperties) : undefined}
      aria-hidden="true"
    >
      {source ? <Image src={source.src} alt="" width={px} height={px} sizes={`${px}px`} /> : company.charAt(0)}
    </span>
  );
}
