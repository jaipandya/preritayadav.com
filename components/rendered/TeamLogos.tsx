import Image from "next/image";
import { teamsWorkedWith } from "@/lib/landingContent";

/**
 * Cropped, ready-to-use marks (public/logos/mark): taglines and the white lettering made for dark backgrounds are
 * removed, and every file has its intrinsic size here so nothing shifts while it loads.
 * - 10kdesigners: only the lilac "10K" of the wordmark (the rest is white for dark backgrounds).
 * - zkAGI: the dark mark; logos/zkagi.svg is all white and disappears on a light page.
 * - Byju's, EMA: the wordmark without the tagline. Fitpass: the wordmark without the emblem.
 */
const LOGOS: Record<string, { src: string; width: number; height: number }> = {
  toppr: { src: "/logos/toppr.svg", width: 49, height: 40 },
  byjus: { src: "/logos/mark/byjus.svg", width: 123, height: 33 },
  ema: { src: "/logos/mark/ema.svg", width: 117, height: 37 },
  "10kdesigners": { src: "/logos/mark/10k-mark.png", width: 84, height: 26 },
  abhiloans: { src: "/logos/square/abhiloans.png", width: 300, height: 300 },
  zkagi: { src: "/logos/square/zkagi.png", width: 4987, height: 4412 },
  fitpass: { src: "/logos/mark/fitpass-wordmark.svg", width: 207, height: 37 },
  epic: { src: "/logos/epic.svg", width: 155, height: 78 },
};

const BASE_HEIGHT = 22;
const MIN_HEIGHT = 12;

/**
 * Optical size: a wide wordmark and a square icon of the same height look very different in weight.
 * Height shrinks with the square root of the aspect ratio, so every logo takes up about the same area.
 */
function opticalSize({ width, height }: { width: number; height: number }) {
  const ratio = width / height;
  const h = Math.min(BASE_HEIGHT, Math.max(MIN_HEIGHT, BASE_HEIGHT * ratio ** -0.5));
  return { width: Math.round(h * ratio), height: Math.round(h) };
}

/** A quiet 4 by 2 grid of the companies Prerita has worked with. The company name is the alt text. */
export function TeamLogos() {
  return (
    <ul className="r-logos">
      {teamsWorkedWith.companies.map((key, i) => {
        const logo = LOGOS[key];
        if (!logo) return null;
        const size = opticalSize(logo);
        return (
          <li key={key}>
            <Image src={logo.src} alt={teamsWorkedWith.companyNames[i]} width={size.width} height={size.height} sizes={`${size.width}px`} />
          </li>
        );
      })}
    </ul>
  );
}
