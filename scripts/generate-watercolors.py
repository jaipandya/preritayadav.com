"""
Generates the watercolor thumbnails for the outside work items on the rendered site.

    python3 scripts/generate-watercolors.py

Needs opencv-python-headless and numpy (pip3 install opencv-python-headless numpy).
Writes public/rendered/generated/outside-<scene>.webp (one per item in lib/landingContent.ts).

Each scene is a list of flat shapes. Every shape is painted as a transparent glaze (like real watercolor):
the edge wobbles, pigment pools darker near the edge and unevenly inside, and where two shapes overlap
the colours multiply. The whole painting fades out into white paper so it sits on the white page without a box.
The result is deterministic (fixed seeds), so re-running only changes the files if this script changes.
"""

from pathlib import Path

import cv2
import numpy as np

S = 800  # working size; the output is scaled down
OUT = 384
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "rendered" / "generated"


def rgb(hex_color: str) -> np.ndarray:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))
    return np.array([b, g, r], dtype=np.float32)  # OpenCV is BGR


def noise(rng, cell: int, size: int = S) -> np.ndarray:
    """Smooth random field in 0..1 with features about `cell` pixels wide."""
    n = size // cell + 3
    small = rng.random((n, n)).astype(np.float32)
    return cv2.resize(small, (size, size), interpolation=cv2.INTER_CUBIC)[:size, :size].clip(0, 1)


class Painting:
    def __init__(self, seed: int):
        self.rng = np.random.default_rng(seed)
        self.canvas = np.ones((S, S, 3), dtype=np.float32)
        yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
        self.xx, self.yy = xx, yy

    # ---- shape masks (antialiased, 0..1) ----
    def mask(self, draw) -> np.ndarray:
        m = np.zeros((S, S), dtype=np.uint8)
        draw(m)
        return m.astype(np.float32) / 255

    def poly(self, pts):
        return self.mask(lambda m: cv2.fillPoly(m, [np.array(pts, np.int32)], 255, cv2.LINE_AA))

    def circle(self, c, r):
        return self.mask(lambda m: cv2.circle(m, c, r, 255, -1, cv2.LINE_AA))

    def ellipse(self, c, axes, angle=0):
        return self.mask(lambda m: cv2.ellipse(m, c, axes, angle, 0, 360, 255, -1, cv2.LINE_AA))

    def rrect(self, x0, y0, x1, y1, r):
        def draw(m):
            cv2.rectangle(m, (x0 + r, y0), (x1 - r, y1), 255, -1, cv2.LINE_AA)
            cv2.rectangle(m, (x0, y0 + r), (x1, y1 - r), 255, -1, cv2.LINE_AA)
            for cx, cy in ((x0 + r, y0 + r), (x1 - r, y0 + r), (x0 + r, y1 - r), (x1 - r, y1 - r)):
                cv2.circle(m, (cx, cy), r, 255, -1, cv2.LINE_AA)

        return self.mask(draw)

    def stroke(self, pts, width=3, closed=False):
        return self.mask(lambda m: cv2.polylines(m, [np.array(pts, np.int32)], closed, 255, width, cv2.LINE_AA))

    def arc(self, c, axes, a0, a1, width=3, angle=0):
        return self.mask(lambda m: cv2.ellipse(m, c, axes, angle, a0, a1, 255, width, cv2.LINE_AA))

    # ---- painting ----
    def paint(self, m: np.ndarray, color: str, strength=0.8, wobble=10.0, edge=0.55, blur=1.4):
        """Glaze one mask onto the canvas."""
        rng = self.rng
        dx = (noise(rng, 70) - 0.5) * wobble + (noise(rng, 18) - 0.5) * wobble * 0.4
        dy = (noise(rng, 70) - 0.5) * wobble + (noise(rng, 18) - 0.5) * wobble * 0.4
        m = cv2.remap(m, self.xx + dx, self.yy + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
        m = cv2.GaussianBlur(m, (0, 0), blur)

        # Pigment pools unevenly: a slow blotchy field plus fine granulation.
        pigment = 0.62 + 0.55 * noise(rng, 130) + 0.16 * (noise(rng, 9) - 0.5)
        # Wet edge: pigment dries darker at the border of a wash.
        inner = cv2.GaussianBlur(m, (0, 0), 9)
        rim = np.clip(m - inner, 0, 1) * 3.2
        alpha = np.clip(m * np.clip(strength * pigment + rim * edge, 0, 1), 0, 1)

        c = rgb(color)
        self.canvas *= 1 - alpha[..., None] * (1 - c)

    def pencil(self, m: np.ndarray, color="#4a4540", strength=0.75):
        """A thin graphite or ink line: little wobble, no pooling."""
        m = cv2.GaussianBlur(m, (0, 0), 0.9)
        self.canvas *= 1 - (m * strength)[..., None] * (1 - rgb(color))

    def finish(self, fade_center=(0.5, 0.5), fade_radius=0.46) -> np.ndarray:
        """Paper grain, then fade the painting into white paper with an uneven, organic edge."""
        rng = self.rng
        grain = 0.965 + 0.05 * noise(rng, 3) + 0.02 * noise(rng, 24)
        img = self.canvas * grain[..., None]

        d = np.hypot((self.xx / S - fade_center[0]), (self.yy / S - fade_center[1]))
        d = d + (noise(rng, 90) - 0.5) * 0.12 + (noise(rng, 22) - 0.5) * 0.03
        keep = np.clip((fade_radius - d) / 0.07, 0, 1)
        keep = cv2.GaussianBlur(keep, (0, 0), 6)
        img = 1 - (1 - img) * keep[..., None]
        return np.clip(img * 255, 0, 255).astype(np.uint8)


# --------------------------------------------------------------------------------------------
# Scenes. Coordinates are on an 800 by 800 canvas.
# --------------------------------------------------------------------------------------------


def travel() -> np.ndarray:
    p = Painting(seed=11)
    p.paint(p.ellipse((400, 400), (330, 300)), "#cfe3f1", 0.55, wobble=26)  # sky wash
    p.paint(p.circle((570, 235), 74), "#f6b94a", 0.85)  # sun
    p.paint(p.circle((570, 235), 104), "#fbe3a8", 0.35, wobble=22)  # warm halo
    p.paint(p.poly([(70, 540), (240, 300), (350, 430), (470, 250), (660, 540)]), "#8fa6c4", 0.8)  # far range
    p.paint(p.poly([(110, 640), (310, 410), (430, 540), (580, 390), (750, 640)]), "#4f9a8a", 0.82)  # near range
    p.paint(p.ellipse((400, 700), (400, 130)), "#8fb36a", 0.85)  # meadow
    p.paint(p.rrect(470, 590, 580, 672, 14), "#d9644a", 0.9)  # suitcase
    p.pencil(p.arc((525, 592), (30, 24), 180, 360, 3), "#6b3a2e", 0.8)  # handle
    p.pencil(p.stroke([(470, 628), (580, 628)], 2), "#6b3a2e", 0.6)
    # paper plane and its dotted trail
    p.paint(p.poly([(130, 190), (320, 130), (225, 250)]), "#e8715a", 0.88)
    p.paint(p.poly([(225, 250), (320, 130), (240, 292)]), "#c4513f", 0.88)
    for i in range(8):  # dotted trail curving up to the plane
        t = i / 7
        p.pencil(p.circle((int(80 + 50 * t), int(400 - 190 * t + 30 * np.sin(t * 6))), 4), "#6b6358", 0.7)
    p.pencil(p.stroke([(130, 190), (320, 130), (225, 250), (130, 190)], 2, True), "#4a4540", 0.55)
    return p.finish()


def mentoring() -> np.ndarray:
    p = Painting(seed=23)
    p.paint(p.ellipse((400, 430), (335, 300)), "#fbe4d3", 0.6, wobble=26)  # warm wash
    # idea above them
    p.paint(p.circle((400, 175), 62), "#f7c94b", 0.88)
    p.paint(p.rrect(372, 222, 428, 262, 10), "#9aa3ad", 0.8)
    for a in (-60, -30, 0, 30, 60):  # rays
        r = np.deg2rad(a - 90)
        p.pencil(p.stroke([(int(400 + 82 * np.cos(r)), int(175 + 82 * np.sin(r))),
                           (int(400 + 108 * np.cos(r)), int(175 + 108 * np.sin(r)))], 3), "#8a6a1e", 0.7)
    # table
    p.paint(p.rrect(110, 585, 690, 640, 14), "#b98f6a", 0.9)
    # mentor (left)
    p.paint(p.ellipse((255, 480), (98, 130)), "#4b5fa8", 0.85)  # sweater
    p.paint(p.circle((255, 335), 56), "#efc3a0", 0.9)  # head
    p.paint(p.ellipse((255, 306), (62, 44)), "#3b2f2f", 0.88)  # hair
    p.paint(p.circle((322, 560), 22), "#efc3a0", 0.9)  # hand on table
    # mentee (right)
    p.paint(p.ellipse((545, 490), (94, 125)), "#e07a5f", 0.85)
    p.paint(p.circle((545, 348), 53), "#d9a27c", 0.9)
    p.paint(p.ellipse((545, 322), (60, 42)), "#2f2a2a", 0.88)
    p.paint(p.circle((545, 262), 26), "#2f2a2a", 0.88)  # bun
    p.paint(p.circle((478, 560), 22), "#d9a27c", 0.9)
    # laptop between them
    p.paint(p.rrect(336, 478, 464, 556, 8), "#7d8fa3", 0.85)
    p.paint(p.rrect(322, 552, 478, 574, 8), "#5d6e80", 0.88)
    p.pencil(p.stroke([(352, 500), (440, 500)], 3), "#ffffff", 0.7)
    p.pencil(p.stroke([(352, 520), (420, 520)], 3), "#ffffff", 0.6)
    # faces
    for x in (240, 270, 530, 560):
        p.pencil(p.circle((x, 340 if x < 400 else 352), 3), "#3a3030", 0.85)
    p.pencil(p.arc((255, 358), (14, 8), 20, 160, 2), "#8a4a3a", 0.8)
    p.pencil(p.arc((545, 370), (13, 8), 20, 160, 2), "#8a4a3a", 0.8)
    return p.finish()


def tinkering() -> np.ndarray:
    p = Painting(seed=37)
    p.paint(p.ellipse((400, 420), (335, 305)), "#ece3f3", 0.6, wobble=26)  # lavender wash
    # yarn ball
    p.paint(p.circle((290, 440), 160), "#e8715a", 0.88)
    p.paint(p.circle((250, 395), 70), "#f4a08f", 0.45, wobble=20)  # highlight
    for i, (a0, a1, ax) in enumerate([(200, 340, (150, 60)), (170, 300, (140, 100)), (20, 160, (150, 70)), (40, 200, (110, 150))]):
        p.pencil(p.arc((290, 440), ax, a0, a1, 3, angle=-25 + i * 38), "#8a2f22", 0.7)
    # loose thread
    thread = [(300, 595), (360, 640), (450, 650), (540, 628), (610, 650), (680, 640)]
    p.pencil(p.stroke(thread, 4), "#c4513f", 0.9)
    # fingerless glove
    p.paint(p.rrect(500, 520, 650, 598, 12), "#3f8f8a", 0.85)  # ribbed cuff
    for x in range(516, 650, 20):
        p.pencil(p.stroke([(x, 528), (x, 590)], 2), "#1f4f4c", 0.55)
    p.paint(p.rrect(498, 380, 652, 530, 30), "#f0b94d", 0.88)  # palm
    for cx, cy, h in ((525, 372, 52), (566, 350, 62), (608, 358, 56)):
        p.paint(p.ellipse((cx, cy), (24, h)), "#f0b94d", 0.88)  # fingers (stubs)
        p.pencil(p.arc((cx, cy - h + 30), (24, 12), 190, 350, 2), "#8a6a1e", 0.6)
    p.paint(p.ellipse((672, 450), (24, 56), angle=-28), "#f0b94d", 0.88)  # thumb
    p.paint(p.rrect(498, 500, 652, 534, 8), "#f6d98a", 0.6)  # edge of the cuff fold
    # crochet hook
    p.paint(p.poly([(150, 700), (160, 688), (420, 596), (426, 610)]), "#5d6e80", 0.9)
    p.paint(p.circle((150, 694), 12), "#5d6e80", 0.9)
    p.pencil(p.arc((430, 598), (14, 14), 200, 360, 3), "#3a4654", 0.9)
    return p.finish()


SCENES = {"travel": travel, "mentoring": mentoring, "tinkering": tinkering}


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, fn in SCENES.items():
        img = cv2.resize(fn(), (OUT, OUT), interpolation=cv2.INTER_AREA)
        path = OUT_DIR / f"outside-{name}.webp"
        cv2.imwrite(str(path), img, [cv2.IMWRITE_WEBP_QUALITY, 82])
        print(f"{path.relative_to(OUT_DIR.parent.parent.parent)}  {path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
