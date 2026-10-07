"""
Turns the flat About illustration into a watercolor, in the same style as the outside work thumbnails
(scripts/generate-watercolors.py): soft glazes with wobbling edges, pigment that pools darker at the edge of a wash,
paper grain, and a painting that fades into white paper so it sits on the page without a box.

    python3 scripts/watercolor-portrait.py

Needs opencv-python-headless and numpy. Reads scripts/source/about-portrait-original.webp (the untouched
illustration) and writes public/rendered/generated/about-portrait-watercolor.webp. Deterministic (fixed seed).
"""

from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "source" / "about-portrait-original.webp"
OUT = ROOT / "public" / "rendered" / "generated" / "about-portrait-watercolor.webp"
W, H = 1000, 750


def noise(rng, cell: int, shape) -> np.ndarray:
    """Smooth random field in 0..1 with features about `cell` pixels wide."""
    h, w = shape
    small = rng.random((h // cell + 3, w // cell + 3)).astype(np.float32)
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC).clip(0, 1)


def main():
    rng = np.random.default_rng(5)
    src = cv2.imread(str(SRC), cv2.IMREAD_COLOR)
    src = cv2.resize(src, (W, H), interpolation=cv2.INTER_AREA)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    # 1. Flatten into washes: smooth the colour regions, keep the shapes.
    wash = cv2.pyrMeanShiftFiltering(src, 10, 26)
    wash = cv2.bilateralFilter(wash, 9, 40, 9)

    # 2. The shapes wobble like a brush that did not quite follow the pencil.
    dx = (noise(rng, 60, (H, W)) - 0.5) * 9 + (noise(rng, 14, (H, W)) - 0.5) * 3.5
    dy = (noise(rng, 60, (H, W)) - 0.5) * 9 + (noise(rng, 14, (H, W)) - 0.5) * 3.5
    wash = cv2.remap(wash, xx + dx, yy + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    src_w = cv2.remap(src, xx + dx, yy + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

    img = wash.astype(np.float32) / 255
    # Lift towards paper: watercolor is never as dense as flat vector fills.
    paper = np.array([0.985, 0.985, 0.985], np.float32)
    ink_amount = 1 - img  # how much pigment per channel
    lum = cv2.cvtColor((img * 255).astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32) / 255

    # 3. Pigment pools unevenly: slow blotches plus fine granulation.
    pigment = 0.78 + 0.42 * noise(rng, 110, (H, W)) + 0.12 * (noise(rng, 7, (H, W)) - 0.5)
    ink_amount *= pigment[..., None] * 0.92

    # 4. Wet edge: pigment dries darker where one wash meets another.
    gray = cv2.cvtColor(wash, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    edges = np.abs(cv2.GaussianBlur(gray, (0, 0), 1.2) - cv2.GaussianBlur(gray, (0, 0), 5.5))
    edges = np.clip(edges * 6.0, 0, 1)
    ink_amount *= (1 + 0.55 * edges)[..., None]

    out = np.clip(paper[None, None, :] * (1 - ink_amount * 0.95), 0, 1)

    # 5. Graphite line: the dark outlines of the original, thinned and softened so they read as pencil.
    src_gray = cv2.cvtColor(src_w, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    line = np.clip((0.42 - src_gray) / 0.42, 0, 1)  # only the darkest strokes
    line = cv2.GaussianBlur(line, (0, 0), 0.8) * (0.55 + 0.35 * noise(rng, 5, (H, W)))
    graphite = np.array([0.30, 0.27, 0.25], np.float32)  # BGR, warm grey
    out = out * (1 - line[..., None] * (1 - graphite[None, None, :]) * 0.85)

    # 6. Paper grain, then fade the painting into white paper with an organic edge.
    grain = 0.965 + 0.05 * noise(rng, 3, (H, W)) + 0.02 * noise(rng, 24, (H, W))
    out = out * grain[..., None]

    # A rounded square rather than an ellipse, so the corners of the desk scene survive.
    d = (np.abs(xx / W - 0.5) ** 4 + np.abs((yy / H - 0.5) * 1.1) ** 4) ** 0.25
    d = d + (noise(rng, 90, (H, W)) - 0.5) * 0.12 + (noise(rng, 22, (H, W)) - 0.5) * 0.03
    keep = np.clip((0.505 - d) / 0.07, 0, 1)
    keep = cv2.GaussianBlur(keep, (0, 0), 7)
    out = 1 - (1 - out) * keep[..., None]

    result = np.clip(out * 255, 0, 255).astype(np.uint8)
    cv2.imwrite(str(OUT), result, [cv2.IMWRITE_WEBP_QUALITY, 82])
    print(f"{OUT.relative_to(ROOT)}  {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
