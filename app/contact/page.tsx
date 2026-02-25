"use client";

import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createContactLayout } from "@/lib/createContactLayout";

export default function ContactPage() {
  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={[{ href: "/", label: "Back to Home" }]} />
      <WipCanvas
        pageKey="contact"
        onCreateLayout={createContactLayout}
      />
    </div>
  );
}
