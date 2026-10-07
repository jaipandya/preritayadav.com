import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PERSON_IMAGE, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Prerita Yadav is a product designer and creative thinker who crafts intuitive, human-centered experiences for startups and enterprises.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = `${SITE_URL}/about`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${url}#profile`,
          url,
          name: `About ${SITE_NAME}`,
          mainEntity: {
            "@type": "Person",
            name: SITE_NAME,
            url: SITE_URL,
            image: PERSON_IMAGE,
            jobTitle: "Product Designer",
          },
        }}
      />
      {children}
    </>
  );
}
