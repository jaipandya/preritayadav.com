"use client";

import { use, useCallback } from "react";
import type { Editor } from "tldraw";
import { PageShell } from "@/components/PageShell";
import { createBlogLayout } from "@/lib/createBlogLayout";

const navLinks = [
  { href: "/", label: "Back to Home" },
  { href: "/contact", label: "Contact" },
];

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
    <PageShell navLinks={navLinks} pageKey={`blog-${slug}`} onCreateLayout={handleCreateLayout}>
      <h1>{slug.replace(/-/g, " ")}</h1>
    </PageShell>
  );
}
