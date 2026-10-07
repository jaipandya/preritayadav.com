import type { CustomShapePropsMap } from "@/lib/shapeTypes";

export type ShapeId = `shape:${string}`;
export type CustomShapeType = keyof CustomShapePropsMap;

/**
 * A shape record in the Quickdraw store. Quickdraw's own shapes (draw strokes, text) and the site's custom
 * HTML shapes share this shape. `meta` holds the site's data (links, content bindings) and survives copies.
 */
export interface ShapeRecord<T extends string = string, P extends object = Record<string, unknown>> {
  id: ShapeId;
  typeName: "shape";
  type: T;
  x: number;
  y: number;
  /** Rotation in radians. */
  rot: number;
  /** Stacking order: higher draws on top. */
  z: number;
  props: P;
  meta?: Record<string, unknown>;
}

/** A custom shape of type `K`, typed from `CustomShapePropsMap`. */
export type CanvasShape<K extends CustomShapeType = CustomShapeType> = K extends CustomShapeType
  ? ShapeRecord<K, CustomShapePropsMap[K]>
  : never;

/** Any shape on the canvas, custom or Quickdraw's own. */
export type AnyShape = ShapeRecord;

/** What a layout creator passes to `createShape`. */
export type ShapePartial<K extends CustomShapeType = CustomShapeType> = K extends CustomShapeType
  ? {
      id?: ShapeId;
      type: K;
      x?: number;
      y?: number;
      rot?: number;
      props?: Partial<CustomShapePropsMap[K]>;
      meta?: Record<string, unknown>;
    }
  : never;

export type ShapeUpdate = {
  id: ShapeId;
  type?: string;
  x?: number;
  y?: number;
  rot?: number;
  props?: Record<string, unknown>;
  meta?: Record<string, unknown>;
};

export type Vec = { x: number; y: number };
export type Camera = { x: number; y: number; z: number };
export type Box = { x: number; y: number; w: number; h: number };

/** Tools offered on the canvas. `browse` pans on drag and follows links on click. */
export type ToolId = "browse" | "select" | "draw" | "text" | "eraser" | "hand";

/** Pointer event passed to `editor.on("event")` listeners. `point` is in client (screen) coordinates. */
export type CanvasPointerEvent = {
  type: "pointer";
  name: "pointer_down" | "pointer_move" | "pointer_up";
  point: Vec;
  isPen: boolean;
  shiftKey: boolean;
};

/** Resize details handed to `ShapeUtil.onResize`. */
export type ResizeInfo = { scaleX: number; scaleY: number };
