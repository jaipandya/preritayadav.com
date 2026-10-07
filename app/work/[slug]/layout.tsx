import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, SITE_URL, SITE_NAME, workImageUrls } from "@/lib/seo";
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

  return pageMetadata({
    title: `${item.title}, ${item.company}`,
    description: item.tagline,
    path: `/work/${item.slug}`,
  });
}

// Only the slugs from generateStaticParams exist. Anything else is a real 404, not a 200 "Project Not Found" page.
export const dynamicParams = false;

export async function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export default async function WorkDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getWorkBySlug(slug);
  if (!item) return children;

  const url = `${SITE_URL}/work/${item.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: `${item.title}, ${item.company}`,
        description: item.tagline,
        url,
        image: [`${url}/opengraph-image`, ...workImageUrls(item)],
        creator: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
        about: item.company,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
          { "@type": "ListItem", position: 3, name: item.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
