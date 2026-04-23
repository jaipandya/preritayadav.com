import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, StackedPapersDoodle } from "@/lib/ogTemplate";

export const runtime = "edge";
export const alt = "Work by Prerita Yadav — Product Designer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate
        seed="og-work"
        eyebrow="Selected Work"
        title="Product Design Case Studies"
        subtitle="UX research, interface design, and design systems for Fitpass, Ema, Abhiloans, Epic, and more."
        url="preritayadav.com/work"
        doodle={<StackedPapersDoodle seed="og-work-doodle" />}
      />
    ),
    { ...size }
  );
}
