import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected product design projects by Prerita Yadav — case studies in UX research, interface design, and design systems for companies like Fitpass, Ema, Epic, and more.",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
