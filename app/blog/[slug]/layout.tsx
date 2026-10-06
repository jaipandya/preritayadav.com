import type { Metadata } from "next";

// Placeholder pages: the blog posts live on Medium and are linked from the landing page.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
