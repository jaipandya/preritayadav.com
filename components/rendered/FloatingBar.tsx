"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { socials } from "@/lib/contactContent";
import { newTabLabel, renderedNav } from "@/lib/renderedChrome";
import { ExtArrow } from "./ExtArrow";
import { SocialIcon } from "./SocialIcon";


function PencilIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11.5 1.5l3 3L5 14H2v-3z" />
      <path d="M9.5 3.5l3 3" />
    </svg>
  );
}

export function FloatingBar() {
  const pathname = usePathname();
  const sketchPath = pathname.replace(/^\/rendered/, "") || "/";

  const isActive = (href: string) => (href === "/rendered" ? pathname === href : pathname.startsWith(href));

  // A dot under the current page link. It is placed without a transition the first time (so it does not fly in
  // from the left edge) and glides on every navigation after that.
  const groupRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [dot, setDot] = useState<{ x: number; on: boolean; ready: boolean }>({ x: 0, on: false, ready: false });
  const activeIndex = renderedNav.links.findIndex((link) => isActive(link.href));

  useLayoutEffect(() => {
    const group = groupRef.current;
    const place = () => {
      const link = linkRefs.current[activeIndex];
      if (!link) return setDot((d) => (d.on ? { ...d, on: false } : d));
      const x = Math.round(link.offsetLeft + link.offsetWidth / 2 - 2);
      setDot((d) => (d.x === x && d.on ? d : { x, on: true, ready: d.ready }));
    };
    place();
    const frame = requestAnimationFrame(() => setDot((d) => (d.ready ? d : { ...d, ready: true })));
    // Fonts finishing and the window resizing move the links; keep the dot under its link.
    const observer = group ? new ResizeObserver(place) : null;
    if (group) observer?.observe(group);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [activeIndex]);

  return (
    <div className="r-bar-wrap">
      <nav className="r-bar" aria-label={renderedNav.ariaLabel}>
        <div className="r-bar-group" ref={groupRef}>
          {renderedNav.links.map((link, i) => (
            <Link
              key={link.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              href={link.href}
              className="r-bar-link"
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <span
            className="r-bar-dot"
            aria-hidden="true"
            data-on={dot.on}
            data-ready={dot.ready}
            style={{ "--dot-x": `${dot.x}px` } as React.CSSProperties}
          />
          <Link href={sketchPath} className="r-bar-icon r-bar-pencil" aria-label={renderedNav.sketchLabel} title={renderedNav.sketchLabel}>
            <PencilIcon />
          </Link>
          <div className="r-bar-socials">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="r-bar-icon" aria-label={`${s.label} (${newTabLabel})`}>
                <SocialIcon name={s.label} />
              </a>
            ))}
          </div>
        </div>
        <Link href={renderedNav.cta.href} className="r-bar-link r-bar-cta">
          {renderedNav.cta.label}
          <ExtArrow />
        </Link>
      </nav>
    </div>
  );
}
