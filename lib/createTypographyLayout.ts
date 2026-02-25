import type { Editor } from "tldraw";

const CANVAS_W = 560;
const LEFT_PAD = 20;

export function createTypographyLayout(editor: Editor) {
  let y = 30;

  // --- Back button ---
  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 130, h: 34, label: "← Back home" },
    meta: {
      componentType: "button",
      variationId: "back-home",
      href: "/",
    },
  });

  y += 60;

  // --- Title ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 50,
      text: "Typography",
      fontSize: 34,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "page-title" },
  });

  y += 55;

  // --- Subtitle ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 500,
      h: 24,
      text: "Loranthus typeface at every size used across the site",
      fontSize: 15,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "page-subtitle" },
  });

  y += 60;

  // --- Type scale ---
  const sizes = [48, 38, 34, 22, 20, 18, 16, 15, 14, 13, 12];

  for (const size of sizes) {
    // Size label
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y,
      props: {
        w: 60,
        h: 18,
        text: `${size}px`,
        fontSize: 12,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: {
        componentType: "annotation",
        variationId: `size-label-${size}`,
      },
    });

    y += 22;

    // Sample text at this size
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: size + 16,
        text: "The quick brown fox jumps over the lazy dog",
        fontSize: size,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: {
        componentType: "annotation",
        variationId: `sample-${size}`,
      },
    });

    y += size + 30;
  }

  // Position camera
  const vb = editor.getViewportScreenBounds();
  editor.setCamera({ x: -(CANVAS_W / 2) + vb.width / 2, y: 0, z: 1 });
}
