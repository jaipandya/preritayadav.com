import type { Metadata } from "next";
import type { Viewport } from "next";
import { ContentGateHead } from "@/components/content/ContentGateHead";
import "./globals.css";

const siteUrl = "https://preritayadav.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prerita Yadav, Product Designer",
    template: "%s | Prerita Yadav",
  },
  description:
    "Portfolio of Prerita Yadav, a product designer crafting intuitive, human-centered experiences. Explore selected work, case studies, and design thinking.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Google Search Console HTML-tag verification. Not needed if the domain is verified through DNS.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  openGraph: {
    title: "Prerita Yadav, Product Designer",
    description:
      "Portfolio of Prerita Yadav, a product designer crafting intuitive, human-centered experiences.",
    url: siteUrl,
    siteName: "Prerita Yadav",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prerita Yadav, Product Designer",
    description:
      "Portfolio of Prerita Yadav, a product designer crafting intuitive, human-centered experiences.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Prerita Yadav",
  url: siteUrl,
  jobTitle: "Product Designer",
  description:
    "Product designer crafting intuitive, human-centered experiences for startups and enterprises.",
  sameAs: [
    "https://www.linkedin.com/in/preritayadav/",
    "https://medium.com/@preritayadav",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ContentGateHead />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
