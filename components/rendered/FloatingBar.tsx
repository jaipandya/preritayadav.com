"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { socials } from "@/lib/contactContent";
import { renderedNav } from "@/lib/renderedChrome";
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

  return (
    <div className="r-bar-wrap">
      <div className="r-bar">
        <nav className="r-bar-group" aria-label={renderedNav.ariaLabel}>
          {renderedNav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="r-bar-link"
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href={sketchPath} className="r-bar-icon" aria-label={renderedNav.sketchLabel} title={renderedNav.sketchLabel}>
            <PencilIcon />
          </Link>
          <div className="r-bar-socials">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="r-bar-icon" aria-label={s.label}>
                <SocialIcon name={s.label} />
              </a>
            ))}
          </div>
        </nav>
        <Link href={renderedNav.cta.href} className="r-bar-link r-bar-cta">
          {renderedNav.cta.label} &#8599;
        </Link>
      </div>
    </div>
  );
}
