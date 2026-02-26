import type { Editor } from "tldraw";

export const CANVAS_W = 560;
export const LEFT_PAD = 20;

export function centerCamera(editor: Editor) {
  const vb = editor.getViewportScreenBounds();
  editor.setCamera({ x: -(CANVAS_W / 2) + vb.width / 2, y: 0, z: 1 });
}

export function createBackButton(
  editor: Editor,
  x: number,
  y: number,
  variationId: string,
  opts?: { w?: number; h?: number; label?: string; href?: string }
) {
  editor.createShape({
    type: "hand-drawn-button",
    x,
    y,
    props: {
      w: opts?.w ?? 120,
      h: opts?.h ?? 32,
      label: opts?.label ?? "← Back home",
    },
    meta: {
      componentType: "button",
      variationId,
      href: opts?.href ?? "/",
    },
  });
}
