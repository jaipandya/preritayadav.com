"use client";

import { use, useCallback } from "react";
import type { Editor } from "tldraw";
import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createWorkDetailLayout } from "@/lib/createWorkDetailLayout";

export default function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const handleCreateLayout = useCallback(
    (editor: Editor) => {
      createWorkDetailLayout(editor, slug);
    },
    [slug]
  );

  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav
        links={[
          { href: "/work", label: "Back to Work" },
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]}
      />
      <WipCanvas
        pageKey={`work-${slug}`}
        onCreateLayout={handleCreateLayout}
      />
    </div>
  );
}
