"use client";

import { PageShell } from "@/components/PageShell";
import { createUiComponentsLayout } from "@/lib/createUiComponentsLayout";

export default function UiComponentsPage() {
  return (
    <PageShell
      navLinks={[{ href: "/", label: "Back to Home" }]}
      pageKey="ui-components"
      onCreateLayout={createUiComponentsLayout}
    >
      <h1>UI Components</h1>
    </PageShell>
  );
}
