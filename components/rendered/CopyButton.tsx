"use client";

import { useEffect, useRef, useState } from "react";
import { copyEmailLabel, emailCopiedLabel } from "@/lib/renderedChrome";

const RESET_MS = 1800;

/**
 * Copies a value and says so: the clipboard icon turns into a check for a moment, and a screen reader hears
 * "copied" through a live region. Many visitors have no mail app set up, so the mailto link alone is not enough.
 * Nothing is shown as copied if the browser refuses the write.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  }

  return (
    <>
      <button type="button" className="r-copy" data-copied={copied} onClick={copy} aria-label={copyEmailLabel} title={copyEmailLabel}>
        <span className="r-copy-icons" aria-hidden="true">
          <svg className="r-copy-clip" width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
            <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
            <path d="M10.5 3.5v-.5a1.5 1.5 0 00-1.5-1.5H4A1.5 1.5 0 002.5 3v5A1.5 1.5 0 004 9.5h.5" />
          </svg>
          <svg className="r-copy-check" width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
      </button>
      <span className="sr-only" role="status">
        {copied ? emailCopiedLabel : ""}
      </span>
    </>
  );
}
