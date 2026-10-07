import type { Metadata } from "next";

// The home page is a client component, so its metadata lives here. Title, description and Open Graph come from the
// root layout. This only adds the canonical (the root layout cannot, or every page without its own would inherit "/").
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
