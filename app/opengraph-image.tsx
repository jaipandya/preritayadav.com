import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, SpeechBubbleDoodle } from "@/lib/ogTemplate";

export const runtime = "edge";
export const alt = "Prerita Yadav — Product Designer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate
        seed="og-landing"
        eyebrow="Portfolio"
        title="Prerita Yadav"
        subtitle="Product Designer & Creative Thinker — UX research, interface design, design systems."
        url="preritayadav.com"
        doodle={<SpeechBubbleDoodle seed="og-landing-doodle" />}
      />
    ),
    { ...size }
  );
}
