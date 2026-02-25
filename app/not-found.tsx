"use client";

import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createNotFoundLayout } from "@/lib/createNotFoundLayout";

const navLinks = [{ href: "/", label: "Home" }];

export default function NotFound() {
  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={navLinks} />
      <WipCanvas
        pageKey="not-found"
        onCreateLayout={createNotFoundLayout}
      />
    </div>
  );
}
