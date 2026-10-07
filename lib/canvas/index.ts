/**
 * The site's canvas, built on Quickdraw (@quickdrawjs/core, MIT). See docs/canvas.md.
 * Import canvas APIs from here, not from the files inside.
 */
export { Editor, createShapeId, TOOL_IDS } from "./editor";
export { ShapeUtil, Rectangle2d, T, resizeBox } from "./ShapeUtil";
export type { Geometry2d, RecordProps, Validator, ShapeUtilConstructor } from "./ShapeUtil";
export { EditorContext, HTMLContainer, track, useEditor, useEditorValue, useIsEditing } from "./react";
export { parseCanvas, serializeCanvas, isSavedCanvas, SNAPSHOT_FORMAT, PAGE_RECORD_ID } from "./snapshot";
export type { LoadedCanvas, SavedCanvas } from "./snapshot";
export type {
  AnyShape,
  Box,
  Camera,
  CanvasPointerEvent,
  CanvasShape,
  CustomShapeType,
  ResizeInfo,
  ShapeId,
  ShapePartial,
  ShapeRecord,
  ShapeUpdate,
  ToolId,
  Vec,
} from "./types";
