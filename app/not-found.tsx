"use client";

import { PageShell } from "@/components/PageShell";
import { createNotFoundLayout } from "@/lib/createNotFoundLayout";
import Link from "next/link";

const navLinks = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }];

export default function NotFound() {
  return (
    <PageShell navLinks={navLinks} pageKey="not-found" onCreateLayout={createNotFoundLayout}>
      <h1>Page not found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/">Go back home</Link>
    </PageShell>
  );
}
