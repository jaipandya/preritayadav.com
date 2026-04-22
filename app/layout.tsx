import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";

const siteUrl = "https://preritayadav.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prerita Yadav — Product Designer",
    template: "%s | Prerita Yadav",
  },
  description:
    "Portfolio of Prerita Yadav — a product designer crafting intuitive, human-centered experiences. Explore selected work, case studies, and design thinking.",
  // TODO: Remove robots noindex before launch
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Prerita Yadav — Product Designer",
    description:
      "Portfolio of Prerita Yadav — a product designer crafting intuitive, human-centered experiences.",
    url: siteUrl,
    siteName: "Prerita Yadav",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prerita Yadav — Product Designer",
    description:
      "Portfolio of Prerita Yadav — a product designer crafting intuitive, human-centered experiences.",
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
    <html lang="en">
      <head>
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
