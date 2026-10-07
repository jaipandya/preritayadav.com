"use client";

import { useEffect, useState, type RefObject } from "react";
import type { CanvasPointerEvent, Editor, ShapeId } from "@/lib/canvas";

/**
 * Tracks hover and press states for a shape, but only in browse mode.
 * Returns { hovered, pressed } — both false when any tool other than browse is active.
 */
export function useShapeHover(
  editor: Editor,
  shapeId: ShapeId,
  enabled = true
): { hovered: boolean; pressed: boolean } {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: CanvasPointerEvent) => {
      if (editor.getCurrentToolId() !== "browse") {
        setHovered(false);
        setPressed(false);
        return;
      }

      if (event.name === "pointer_move") {
        const pagePoint = editor.screenToPage(event.point);
        const shapesAtPoint = editor.getShapesAtPoint(pagePoint, {
          hitInside: true,
          margin: 0,
        });
        const isOver = shapesAtPoint.some((s) => s.id === shapeId);
        setHovered(isOver);
        if (!isOver) setPressed(false);
      }

      if (event.name === "pointer_down") {
        const pagePoint = editor.screenToPage(event.point);
        const shapesAtPoint = editor.getShapesAtPoint(pagePoint, {
          hitInside: true,
          margin: 0,
        });
        if (shapesAtPoint.some((s) => s.id === shapeId)) {
          setPressed(true);
        }
      }

      if (event.name === "pointer_up") {
        setPressed(false);
      }
    };

    return editor.on("event", handleEvent);
  }, [editor, shapeId, enabled]);

  return { hovered, pressed };
}

/**
 * Auto-focuses and selects an input/textarea ref when editing begins.
 */
export function useFocusOnEdit(
  isEditing: boolean,
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
) {
  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [isEditing, ref]);
}
