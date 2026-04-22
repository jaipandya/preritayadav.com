"use client";

import { PageShell } from "@/components/PageShell";
import { createNotFoundLayout } from "@/lib/createNotFoundLayout";

const navLinks = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }];

export default function NotFound() {
  return (
    <PageShell navLinks={navLinks} pageKey="not-found" onCreateLayout={createNotFoundLayout}>
      <h1>Page not found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <a href="/">Go back home</a>
    </PageShell>
  );
}
