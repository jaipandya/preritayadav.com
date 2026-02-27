"use client";

import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createWorkListingLayout } from "@/lib/createWorkListingLayout";
import { workItems } from "@/lib/workData";

const navLinks = [
  { href: "/", label: "Home" },
  ...workItems.map((item) => ({
    href: `/work/${item.slug}`,
    label: item.title,
  })),
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function WorkPage() {
  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={navLinks} />
      <WipCanvas
        pageKey="work-listing"
        onCreateLayout={createWorkListingLayout}
      />
    </div>
  );
}
