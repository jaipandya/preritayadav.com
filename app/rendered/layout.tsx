import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ContentGate } from "@/components/content/ContentGate";
import { FloatingBar } from "@/components/rendered/FloatingBar";
import { skipToContentLabel } from "@/lib/renderedChrome";
import "./rendered.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-r-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-r-mono", display: "swap", weight: "400" });

export const metadata: Metadata = {
  title: {
    default: "Prerita Yadav, Product Designer",
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
    <div className={`rendered-root ${sans.variable} ${mono.variable}`}>
      <a href="#main" className="r-skip">
        {skipToContentLabel}
      </a>
      {/* Before the content in the DOM, so keyboard and screen reader order matches the visual order on desktop. */}
      <FloatingBar />
      <ContentGate>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </ContentGate>
    </div>
  );
}
