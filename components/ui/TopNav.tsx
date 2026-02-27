"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { wobblyRect } from "@/lib/variationSeed";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const META_LINKS = [
  { href: "/meta/ui-components", label: "UI Components" },
  { href: "/meta/typography", label: "Typography" },
];

export function TopNav() {
  const pathname = usePathname();
  const [metaOpen, setMetaOpen] = useState(false);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!metaOpen) return;
    function handleClick(e: MouseEvent) {
      if (metaRef.current && !metaRef.current.contains(e.target as Node)) {
        setMetaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [metaOpen]);

  // Close dropdown on navigation
  useEffect(() => {
    setMetaOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Loranthus', sans-serif",
    fontSize: 13,
    color: "#1a1a1a",
    textDecoration: "none",
    opacity: active ? 1 : 0.6,
    borderBottom: active ? "1px solid #1a1a1a" : "1px solid transparent",
    paddingBottom: 2,
    transition: "opacity 0.15s",
  });

  const dropdownPath = wobblyRect("meta-dropdown", 130, META_LINKS.length * 32 + 8, 2);

  return (
    <nav
      style={{
        height: 32,
        borderBottom: "1px solid #e0e0e0",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        pointerEvents: "auto",
        flexShrink: 0,
        background: "#fff",
      }}
    >
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.label}
            href={link.href}
            style={linkStyle(active)}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = active ? "1" : "0.6"; }}
          >
            {link.label}
          </Link>
        );
      })}

      {/* Meta dropdown */}
      <div ref={metaRef} style={{ position: "relative" }}>
        <button
          onClick={() => setMetaOpen((v) => !v)}
          style={{
            ...linkStyle(META_LINKS.some((l) => isActive(l.href))),
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => {
            const active = META_LINKS.some((l) => isActive(l.href));
            e.currentTarget.style.opacity = active ? "1" : "0.6";
          }}
        >
          Meta
          <svg width={8} height={6} viewBox="0 0 8 6" style={{ marginTop: 1 }}>
            <path d="M0 0 L4 5 L8 0" fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
          </svg>
        </button>

        {metaOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: -8,
              width: 130,
              zIndex: 1000,
            }}
          >
            <svg
              width={130}
              height={META_LINKS.length * 32 + 8}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <path d={dropdownPath} fill="#fff" stroke="#1a1a1a" strokeWidth={1.2} />
            </svg>
            <div style={{ position: "relative", padding: "4px 0" }}>
              {META_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "6px 12px",
                    fontFamily: "'Loranthus', sans-serif",
                    fontSize: 13,
                    color: "#1a1a1a",
                    textDecoration: "none",
                    opacity: isActive(link.href) ? 1 : 0.6,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = isActive(link.href) ? "1" : "0.6"; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
