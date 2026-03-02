import { type Editor } from "tldraw";
import { sounds } from "./sounds";

/**
 * Attaches canvas-specific sound effects to the editor.
 * - Draw / erase: plays on pointer down and while dragging.
 *   Uses document-level listeners because tldraw's draw tool calls
 *   setPointerCapture(), which redirects pointermove away from .tl-canvas.
 * - Typewriter: plays on each printable keypress while a text shape is open.
 *
 * Returns a cleanup function to remove all listeners.
 */
export function attachCanvasSounds(editor: Editor): () => void {
  let isPointerDown = false;

  const onPointerDown = (e: PointerEvent) => {
    const container = document.querySelector(".tl-container");
    if (!container?.contains(e.target as Node)) return;
    isPointerDown = true;
    const tool = editor.getCurrentToolId();
    if (tool === "draw") sounds.play("draw");
    if (tool === "eraser") sounds.play("erase");
  };

  const onPointerMove = () => {
    if (!isPointerDown) return;
    const tool = editor.getCurrentToolId();
    if (tool === "draw") sounds.play("draw");
    if (tool === "eraser") sounds.play("erase");
  };

  const onPointerUp = () => { isPointerDown = false; };

  const onKeyDown = (e: KeyboardEvent) => {
    if (editor.getEditingShapeId() && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      sounds.play("type");
    }
  };

  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp);
  document.addEventListener("keydown", onKeyDown);

  return () => {
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("keydown", onKeyDown);
  };
}
