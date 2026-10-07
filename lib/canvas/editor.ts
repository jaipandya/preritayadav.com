/* eslint-disable @typescript-eslint/no-explicit-any -- shape utils are stored for every shape type at once */
/**
 * The canvas editor the site talks to: layouts create shapes through it, shapes and toolbars read and change state
 * through it. It wraps the Quickdraw engine (./engine.ts) and adds what the site needs on top: custom HTML shapes
 * with `meta`, the browse tool, editing custom shapes in place, pointer events for hover and links, page meta and
 * saving. The method names follow the old tldraw API the site was written against, so layouts read the same.
 */
import { Store, hitShape, newId } from "@quickdrawjs/core";
import { SiteEngine, type EngineHost } from "./engine";
import { serializeCanvas, type LoadedCanvas, type SavedCanvas } from "./snapshot";
import type { ShapeUtil, ShapeUtilConstructor } from "./ShapeUtil";
import type {
  AnyShape,
  Box,
  Camera,
  CanvasPointerEvent,
  ShapeId,
  ShapePartial,
  ShapeUpdate,
  ToolId,
  Vec,
} from "./types";

type AnyUtil = ShapeUtil<any>;
type Listener = (...args: any[]) => void;
type EditorEventName = "event" | "change" | "camera" | "document";

export const TOOL_IDS: readonly ToolId[] = ["browse", "select", "draw", "text", "eraser", "hand"];

export function createShapeId(): ShapeId {
  return newId("shape") as ShapeId;
}

export type EditorOptions = {
  /** Element wrapping the whole canvas: the shape layers and the engine. Pointer events are read here. */
  container: HTMLElement;
  /** Element the Quickdraw engine draws into, above the custom shape layer. */
  engineContainer: HTMLElement;
  store: Store;
  shapeUtils: readonly ShapeUtilConstructor[];
  initial?: Pick<LoadedCanvas, "pageMeta" | "camera"> | null;
};

export class Editor {
  readonly store: Store;
  private readonly engine: SiteEngine;
  private readonly container: HTMLElement;
  private readonly utils = new Map<string, AnyUtil>();
  private readonly listeners = new Map<EditorEventName, Set<Listener>>();
  private readonly cleanups: Array<() => void> = [];
  private tool: ToolId = "browse";
  private settingTool = false;
  private editingId: ShapeId | null = null;
  private erasing: ReadonlySet<string> | null = null;
  private hoveredId: ShapeId | null = null;
  private pageMeta: Record<string, unknown>;
  private destroyed = false;
  private version = 0;

  constructor({ container, engineContainer, store, shapeUtils, initial }: EditorOptions) {
    this.container = container;
    this.store = store;
    this.pageMeta = { ...(initial?.pageMeta ?? {}) };
    for (const Util of shapeUtils) this.utils.set(Util.type, new Util() as AnyUtil);

    this.engine = new SiteEngine({
      container: engineContainer,
      store,
      theme: "light",
      grid: "none",
      camera: initial?.camera ?? undefined,
      // Thin black pen, handwriting font.
      styles: { color: "black", size: "s", dash: "draw", fill: "none", font: "draw" },
    });
    this.engine.host = this.createHost();

    const offs = [
      this.engine.on("tool", () => this.onEngineTool()),
      this.engine.on("selection", () => this.emit("change")),
      this.engine.on("edit", () => this.emit("change")),
      this.engine.on("history", () => this.emit("change")),
      this.engine.on("camera", () => {
        this.emit("camera");
        this.emit("document");
      }),
      store.listen(() => {
        if (this.editingId && !store.has(this.editingId)) this.setEditingShape(null);
        this.emit("change");
        this.emit("document");
      }),
    ];
    this.cleanups.push(...offs);
    this.listenToPointer();
    this.setCurrentTool("browse");
    // Text measured before the handwriting font arrived is redrawn once it has.
    document.fonts?.ready.then(() => !this.destroyed && this.engine.requestRender());
  }

  private createHost(): EngineHost {
    return {
      isCustom: (type) => this.utils.has(type),
      hitCustom: (shape, x, y, margin) => this.hitCustom(shape, x, y, margin),
      scaleCustom: (shape, sx, sy) => {
        const util = this.utils.get(shape.type);
        if (!util?.canResize()) return shape;
        const change = util.onResize(shape, { scaleX: sx, scaleY: sy });
        return change?.props ? { ...shape, props: { ...shape.props, ...change.props } } : shape;
      },
      canEdit: (shape) => this.canEditShape(shape),
      getEditingCustomId: () => this.editingId,
      startEditing: (id) => this.setEditingShape(id),
      stopEditing: () => this.setEditingShape(null),
      setTool: (tool) => this.setCurrentTool(tool),
      isBrowsing: () => this.tool === "browse",
      setErasing: (ids) => {
        this.erasing = ids && ids.size ? new Set(ids) : null;
        this.emit("change");
      },
    };
  }

  // ─── Events ────────────────────────────────────────────────

  /** `event`: pointer events on the canvas. `change`: anything shown changed. `camera`: the view moved. */
  on(name: EditorEventName, fn: Listener) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name)!.add(fn);
    return () => this.off(name, fn);
  }

  off(name: EditorEventName, fn: Listener) {
    this.listeners.get(name)?.delete(fn);
  }

  /** Increases on every `change` event. */
  getVersion() {
    return this.version;
  }

  private emit(name: EditorEventName, ...args: unknown[]) {
    if (name === "change") this.version++;
    for (const fn of [...(this.listeners.get(name) ?? [])]) fn(...args);
  }

  private listenToPointer() {
    const send = (name: CanvasPointerEvent["name"]) => (e: PointerEvent) => {
      if (name === "pointer_down" && this.editingId && !(e.target as Element)?.closest?.("[data-editing]")) {
        this.setEditingShape(null);
      }
      if (name === "pointer_move") this.updateHover(e);
      this.emit("event", {
        type: "pointer",
        name,
        point: { x: e.clientX, y: e.clientY },
        isPen: e.pointerType === "pen",
        shiftKey: e.shiftKey,
      } satisfies CanvasPointerEvent);
    };
    const handlers: Array<[string, (e: PointerEvent) => void]> = [
      ["pointerdown", send("pointer_down")],
      ["pointermove", send("pointer_move")],
      ["pointerup", send("pointer_up")],
    ];
    for (const [type, fn] of handlers) this.container.addEventListener(type, fn as EventListener, true);
    this.cleanups.push(() => {
      for (const [type, fn] of handlers) this.container.removeEventListener(type, fn as EventListener, true);
    });
  }

  /** The custom shape under the pointer in the select tool, for its hover outline. */
  private updateHover(e: PointerEvent) {
    let next: ShapeId | null = null;
    if (this.tool === "select" && !this.editingId && !this.engine.internal.session) {
      const top = this.getShapesAtPoint(this.screenToPage({ x: e.clientX, y: e.clientY }))[0];
      if (top && this.utils.has(top.type)) next = top.id;
    }
    if (next !== this.hoveredId) {
      this.hoveredId = next;
      this.emit("change");
    }
  }

  // ─── Shapes ────────────────────────────────────────────────

  getShapeUtil(type: string): AnyUtil | undefined {
    return this.utils.get(type);
  }

  isCustomShape(shape: Pick<AnyShape, "type">) {
    return this.utils.has(shape.type);
  }

  createShape<K extends ShapePartial>(partial: K) {
    const util = this.utils.get(partial.type);
    if (!util) throw new Error(`No shape util for "${partial.type}"`);
    const props = { ...util.getDefaultProps(), ...(partial.props ?? {}) };
    util.validateProps(props);
    const shape: AnyShape = {
      id: partial.id ?? createShapeId(),
      typeName: "shape",
      type: partial.type,
      x: partial.x ?? 0,
      y: partial.y ?? 0,
      rot: partial.rot ?? 0,
      z: this.store.maxZ() + 1,
      props,
      meta: partial.meta ?? {},
    };
    this.store.put(shape as any);
    return this;
  }

  updateShape(update: ShapeUpdate) {
    const { id, type: _type, ...patch } = update;
    void _type;
    if (!this.store.has(id)) return this;
    this.store.update(id, patch as any);
    return this;
  }

  deleteShapes(ids: Iterable<ShapeId>) {
    this.store.remove([...ids]);
    return this;
  }

  getShape(id: ShapeId): AnyShape | undefined {
    const record = this.store.get(id) as unknown as AnyShape | undefined;
    return record?.typeName === "shape" ? record : undefined;
  }

  /** Every shape, back to front. */
  getCurrentPageShapes(): AnyShape[] {
    return this.engine.shapesSorted() as AnyShape[];
  }

  getCurrentPageShapeIds(): Set<ShapeId> {
    return new Set(this.getCurrentPageShapes().map((s) => s.id));
  }

  /** Shapes under a page point, top first. */
  getShapesAtPoint(point: Vec, opts: { hitInside?: boolean; margin?: number } = {}): AnyShape[] {
    const margin = opts.margin ?? 0;
    return this.getCurrentPageShapes()
      .reverse()
      .filter((s) =>
        this.utils.has(s.type) ? this.hitCustom(s, point.x, point.y, margin) : hitShape(s as any, point.x, point.y, margin, this.store)
      );
  }

  private hitCustom(shape: AnyShape, x: number, y: number, margin: number) {
    const util = this.utils.get(shape.type);
    if (!util) return false;
    const geometry = util.getGeometry(shape);
    let local = { x: x - shape.x, y: y - shape.y };
    if (shape.rot) {
      // Undo the rotation about the shape's centre.
      const b = geometry.bounds;
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      const cos = Math.cos(-shape.rot);
      const sin = Math.sin(-shape.rot);
      const dx = local.x - cx;
      const dy = local.y - cy;
      local = { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
    }
    return geometry.hitTestPoint(local, margin);
  }

  // ─── Tools ─────────────────────────────────────────────────

  getCurrentToolId(): ToolId {
    return this.tool;
  }

  setCurrentTool(tool: ToolId) {
    if (!TOOL_IDS.includes(tool)) return this;
    this.setEditingShape(null);
    this.tool = tool;
    this.settingTool = true;
    try {
      // Browse is Quickdraw's hand tool plus link handling (components/canvas/WipCanvas.tsx).
      this.engine.setTool(tool === "browse" ? "hand" : tool);
    } finally {
      this.settingTool = false;
    }
    this.container.dataset.tool = tool;
    this.engine.internal._syncCursor();
    this.hoveredId = null;
    this.emit("change");
    return this;
  }

  /** Quickdraw changed tool on its own (Escape, after placing text): follow it. */
  private onEngineTool() {
    if (this.settingTool) return;
    const next = this.engine.tool as ToolId;
    if (TOOL_IDS.includes(next) && next !== this.tool && !(next === "hand" && this.tool === "browse")) {
      this.tool = next;
      this.container.dataset.tool = next;
    }
    this.emit("change");
  }

  // ─── Selection and editing ─────────────────────────────────

  getSelectedShapeIds(): ShapeId[] {
    return [...this.engine.selection] as ShapeId[];
  }

  getOnlySelectedShape(): AnyShape | null {
    const ids = this.getSelectedShapeIds();
    return ids.length === 1 ? (this.getShape(ids[0]) ?? null) : null;
  }

  select(...ids: ShapeId[]) {
    this.engine.setSelection(ids);
    return this;
  }

  canEditShape(shape: AnyShape) {
    const util = this.utils.get(shape.type);
    return util ? util.canEdit() : shape.type === "text";
  }

  /** The shape whose text is being edited: a custom shape, or Quickdraw text. */
  getEditingShapeId(): ShapeId | null {
    return this.editingId ?? (this.engine.internal.editing?.id as ShapeId | undefined) ?? null;
  }

  /** Start editing a shape's text, or stop editing with null. A whole edit undoes as one step. */
  setEditingShape(shapeOrId: AnyShape | ShapeId | null) {
    const id = typeof shapeOrId === "string" ? shapeOrId : (shapeOrId?.id ?? null);
    if (id === null) {
      if (this.editingId) {
        this.editingId = null;
        this.store.endBatch();
        this.engine.requestRender();
        this.emit("change");
      }
      if (this.engine.internal.editing) this.engine.internal._commitText();
      return this;
    }
    const shape = this.getShape(id);
    if (!shape || !this.canEditShape(shape) || this.getEditingShapeId() === id) return this;
    if (this.tool !== "select") this.setCurrentTool("select");
    this.setEditingShape(null);
    this.engine.setSelection([id]);
    if (this.utils.has(shape.type)) {
      this.store.beginBatch();
      this.editingId = id;
      this.engine.requestRender();
      this.emit("change");
    } else {
      this.engine.internal._startTextEdit(id, "text");
    }
    return this;
  }

  getHoveredShapeId(): ShapeId | null {
    return this.hoveredId;
  }

  isErasing(id: ShapeId) {
    return !!this.erasing?.has(id);
  }

  // ─── History ───────────────────────────────────────────────

  undo() {
    this.setEditingShape(null);
    this.store.undo();
    return this;
  }

  redo() {
    this.setEditingShape(null);
    this.store.redo();
    return this;
  }

  canUndo() {
    return this.store.canUndo;
  }

  canRedo() {
    return this.store.canRedo;
  }

  clearHistory() {
    this.store.endBatch();
    this.store.undos.length = 0;
    this.store.redos.length = 0;
    this.emit("change");
    return this;
  }

  /** Run several changes as one change (and one undo step). */
  run(fn: () => void) {
    this.store.transact(fn);
    return this;
  }

  // ─── Camera ────────────────────────────────────────────────

  getCamera(): Camera {
    return { ...this.engine.camera };
  }

  setCamera(camera: Camera) {
    this.engine.setCamera({ ...camera });
    return this;
  }

  getZoomLevel() {
    return this.engine.camera.z;
  }

  /** The canvas on screen, in client coordinates. */
  getViewportScreenBounds(): Box & { width: number; height: number } {
    const r = this.engine.container.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, width: r.width, height: r.height };
  }

  /** Client (screen) point to page point. */
  screenToPage(point: Vec): Vec {
    const r = this.engine.container.getBoundingClientRect();
    return this.engine.screenToPage(point.x - r.left, point.y - r.top);
  }

  // ─── Page and saving ───────────────────────────────────────

  getContainer() {
    return this.container;
  }

  getPageMeta() {
    return this.pageMeta;
  }

  /** Replace the page's meta (what the layout created, see lib/contentOverrides.ts). Saved with the canvas. */
  setPageMeta(meta: Record<string, unknown>) {
    this.pageMeta = { ...meta };
    this.emit("document");
    return this;
  }

  getSnapshot(): SavedCanvas {
    return serializeCanvas(this.store.all() as any, this.pageMeta, this.engine.camera);
  }

  focus() {
    this.engine.container.focus({ preventScroll: true });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.setEditingShape(null);
    for (const off of this.cleanups) off();
    this.listeners.clear();
    this.engine.host = null;
    this.engine.destroy();
  }
}
