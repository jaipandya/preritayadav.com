import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, FaceDoodle } from "@/lib/ogTemplate";

export const runtime = "edge";
export const alt = "About Prerita Yadav — Product Designer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate
        seed="og-about"
        eyebrow="About"
        title="Hi, I'm Prerita."
        subtitle="Product Designer with a decade in finance, 26 countries explored, and a passion for human-centered design."
        url="preritayadav.com/about"
        doodle={<FaceDoodle seed="og-about-doodle" />}
      />
    ),
    { ...size }
  );
}
