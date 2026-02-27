"use client";

import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createAboutLayout } from "@/lib/createAboutLayout";
import { workItems } from "@/lib/workData";

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
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={navLinks} />
      <WipCanvas
        pageKey="about"
        onCreateLayout={createAboutLayout}
      />
    </div>
  );
}
