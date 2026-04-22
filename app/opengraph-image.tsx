import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Prerita Yadav — Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 100px",
          backgroundColor: "#ffffff",
          border: "3px solid #1a1a1a",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Prerita Yadav
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#1a1a1a",
            opacity: 0.6,
            lineHeight: 1.4,
          }}
        >
          Product Designer & Creative Thinker
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#1a1a1a",
            opacity: 0.4,
            marginTop: 40,
          }}
        >
          preritayadav.com
        </div>
      </div>
    ),
    { ...size }
  );
}
