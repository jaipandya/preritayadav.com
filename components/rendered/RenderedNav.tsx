"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/rendered", label: "Home" },
  { href: "/rendered/work", label: "Work" },
  { href: "/rendered/about", label: "About" },
  { href: "/rendered/contact", label: "Contact" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      {open ? (
        <>
          <line x1="5" y1="5" x2="15" y2="15" />
          <line x1="15" y1="5" x2="5" y2="15" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="17" y2="6" />
          <line x1="3" y1="14" x2="17" y2="14" />
        </>
      )}
    </svg>
  );
}

export function RenderedNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/rendered") return pathname === "/rendered";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="r-nav">
        <div className="r-nav-inner">
          <Link href="/rendered" className="r-nav-logo">
            Prerita Yadav
          </Link>

          <div className="r-nav-links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="r-nav-link"
                data-active={isActive(link.href)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/rendered/contact" className="r-nav-cta">
              Let&rsquo;s talk
            </Link>
          </div>

          <button
            className="r-nav-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      <div className="r-mobile-nav" data-open={mobileOpen}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="r-nav-link"
            data-active={isActive(link.href)}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/rendered/contact"
          className="r-nav-cta"
          onClick={() => setMobileOpen(false)}
        >
          Let&rsquo;s talk
        </Link>
      </div>
    </>
  );
}
