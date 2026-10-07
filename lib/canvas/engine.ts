/* eslint-disable @typescript-eslint/no-explicit-any -- reaches into Quickdraw internals that its types do not describe */
/**
 * The Quickdraw editor, taught about this site's custom HTML shapes and tools.
 *
 * Quickdraw draws its own shapes (pen strokes, text) on a canvas and knows nothing about other shape types.
 * The overrides here make custom shapes behave like Quickdraw's own in every tool: hit testing (select, erase,
 * double click), resizing, stacking. The shapes themselves are drawn by React under the transparent canvas
 * (see components/canvas/QuickdrawCanvas.tsx). `Editor` in ./editor.ts is the API the rest of the site uses.
 *
 * Methods prefixed with `_` override Quickdraw's internal ones (@quickdrawjs/core 0.2.0, src/editor.js).
 * Check them when upgrading Quickdraw.
 */
import { Editor as QuickdrawEditor, FONTS, hitShape, type EditorOptions } from "@quickdrawjs/core";
import type { AnyShape, ShapeId, ToolId } from "./types";

// Text typed with the text tool uses the site's handwriting font.
(FONTS as Record<string, string>).draw = "'Loranthus', cursive";

/** Tool keyboard shortcuts. Quickdraw's other tools (arrow, note, geo, laser, highlighter) are not offered here. */
const TOOL_KEYS: Record<string, ToolId> = { v: "select", "1": "select", h: "hand", d: "draw", p: "draw", b: "draw", x: "draw", e: "eraser", t: "text" };
const BLOCKED_KEYS = new Set(["i", "k", "a", "l", "n", "g", "r", "o"]);
/** Pixels the pointer moves in browse before the view starts to pan. */
const BROWSE_DRAG_THRESHOLD = 3;
/** Shapes that keep their proportions on a corner resize, like Quickdraw's own text, notes and images. */
const UNIFORM_TYPES = new Set(["image", "note", "text", "canvas-image"]);

/** Call Quickdraw's own implementation of an internal method this class overrides. */
function callBase(engine: SiteEngine, name: string, ...args: unknown[]) {
  return (QuickdrawEditor.prototype as any)[name].apply(engine, args);
}

/**
 * Scale one of Quickdraw's own shapes about its local origin (Quickdraw's `scaleShape`, which the package does not
 * export). The caller places the shape.
 */
function scaleQuickdrawShape(shape: any, sx: number, sy: number): any {
  const p = shape.props;
  switch (shape.type) {
    case "draw":
    case "highlight": {
      const pts = p.pts.slice();
      for (let i = 0; i < pts.length; i += 3) {
        pts[i] *= sx;
        pts[i + 1] *= sy;
      }
      return { ...shape, props: { ...p, pts } };
    }
    case "geo":
    case "image":
      return { ...shape, props: { ...p, w: Math.max(1, p.w * sx), h: Math.max(1, p.h * sy) } };
    case "arrow":
    case "line":
      return { ...shape, props: { ...p, dx: p.dx * sx, dy: p.dy * sy, ...(p.bend ? { bend: p.bend * Math.sqrt(Math.abs(sx * sy)) } : {}) } };
    case "text": {
      const s = Math.sqrt(Math.abs(sx * sy));
      return { ...shape, props: { ...p, scale: Math.max(0.2, (p.scale || 1) * s), ...(p.autosize === false && p.w ? { w: p.w * sx } : {}) } };
    }
    case "note": {
      const s = Math.sqrt(Math.abs(sx * sy));
      return { ...shape, props: { ...p, scale: Math.max(0.3, (p.scale || 1) * s) } };
    }
    default:
      return shape;
  }
}

/** What the engine needs from the site's `Editor`. */
export interface EngineHost {
  isCustom(type: string): boolean;
  hitCustom(shape: AnyShape, x: number, y: number, margin: number): boolean;
  /** The shape scaled by (sx, sy) about its own origin. */
  scaleCustom(shape: AnyShape, sx: number, sy: number): AnyShape;
  canEdit(shape: AnyShape): boolean;
  getEditingCustomId(): ShapeId | null;
  startEditing(id: ShapeId): void;
  stopEditing(): void;
  setTool(tool: ToolId): void;
  isBrowsing(): boolean;
  setErasing(ids: ReadonlySet<string> | null): void;
}

export class SiteEngine extends QuickdrawEditor {
  host: EngineHost | null = null;

  /** Quickdraw's internals, untyped. */
  get internal(): any {
    return this;
  }

  private isCustom(shape: AnyShape) {
    return !!this.host?.isCustom(shape.type);
  }

  // The page behind the canvas is white HTML, and custom shapes render under the canvas: never paint paper.
  override renderScene(ctx: CanvasRenderingContext2D, cam: any, w: number, h: number, opts: any = {}) {
    super.renderScene(ctx, cam, w, h, { ...opts, background: false });
  }

  // Custom shapes render below the canvas, so they also sort (and hit test) below Quickdraw's own shapes.
  override shapesSorted(): any[] {
    return this.store.shapes().sort((a: any, b: any) => {
      const layer = (s: any) => (this.isCustom(s) ? 0 : s.type === "highlight" ? 1 : 2);
      return layer(a) - layer(b) || a.z - b.z || (a.id < b.id ? -1 : 1);
    });
  }

  override hitTest(px: number, py: number): any {
    const tol = 8 / this.camera.z;
    const list = this.shapesSorted();
    for (let i = list.length - 1; i >= 0; i--) {
      const s = list[i];
      const hit = this.isCustom(s) ? this.host!.hitCustom(s, px, py, tol) : hitShape(s, px, py, tol, this.store);
      if (hit) return s;
    }
    return null;
  }

  // Same as Quickdraw's resize, but custom shapes scale through their ShapeUtil.
  _dragResize(p: { x: number; y: number }, e: PointerEvent) {
    const ss = this.internal.session;
    const { handle, init } = ss;
    const ax = handle.includes("l") ? init.x + init.w : init.x;
    const ay = handle.includes("t") ? init.y + init.h : init.y;
    let sx =
      handle.includes("l") || handle.includes("r")
        ? (p.x - ax) / ((handle.includes("l") ? init.x : init.x + init.w) - ax)
        : 1;
    let sy =
      handle.includes("t") || handle.includes("b")
        ? (p.y - ay) / ((handle.includes("t") ? init.y : init.y + init.h) - ay)
        : 1;
    sx = Number.isFinite(sx) ? Math.max(0.02, sx) : 1;
    sy = Number.isFinite(sy) ? Math.max(0.02, sy) : 1;
    const corner = handle.length === 2;
    const orig: Map<string, any> = ss.orig;
    const uniform = corner && (e.shiftKey || [...orig.values()].every((sh) => UNIFORM_TYPES.has(sh.type)));
    if (uniform) sx = sy = Math.max(sx, sy);
    this.store.transact(() => {
      for (const [id, o] of orig) {
        if (!this.store.has(id)) continue;
        const scaled = this.isCustom(o) ? this.host!.scaleCustom(o, sx, sy) : scaleQuickdrawShape(o, sx, sy);
        this.store.put({ ...scaled, x: ax + (o.x - ax) * sx, y: ay + (o.y - ay) * sy });
      }
    });
  }

  // Double click edits a custom shape's text, like it does Quickdraw's own text.
  _dblClick(e: MouseEvent) {
    if (this.readonly || this.tool !== "select") return;
    const r = this.container.getBoundingClientRect();
    const p = this.screenToPage(e.clientX - r.left, e.clientY - r.top);
    const hit = this.hitTest(p.x, p.y);
    if (hit && this.isCustom(hit)) {
      if (this.host!.canEdit(hit)) this.host!.startEditing(hit.id);
      return;
    }
    callBase(this, "_dblClick", e);
  }

  _keyDown(e: KeyboardEvent) {
    const host = this.host;
    const target = e.target as HTMLElement | null;
    if (!host || host.getEditingCustomId()) return;
    if (target && target !== this.container && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    if (this.readonly || this.internal.editing) return;
    const k = e.key.toLowerCase();
    const modified = e.metaKey || e.ctrlKey || e.altKey;
    if (!modified && TOOL_KEYS[k]) {
      host.setTool(TOOL_KEYS[k]);
      return;
    }
    if (!modified && BLOCKED_KEYS.has(k)) return;
    // Browse has nothing to cancel; Quickdraw would switch to select.
    if (k === "escape" && host.isBrowsing()) return;
    if (k === "enter" && this.selection.size === 1) {
      const s = this.store.get([...this.selection][0]) as AnyShape | undefined;
      if (s && this.isCustom(s)) {
        if (host.canEdit(s)) {
          e.preventDefault();
          host.startEditing(s.id);
        }
        return;
      }
    }
    callBase(this, "_keyDown", e);
  }

  _pointerDown(e: PointerEvent) {
    // A press on the canvas ends editing a custom shape (the shape itself sits above the canvas while edited).
    if (this.host?.getEditingCustomId()) this.host.stopEditing();
    // Once a stylus has been used, Quickdraw ignores single fingers (a resting palm). Browse and hand still pan with one.
    const s = this.internal;
    if (
      this.penMode &&
      e.pointerType === "touch" &&
      this.tool === "hand" &&
      !this.readonly &&
      !s.session &&
      s._pointers.size === 0 &&
      (e.target === this.canvas || e.target === this.overlay || e.target === this.container)
    ) {
      const point = s._evPoint(e);
      s._pointers.set(e.pointerId, point);
      s._ptrType.set(e.pointerId, e.pointerType);
      try {
        this.container.setPointerCapture(e.pointerId);
      } catch {}
      s.session = { type: "panning", last: point };
    } else {
      callBase(this, "_pointerDown", e);
    }
    // Browse only starts panning after the pointer moved a few pixels, so clicking a link never nudges the view.
    if (this.host?.isBrowsing() && s.session?.type === "panning") s.session.deadZone = { ...s.session.last };
    // The text tool on existing text edits that text (like a double click in select) instead of adding a new block.
    if (s.session?.type === "placing" && s.session.tool === "text") {
      const hit = this.hitTest(s.session.page.x, s.session.page.y);
      if (hit && this.host?.canEdit(hit)) s.session.editId = hit.id;
    }
  }

  // Editing starts on release, like placing new text: the browser's own focus handling on press would undo it.
  _pointerUp(e: PointerEvent) {
    const ss = this.internal.session;
    if (ss?.type !== "placing" || !ss.editId) return callBase(this, "_pointerUp", e);
    this.internal.session = null;
    callBase(this, "_pointerUp", e);
    this.host?.startEditing(ss.editId);
  }

  _pointerMove(e: PointerEvent) {
    const ss = this.internal.session;
    if (ss?.type === "panning" && ss.deadZone) {
      const p = this.internal._evPoint(e);
      if (Math.hypot(p.x - ss.deadZone.x, p.y - ss.deadZone.y) <= BROWSE_DRAG_THRESHOLD) return;
      ss.deadZone = null;
    }
    callBase(this, "_pointerMove", e);
  }

  // Browse keeps the cursor the page sets (default, or pointer over links). The tool cursors come from CSS.
  _syncCursor(force?: string) {
    if (this.host?.isBrowsing()) {
      this.container.style.cursor = "";
      return;
    }
    callBase(this, "_syncCursor", force);
  }

  // The text field Quickdraw floats over text being typed: named, so form tooling and autofill leave it alone.
  _startTextEdit(id: string, field: string, opts?: unknown) {
    callBase(this, "_startTextEdit", id, field, opts);
    const textarea: HTMLTextAreaElement | undefined = this.internal.editing?.textarea;
    if (textarea) {
      textarea.name = "canvas-text";
      textarea.setAttribute("aria-label", "Canvas text");
      textarea.autocomplete = "off";
    }
  }

  // Quickdraw zooms by exp(-deltaY * 0.012): fine for trackpad pinches (small deltas), but one mouse wheel notch
  // with Ctrl held (deltaY around 100) would zoom 3x. Cap each step, like tldraw did.
  _wheel(e: WheelEvent) {
    if (this.readonly) return;
    if (!(e.ctrlKey || e.metaKey)) return callBase(this, "_wheel", e);
    e.preventDefault();
    const r = this.container.getBoundingClientRect();
    const dy = Math.max(-10, Math.min(10, e.deltaY));
    this.zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-dy * 0.012));
  }

  // No selection frame around a custom shape while its text is edited.
  _renderOverlay(w: number, h: number, dpr: number) {
    if (!this.host?.getEditingCustomId()) return callBase(this, "_renderOverlay", w, h, dpr);
    const selection = this.selection;
    this.selection = new Set();
    try {
      callBase(this, "_renderOverlay", w, h, dpr);
    } finally {
      this.selection = selection;
    }
  }

  // Erased custom shapes fade while the eraser is down, like Quickdraw's own.
  _eraseAt(p: { x: number; y: number }) {
    callBase(this, "_eraseAt", p);
    this.host?.setErasing(this.internal.session?.hits ?? null);
  }

  _endErase() {
    callBase(this, "_endErase");
    this.host?.setErasing(null);
  }
}

export type { EditorOptions };
