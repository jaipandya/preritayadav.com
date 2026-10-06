/** Canvas images go through the Next.js optimizer at their on-screen size. Run with `bun test`. */
import { describe, expect, test } from "bun:test";
import { optimizedImageUrl } from "../lib/canvasAssets";

const src = "/work/epic-explore/before-after.webp";

function widthOf(url: string) {
  return Number(new URL(url, "http://x").searchParams.get("w"));
}

describe("optimizedImageUrl", () => {
  test("points at the optimizer with the file, a width and the default quality", () => {
    const url = optimizedImageUrl(src, 2400, 0.25, 1);
    expect(url.startsWith("/_next/image?url=%2Fwork%2Fepic-explore%2Fbefore-after.webp")).toBe(true);
    expect(url).toContain("q=75");
  });

  test("asks for the on-screen size, rounded up to an allowed width", () => {
    // 2400px original shown at 0.22 => ~528 css px => 640 allowed width
    expect(widthOf(optimizedImageUrl(src, 2400, 0.22, 1))).toBe(640);
    // retina doubles the pixels needed
    expect(widthOf(optimizedImageUrl(src, 2400, 0.22, 2))).toBe(1080);
  });

  test("never asks for more than the original has, or more than the largest allowed width", () => {
    expect(widthOf(optimizedImageUrl(src, 700, 4, 2))).toBeLessThanOrEqual(750);
    expect(widthOf(optimizedImageUrl(src, 8000, 1, 2))).toBe(3840);
  });

  test("leaves data URLs and remote images alone", () => {
    expect(optimizedImageUrl("data:image/png;base64,AAAA", 100, 1)).toBe("data:image/png;base64,AAAA");
    expect(optimizedImageUrl("https://example.com/a.png", 100, 1)).toBe("https://example.com/a.png");
    expect(optimizedImageUrl("//cdn.example.com/a.png", 100, 1)).toBe("//cdn.example.com/a.png");
  });
});
