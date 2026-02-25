"use client";

import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createUiComponentsLayout } from "@/lib/createUiComponentsLayout";

export default function UiComponentsPage() {
  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={[{ href: "/", label: "Back to Home" }]} />
      <WipCanvas
        pageKey="ui-components"
        onCreateLayout={createUiComponentsLayout}
      />
    </div>
  );
}
