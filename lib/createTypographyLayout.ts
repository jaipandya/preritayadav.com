import type { Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera, createBackButton } from "./layoutHelpers";

export function createTypographyLayout(editor: Editor) {
  let y = 30;

  createBackButton(editor, LEFT_PAD, y, "back-home", { w: 130, h: 34 });

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

    // Calculate height roughly based on text wrapping
    // 43 chars, roughly 0.5 aspect ratio, canvas width is 520
    const approxLines = Math.max(1, Math.ceil((43 * size * 0.5) / (CANVAS_W - LEFT_PAD * 2)));
    const shapeHeight = approxLines * size * 1.5;

    // Sample text at this size
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: shapeHeight + 16,
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

    // Advance y by the actual height of the shape plus a proportional gap
    // Very large fonts get a bigger gap so they don't overlap, smaller font sizes less gap
    const gap = size > 40 ? 90 : size > 30 ? 40 : 25;
    y += shapeHeight + gap;
  }

  centerCamera(editor);
}
