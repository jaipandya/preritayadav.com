"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import "@quickdrawjs/core/quickdraw.css";
import type { Store } from "@quickdrawjs/core";
import {
  Editor,
  EditorContext,
  useEditorValue,
  type AnyShape,
  type LoadedCanvas,
  type ShapeUtilConstructor,
} from "@/lib/canvas";

/**
 * The canvas, in layers (back to front):
 *   1. custom HTML shapes (cards, buttons, annotations), drawn by their ShapeUtil components
 *   2. the Quickdraw engine: a transparent canvas with pen strokes and typed text, the selection frame, and all input
 *   3. the custom shape being edited (so its text field can be clicked), and the hover outline
 * Layers 1 and 3 follow the camera with a CSS transform and let pointer events through to the engine.
 */
export function QuickdrawCanvas({
  store,
  shapeUtils,
  initial,
  onMount,
  children,
}: {
  store: Store;
  shapeUtils: readonly ShapeUtilConstructor[];
  initial?: Pick<LoadedCanvas, "pageMeta" | "camera"> | null;
  onMount?: (editor: Editor) => void | (() => void);
  /** UI in front of the canvas, with access to the editor through `useEditor`. */
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const mountRef = useRef(onMount);
  const initialRef = useRef(initial);
  const utilsRef = useRef(shapeUtils);
  /** Camera and page meta of the previous editor, when the canvas remounts (React StrictMode in development). */
  const carryRef = useRef<Pick<LoadedCanvas, "pageMeta" | "camera"> | null>(null);

  useEffect(() => {
    mountRef.current = onMount;
  }, [onMount]);

  useEffect(() => {
    const container = containerRef.current;
    const engineContainer = engineRef.current;
    if (!container || !engineContainer) return;
    const instance = new Editor({
      container,
      engineContainer,
      store,
      shapeUtils: utilsRef.current,
      initial: carryRef.current ?? initialRef.current,
    });
    setEditor(instance);
    const cleanup = mountRef.current?.(instance);
    instance.focus();
    return () => {
      if (typeof cleanup === "function") cleanup();
      carryRef.current = { camera: instance.getCamera(), pageMeta: instance.getPageMeta() };
      instance.destroy();
      setEditor(null);
    };
  }, [store]);

  return (
    <div ref={containerRef} className="cv-container" data-tool="browse">
      <EditorContext.Provider value={editor}>
        <div className="cv-layer">{editor && <ShapeLayer editor={editor} front={false} />}</div>
        <div ref={engineRef} className="cv-engine" />
        <div className="cv-layer cv-layer--front">{editor && <ShapeLayer editor={editor} front />}</div>
        {editor && children}
      </EditorContext.Provider>
    </div>
  );
}

/** Follows the camera: page coordinates inside, screen coordinates outside. */
function useCameraTransform(editor: Editor) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const apply = () => {
      const { x, y, z } = editor.getCamera();
      if (ref.current) ref.current.style.transform = `scale(${z}) translate(${x}px, ${y}px)`;
    };
    apply();
    return editor.on("camera", apply);
  }, [editor]);
  return ref;
}

function ShapeLayer({ editor, front }: { editor: Editor; front: boolean }) {
  const ref = useCameraTransform(editor);
  useEditorValue((e) => e.getVersion());
  const editingId = editor.getEditingShapeId();
  const shapes = editor.getCurrentPageShapes().filter((s) => editor.isCustomShape(s));
  const hovered = front ? editor.getHoveredShapeId() : null;
  const hoveredShape = hovered && !editor.getSelectedShapeIds().includes(hovered) ? editor.getShape(hovered) : undefined;

  return (
    <div ref={ref} className="cv-camera">
      {shapes
        .filter((s) => (s.id === editingId) === front)
        .map((shape) => (
          <ShapeView
            key={shape.id}
            editor={editor}
            shape={shape}
            editing={shape.id === editingId}
            ghost={editor.isErasing(shape.id)}
          />
        ))}
      {hoveredShape && <Indicator editor={editor} shape={hoveredShape} />}
    </div>
  );
}

function shapeTransform(shape: AnyShape) {
  return `translate(${shape.x}px, ${shape.y}px)${shape.rot ? ` rotate(${shape.rot}rad)` : ""}`;
}

/** One custom shape. Shape records are immutable, so a shape only re-renders when it changed. */
const ShapeView = memo(function ShapeView({
  editor,
  shape,
  editing,
  ghost,
}: {
  editor: Editor;
  shape: AnyShape;
  editing: boolean;
  ghost: boolean;
}) {
  const util = editor.getShapeUtil(shape.type);
  if (!util) return null;
  const { w, h } = util.getGeometry(shape).bounds;
  return (
    <div
      className="cv-shape"
      data-shape-id={shape.id}
      data-shape-type={shape.type}
      data-editing={editing ? "" : undefined}
      style={{
        width: w,
        height: h,
        transform: shapeTransform(shape),
        opacity: ghost ? 0.3 : undefined,
        pointerEvents: editing ? "auto" : "none",
      }}
    >
      {util.component(shape)}
    </div>
  );
});

/** Outline of the custom shape under the pointer in the select tool. */
function Indicator({ editor, shape }: { editor: Editor; shape: AnyShape }) {
  const util = editor.getShapeUtil(shape.type);
  if (!util) return null;
  const { w, h } = util.getGeometry(shape).bounds;
  return (
    <svg className="cv-indicator" width={w} height={h} style={{ transform: shapeTransform(shape) }} aria-hidden>
      {util.indicator(shape)}
    </svg>
  );
}
