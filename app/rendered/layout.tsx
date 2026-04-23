import type { Metadata } from "next";
import { RenderedNav } from "@/components/rendered/RenderedNav";
import { RenderedFooter } from "@/components/rendered/RenderedFooter";
import { SketchToggle } from "@/components/rendered/SketchToggle";
import "./rendered.css";

export const metadata: Metadata = {
  title: {
    default: "Prerita Yadav — Product Designer",
    template: "%s | Prerita Yadav",
  },
  alternates: {
    canonical: "https://preritayadav.com",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RenderedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rendered-root">
      <div className="r-grain" aria-hidden="true" />
      <RenderedNav />
      <main>{children}</main>
      <RenderedFooter />
      <SketchToggle />
    </div>
  );
}
