/**
 * Canvas images are served through the Next.js image optimizer instead of the original files.
 * The case study screenshots are 0.4 to 1.6 MB each; at the size they show on the canvas the
 * optimized variants are about 20x smaller. No React or canvas runtime here, so it is easy to test.
 */

/** Widths the Next.js optimizer accepts by default (`deviceSizes` then `imageSizes`). Keep in sync with next.config.ts if it is ever customized. */
const ALLOWED_WIDTHS = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const QUALITY = 75;

/** Only our own files in /public are optimized. Data URLs and remote images are used as they are. */
function isLocalImage(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

/** Smallest allowed width that covers `needed`, or the largest one. */
function pickWidth(needed: number) {
  return ALLOWED_WIDTHS.find((w) => w >= needed) ?? ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1];
}

/**
 * URL for an image at the size it is shown.
 * @param nativeWidth width of the original file in px
 * @param screenScale on-screen size relative to the original (CSS px), see `steppedScreenScale`
 * @param dpr device pixel ratio
 */
export function optimizedImageUrl(src: string, nativeWidth: number, screenScale: number, dpr = 1) {
  if (!isLocalImage(src)) return src;
  const needed = Math.ceil(nativeWidth * screenScale * dpr);
  // Never ask for more pixels than the original has.
  const width = pickWidth(Math.min(needed, nativeWidth));
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${QUALITY}`;
}

/**
 * On-screen scale of an image rounded up to a power of two (at least 1/8), so zooming only asks for a new
 * size when the image doubles or halves on screen, not on every zoom step.
 */
export function steppedScreenScale(screenScale: number) {
  if (!(screenScale > 0)) return 1 / 8;
  return Math.max(1 / 8, 2 ** Math.ceil(Math.log2(screenScale)));
}
