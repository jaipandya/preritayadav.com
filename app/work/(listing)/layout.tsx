import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { getMainWork } from "@/lib/workData";

// Only the /work listing, not the case studies under /work/<slug>, which have their own structured data.
export default function WorkListingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Selected work by Prerita Yadav",
          itemListElement: getMainWork().map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/work/${item.slug}`,
            name: `${item.title}, ${item.company}`,
          })),
        }}
      />
      {children}
    </>
  );
}
