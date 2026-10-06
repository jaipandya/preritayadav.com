import type { Metadata } from "next";

// Internal design reference pages (typography, UI components). Not for search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function MetaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
