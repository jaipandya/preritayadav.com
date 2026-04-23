import { ImageResponse } from "next/og";
import { getWorkBySlug, workItems } from "@/lib/workData";
import { OgTemplate, OG_SIZE, PencilDoodle } from "@/lib/ogTemplate";

export const alt = "Prerita Yadav — Case Study";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    return new ImageResponse(
      (
        <OgTemplate
          seed="og-work-404"
          eyebrow="Case Study"
          title="Project not found"
          url="preritayadav.com/work"
        />
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <OgTemplate
        seed={`og-work-${slug}`}
        eyebrow={`${work.company} · ${work.role}`}
        title={work.title}
        subtitle={work.tagline}
        url={`preritayadav.com/work/${work.slug}`}
        doodle={<PencilDoodle seed={`og-work-${slug}-doodle`} />}
      />
    ),
    { ...size }
  );
}
