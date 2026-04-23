import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, EnvelopeDoodle } from "@/lib/ogTemplate";

export const runtime = "edge";
export const alt = "Contact Prerita Yadav — Product Designer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate
        seed="og-contact"
        eyebrow="Contact"
        title="Get in touch"
        subtitle="hello@preritayadav.com"
        url="preritayadav.com/contact"
        doodle={<EnvelopeDoodle seed="og-contact-doodle" />}
      />
    ),
    { ...size }
  );
}
