import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import { SoundPreloader } from "@/components/SoundPreloader";

export const metadata: Metadata = {
  title: "Prerita Yadav — Portfolio",
  description:
    "Work-in-progress portfolio of Prerita Yadav. An unconventional canvas-based experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SoundPreloader />
        {children}
      </body>
    </html>
  );
}
