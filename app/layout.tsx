import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prerita Yadav — Portfolio",
  description:
    "Work-in-progress portfolio of Prerita Yadav. An unconventional canvas-based experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
