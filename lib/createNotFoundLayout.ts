import type { Editor } from "tldraw";

const CANVAS_W = 560;
const LEFT_PAD = 20;

export function createNotFoundLayout(editor: Editor) {
  let y = 80;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 70,
      text: "404",
      fontSize: 48,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "not-found-title" },
  });

  y += 80;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 30,
      text: "This page wandered off...",
      fontSize: 18,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "not-found-subtitle" },
  });

  y += 40;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 24,
      text: "Feel free to doodle here while you wait",
      fontSize: 13,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "not-found-hint" },
  });

  y += 50;

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 140, h: 36, label: "Take me home" },
    meta: {
      componentType: "button",
      variationId: "not-found-cta",
      href: "/",
    },
  });

  const vb = editor.getViewportScreenBounds();
  editor.setCamera({ x: -(CANVAS_W / 2) + vb.width / 2, y: 0, z: 1 });
}
