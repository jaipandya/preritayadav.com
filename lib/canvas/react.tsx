"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ComponentType,
  type HTMLAttributes,
} from "react";
import type { Editor } from "./editor";
import type { ShapeId } from "./types";

export const EditorContext = createContext<Editor | null>(null);

/** The canvas editor. Only inside the canvas (shape components and the UI rendered in front of it). */
export function useEditor(): Editor {
  const editor = useContext(EditorContext);
  if (!editor) throw new Error("useEditor must be used inside the canvas");
  return editor;
}

/**
 * A value read from the editor, kept up to date. Re-renders only when the value changes, so the selector must
 * return a primitive (or a stable reference). `camera: true` also re-reads when the view moves.
 */
export function useEditorValue<T>(selector: (editor: Editor) => T, opts: { camera?: boolean } = {}): T {
  const editor = useEditor();
  const { camera = false } = opts;
  const subscribe = useCallback(
    (onChange: () => void) => {
      const offs = [editor.on("change", onChange)];
      if (camera) offs.push(editor.on("camera", onChange));
      return () => offs.forEach((off) => off());
    },
    [editor, camera]
  );
  const read = () => selector(editor);
  return useSyncExternalStore(subscribe, read, read);
}

/** Whether the shape's text is being edited. */
export function useIsEditing(id: ShapeId): boolean {
  return useEditorValue((editor) => editor.getEditingShapeId() === id);
}

/** Re-render a component on every editor change (tool, selection, shapes, history). */
export function track<P extends object>(Component: ComponentType<P>) {
  function Tracked(props: P) {
    useEditorValue((editor) => editor.getVersion());
    return <Component {...props} />;
  }
  Tracked.displayName = `track(${Component.displayName ?? Component.name ?? "Component"})`;
  return Tracked;
}

/** The root element of a custom shape's component. */
export const HTMLContainer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function HTMLContainer(
  { className, ...rest },
  ref
) {
  return <div ref={ref} className={className ? `cv-html-container ${className}` : "cv-html-container"} {...rest} />;
});
