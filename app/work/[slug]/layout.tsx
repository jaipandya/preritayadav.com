import type { Metadata } from "next";
import { getWorkBySlug, workItems } from "@/lib/workData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkBySlug(slug);

  if (!item) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${item.title} — ${item.company}`,
    description: item.tagline,
    openGraph: {
      title: `${item.title} — ${item.company} | Prerita Yadav`,
      description: item.tagline,
    },
  };
}

export async function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export default function WorkDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
