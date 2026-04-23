"use client";

import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/rendered", label: "Home" },
  { href: "/rendered/work", label: "Work" },
  { href: "/rendered/about", label: "About" },
  { href: "/rendered/contact", label: "Contact" },
];

const year = new Date().getFullYear();

export function RenderedFooter() {
  return (
    <footer className="r-footer">
      <div className="r-footer-inner">
        <span className="r-footer-copy">&copy; {year} Prerita Yadav</span>
        <nav className="r-footer-links">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="r-footer-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
