"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { useContentReady } from "@/lib/useContentOverrides";

/**
 * Keeps rendered pages from flashing default text before an override is applied.
 *
 * Only browsers that have overrides are affected: an inline script in <head> adds `content-pending` to <html>
 * when `prerita-content-overrides` exists. Everyone else paints immediately. `ContentGate` removes the class once
 * React has read the overrides, in the same render pass in which `useContent` returns them.
 * A spinner appears only if that takes longer than ~200ms. Without JavaScript the class is never added.
 *
 * Usage in the rendered layout (server component):
 *   <head><ContentGateHead /></head>   // from ./ContentGateHead
 *   <body><ContentGate>{children}</ContentGate></body>
 */
/** Wrap the rendered page content. Hidden (not removed) while pending, so crawlers still get the default HTML. */
export function ContentGate({ children }: { children: ReactNode }) {
  const ready = useContentReady();

  useLayoutEffect(() => {
    if (ready) document.documentElement.classList.remove("content-pending");
  }, [ready]);

  return <div data-content-gate>{children}</div>;
}
