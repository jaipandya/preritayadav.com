"use client";

import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createTypographyLayout } from "@/lib/createTypographyLayout";

export default function TypographyPage() {
  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={[{ href: "/", label: "Back to Home" }]} />
      <WipCanvas
        pageKey="typography"
        onCreateLayout={createTypographyLayout}
      />
    </div>
  );
}
