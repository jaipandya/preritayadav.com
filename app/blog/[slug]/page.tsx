"use client";

import { use, useCallback } from "react";
import type { Editor } from "tldraw";
import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";
import { createBlogLayout } from "@/lib/createBlogLayout";

export default function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const handleCreateLayout = useCallback(
    (editor: Editor) => {
      createBlogLayout(editor, slug);
    },
    [slug]
  );

  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav
        links={[
          { href: "/", label: "Back to Home" },
          { href: "/contact", label: "Contact" },
        ]}
      />
      <WipCanvas
        pageKey={`blog-${slug}`}
        onCreateLayout={handleCreateLayout}
      />
    </div>
  );
}
