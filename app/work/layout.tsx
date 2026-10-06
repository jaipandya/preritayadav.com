import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected product design projects by Prerita Yadav. Case studies in UX research, interface design, and design systems for companies like Fitpass, Ema, Epic, and more.",
  path: "/work",
});

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
