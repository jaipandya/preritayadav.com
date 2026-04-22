"use client";

import { PageShell } from "@/components/PageShell";
import { createAboutLayout } from "@/lib/createAboutLayout";
import { workItems } from "@/lib/workData";
import {
  aboutTitle,
  aboutParagraphs,
  aboutOutro,
  aboutFooterText,
  aboutCta,
} from "@/lib/aboutContent";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  ...workItems.map((item) => ({
    href: `/work/${item.slug}`,
    label: item.title,
  })),
  { href: "/contact", label: "Contact" },
];

export default function AboutPage() {
  return (
    <PageShell navLinks={navLinks} pageKey="about" onCreateLayout={createAboutLayout}>
      <h1>{aboutTitle}</h1>
      {aboutParagraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <p>{aboutOutro}</p>
      <footer>
        <p>{aboutFooterText}</p>
        <a href={aboutCta.href}>{aboutCta.label}</a>
      </footer>
    </PageShell>
  );
}
