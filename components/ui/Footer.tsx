"use client";

import Link from "next/link";
import { wobblyLine } from "@/lib/variationSeed";
import { sounds } from "@/lib/sounds";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
];

const year = new Date().getFullYear();

export function Footer() {
  const linePath = wobblyLine("footer-hr", 4, 0, 520, 0, 1.5);

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Loranthus', sans-serif",
    fontSize: 12,
    color: "#1a1a1a",
    textDecoration: "none",
    opacity: 0.6,
    transition: "opacity 0.15s",
  };

  return (
    <footer
      style={{
        flexShrink: 0,
        padding: "0 16px 10px",
        pointerEvents: "auto",
        background: "#fff",
      }}
    >
      <svg
        width="100%"
        height={12}
        viewBox="0 0 528 12"
        preserveAspectRatio="none"
        style={{ display: "block", margin: "0 auto" }}
      >
        <path d={linePath} fill="none" stroke="#d0d0d0" strokeWidth={1} transform="translate(4,6)" />
      </svg>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Loranthus', sans-serif",
            fontSize: 11,
            color: "#1a1a1a",
            opacity: 0.5,
          }}
        >
          &copy; {year} Prerita Yadav
        </span>

        <nav style={{ display: "flex", gap: 12 }}>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={linkStyle}
              onClick={() => sounds.play("navigate")}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
