"use client";

import type { Editor } from "tldraw";
import { WipCanvas } from "@/components/canvas/WipCanvas";
import { AccessibleNav } from "@/components/ui/AccessibleNav";

type NavLink = { href: string; label: string };

export function PageShell({
  navLinks,
  pageKey,
  onCreateLayout,
  children,
}: {
  navLinks: NavLink[];
  pageKey: string;
  onCreateLayout?: (editor: Editor) => void;
  children: React.ReactNode;
}) {
  return (
    <div id="main-content" style={{ width: "100vw", height: "100vh" }}>
      <AccessibleNav links={navLinks} />
      <article className="sr-only">{children}</article>
      <WipCanvas pageKey={pageKey} onCreateLayout={onCreateLayout} />
    </div>
  );
}
