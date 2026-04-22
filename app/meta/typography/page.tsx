"use client";

import { PageShell } from "@/components/PageShell";
import { createTypographyLayout } from "@/lib/createTypographyLayout";

export default function TypographyPage() {
  return (
    <PageShell
      navLinks={[{ href: "/", label: "Back to Home" }]}
      pageKey="typography"
      onCreateLayout={createTypographyLayout}
    >
      <h1>Typography</h1>
    </PageShell>
  );
}
