"use client";

type NavLink = {
  href: string;
  label: string;
};

export function AccessibleNav({ links }: { links: NavLink[] }) {
  return (
    <nav
      aria-label="Portfolio navigation"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: -10000,
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        Skip to main content
      </a>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
