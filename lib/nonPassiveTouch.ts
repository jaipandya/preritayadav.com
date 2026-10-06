import type { Editor } from "tldraw";

/**
 * tldraw cancels touchstart/touchend inside React handlers. React registers those as passive listeners,
 * so every touch logs "Unable to preventDefault inside passive event listener invocation".
 * This does the same cancelling in native non-passive listeners (they run before React's root listener)
 * and marks the event as handled, so tldraw's own React handlers skip it. Same behaviour, no warning.
 * Returns a cleanup function.
 */
export function attachNonPassiveTouch(editor: Editor): () => void {
  const container = editor.getContainer();

  // Only the canvas itself, not the UI layer in front of it (tldraw handles that separately).
  const isOnCanvas = (e: TouchEvent) =>
    e.target instanceof Element &&
    !!e.target.closest(".tl-canvas") &&
    !e.target.closest(".tl-canvas__in-front");

  const onTouchStart = (e: TouchEvent) => {
    if (!isOnCanvas(e) || editor.wasEventAlreadyHandled(e)) return;
    editor.markEventAsHandled(e);
    if (e.cancelable) e.preventDefault();
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isOnCanvas(e) || editor.wasEventAlreadyHandled(e)) return;
    editor.markEventAsHandled(e);
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const editingShapeId = editor.getEditingShapeId();
    const insideEditingShape = !!editingShapeId && !!target.closest(`[data-shape-id="${editingShapeId}"]`);
    // Let taps on links, text fields and the shape being edited through, so they can focus and click.
    if (insideEditingShape || target.tagName === "A" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
    if (e.cancelable) e.preventDefault();
  };

  container.addEventListener("touchstart", onTouchStart, { passive: false });
  container.addEventListener("touchend", onTouchEnd, { passive: false });
  return () => {
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchend", onTouchEnd);
  };
}
