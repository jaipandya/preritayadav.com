"use client";

import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createLandingLayout } from "@/lib/createLandingLayout";

const navLinks = [
  { href: "/project/redesigning-checkout", label: "Project: Redesigning the Checkout" },
  { href: "/project/design-system", label: "Project: Design System" },
  { href: "/project/mobile-app", label: "Project: Mobile App" },
  { href: "/project/brand-identity", label: "Project: Brand Identity" },
  { href: "/project/dashboard", label: "Project: Dashboard" },
  { href: "/project/marketing-site", label: "Project: Marketing Site" },
  { href: "/blog/design-thinking", label: "Blog: Design Thinking" },
  { href: "/blog/ux-research", label: "Blog: UX Research Methods" },
  { href: "/contact", label: "Contact" },
];

export default function Home() {
  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={navLinks} />
      <WipCanvas
        pageKey="landing"
        onCreateLayout={createLandingLayout}
      />
    </div>
  );
}
