import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Prerita Yadav is a product designer and creative thinker who crafts intuitive, human-centered experiences for startups and enterprises.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
