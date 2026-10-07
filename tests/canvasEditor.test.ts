/**
 * The canvas editor (lib/canvas) on the real Quickdraw engine, driven by pointer and keyboard events like a visitor.
 * Runs in a fake DOM (happy-dom). Canvas drawing is stubbed: these tests cover behaviour, not pixels.
 * Run with `bun test`. See docs/canvas.md.
 */
import { afterAll, afterEach, beforeAll, describe, expect, test } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import type { Editor as EditorType, AnyShape, ShapeId } from "../lib/canvas";

let Editor: typeof import("../lib/canvas").Editor;
let Store: typeof import("@quickdrawjs/core").Store;
let customShapeUtils: typeof import("../lib/shapes").customShapeUtils;
let contentOverrides: typeof import("../lib/contentOverrides");

beforeAll(async () => {
  GlobalRegistrator.register();
  // happy-dom has no 2D canvas: every drawing call is a no-op, text measures 10px per character.
  const ctx: CanvasRenderingContext2D = new Proxy({} as CanvasRenderingContext2D, {
    get: (_t, prop) => (prop === "measureText" ? (s: string) => ({ width: s.length * 10 }) : () => {}),
    set: () => true,
  });
  HTMLCanvasElement.prototype.getContext = (() => ctx) as unknown as HTMLCanvasElement["getContext"];
  // Quickdraw measures text on an OffscreenCanvas when there is one.
  if (typeof OffscreenCanvas !== "undefined") {
    OffscreenCanvas.prototype.getContext = (() => ctx) as unknown as OffscreenCanvas["getContext"];
  }
  const g = globalThis as Record<string, unknown>;
  g.Path2D ??= class { moveTo() {} lineTo() {} closePath() {} quadraticCurveTo() {} bezierCurveTo() {} ellipse() {} };
  g.ResizeObserver ??= class { observe() {} disconnect() {} };
  ({ Editor } = await import("../lib/canvas"));
  ({ Store } = await import("@quickdrawjs/core"));
  ({ customShapeUtils } = await import("../lib/shapes"));
  contentOverrides = await import("../lib/contentOverrides");
});

afterAll(async () => {
  await GlobalRegistrator.unregister();
});

// ─── Helpers ───────────────────────────────────────────────────

type Setup = { editor: EditorType; engine: HTMLElement; canvas: HTMLCanvasElement };
const open: Setup[] = [];

/** A mounted editor. The engine element sits at (0, 0) with camera (0, 0, 1), so screen and page coordinates match. */
function setup(): Setup {
  const container = document.createElement("div");
  const engine = document.createElement("div");
  container.appendChild(engine);
  document.body.appendChild(container);
  const editor = new Editor({ container, engineContainer: engine, store: new Store(), shapeUtils: customShapeUtils });
  const s = { editor, engine, canvas: engine.querySelector("canvas.qd-canvas") as HTMLCanvasElement };
  open.push(s);
  return s;
}

afterEach(() => {
  for (const s of open.splice(0)) s.editor.destroy();
  document.body.innerHTML = "";
});

type PointerOpts = { id?: number; kind?: "mouse" | "pen" | "touch"; shift?: boolean };
function pointer(target: Element, type: string, x: number, y: number, o: PointerOpts = {}) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: o.id ?? 1,
      pointerType: o.kind ?? "mouse",
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      pressure: 0.5,
      shiftKey: !!o.shift,
    })
  );
}

/** Press on the canvas, move through the points, release. */
function drag({ canvas, engine }: Setup, points: Array<[number, number]>, o: PointerOpts = {}) {
  pointer(canvas, "pointerdown", ...points[0], o);
  for (const p of points.slice(1)) pointer(engine, "pointermove", ...p, o);
  pointer(engine, "pointerup", ...points[points.length - 1], o);
}

const click = (s: Setup, x: number, y: number, o?: PointerOpts) => drag(s, [[x, y]], o);
const key = ({ engine }: Setup, k: string, o: KeyboardEventInit = {}) =>
  engine.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...o }));

function button(editor: EditorType, x = 100, y = 100) {
  editor.createShape({
    type: "hand-drawn-button",
    x,
    y,
    props: { w: 120, h: 40, label: "Hello" },
    meta: { componentType: "button", variationId: "b", href: "/contact", item: "landing.cta" },
  });
  return editor.getCurrentPageShapes().at(-1)!;
}

const shapes = (editor: EditorType) => editor.getCurrentPageShapes();
const get = (editor: EditorType, id: ShapeId) => editor.getShape(id) as AnyShape & { props: Record<string, unknown> };

// ─── Tests ─────────────────────────────────────────────────────

describe("creating shapes", () => {
  test("fills default props, keeps meta, stacks new shapes on top", () => {
    const { editor } = setup();
    const a = button(editor);
    editor.createShape({ type: "annotation", x: 0, y: 0, props: { text: "Hi" } });
    const b = shapes(editor).at(-1)!;
    expect(a.id.startsWith("shape:")).toBe(true);
    expect(a.meta).toMatchObject({ href: "/contact", item: "landing.cta" });
    expect(b.props).toMatchObject({ text: "Hi", fontSize: 20, showArrow: false });
    expect(b.z).toBeGreaterThan(a.z);
  });

  test("rejects props of the wrong type", () => {
    const { editor } = setup();
    expect(() => editor.createShape({ type: "annotation", props: { fontSize: "big" as unknown as number } })).toThrow(/fontSize/);
  });
});

describe("hit testing", () => {
  test("finds custom shapes under a point, top first, including rotated ones", () => {
    const { editor } = setup();
    const under = button(editor, 100, 100);
    const over = button(editor, 150, 110);
    expect(editor.getShapesAtPoint({ x: 160, y: 120 }).map((s) => s.id)).toEqual([over.id, under.id]);
    expect(editor.getShapesAtPoint({ x: 500, y: 500 })).toEqual([]);
    editor.updateShape({ id: under.id, rot: Math.PI / 2 });
    // 120 x 40 turned upright about its centre (160, 120): now spans y 60..180, x 140..180.
    expect(editor.getShapesAtPoint({ x: 150, y: 170 }).map((s) => s.id)).toContain(under.id);
    expect(editor.getShapesAtPoint({ x: 110, y: 105 }).map((s) => s.id)).not.toContain(under.id);
  });
});

describe("tools", () => {
  test("starts in browse; shortcuts switch tools; tools the site does not offer are blocked", () => {
    const s = setup();
    expect(s.editor.getCurrentToolId()).toBe("browse");
    key(s, "Escape");
    expect(s.editor.getCurrentToolId()).toBe("browse");
    key(s, "d");
    expect(s.editor.getCurrentToolId()).toBe("draw");
    for (const blocked of ["a", "g", "n", "k", "i", "l"]) key(s, blocked);
    expect(s.editor.getCurrentToolId()).toBe("draw");
    key(s, "v");
    expect(s.editor.getCurrentToolId()).toBe("select");
    key(s, "e");
    expect(s.editor.getCurrentToolId()).toBe("eraser");
  });

  test("browse: a click does not move the view, a drag pans it", () => {
    const s = setup();
    drag(s, [[100, 100], [102, 101]]);
    expect(s.editor.getCamera()).toEqual({ x: 0, y: 0, z: 1 });
    drag(s, [[100, 100], [103, 104], [120, 140]]);
    expect(s.editor.getCamera()).toEqual({ x: 20, y: 40, z: 1 });
  });

  test("browse: one finger still pans after a stylus has been used", () => {
    const s = setup();
    drag(s, [[100, 100], [100, 110]], { kind: "pen", id: 2 });
    const before = s.editor.getCamera();
    drag(s, [[100, 100], [100, 105], [100, 150]], { kind: "touch", id: 3 });
    expect(s.editor.getCamera().y).toBe(before.y + 50);
  });

  test("browse: pointer events reach listeners in screen coordinates", () => {
    const s = setup();
    const seen: string[] = [];
    s.editor.on("event", (e) => seen.push(`${e.name}@${e.point.x},${e.point.y}`));
    click(s, 30, 40);
    expect(seen).toEqual(["pointer_down@30,40", "pointer_up@30,40"]);
  });

  test("Ctrl + wheel zooms in small steps", () => {
    const s = setup();
    const wheel = new WheelEvent("wheel", { deltaY: -100, bubbles: true, cancelable: true });
    // happy-dom's WheelEvent drops modifier keys and coordinates.
    Object.defineProperties(wheel, { ctrlKey: { value: true }, clientX: { value: 0 }, clientY: { value: 0 } });
    s.engine.dispatchEvent(wheel);
    expect(s.editor.getZoomLevel()).toBeCloseTo(Math.exp(0.12));
  });
});

describe("select tool on custom shapes", () => {
  test("select, move, delete and undo", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setCurrentTool("select");
    click(s, 110, 110);
    expect(s.editor.getSelectedShapeIds()).toEqual([b.id]);
    drag(s, [[110, 110], [120, 115], [160, 150]]);
    expect(get(s.editor, b.id)).toMatchObject({ x: 150, y: 140 });
    key(s, "Backspace");
    expect(s.editor.getShape(b.id)).toBeUndefined();
    s.editor.undo();
    expect(get(s.editor, b.id)).toMatchObject({ x: 150, y: 140 });
    s.editor.undo();
    expect(get(s.editor, b.id)).toMatchObject({ x: 100, y: 100 });
  });

  test("resizing from a corner handle resizes the shape through its util", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setCurrentTool("select");
    click(s, 110, 110);
    // Bottom right handle of the 120 x 40 button at (100, 100).
    drag(s, [[220, 140], [240, 150], [280, 160]]);
    expect(get(s.editor, b.id).props).toMatchObject({ w: 180, h: 60, label: "Hello" });
    expect(get(s.editor, b.id)).toMatchObject({ x: 100, y: 100 });
  });

  test("duplicating keeps meta (links and content bindings)", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setCurrentTool("select");
    click(s, 110, 110);
    key(s, "d", { metaKey: true });
    const copy = shapes(s.editor).find((x) => x.id !== b.id)!;
    expect(copy.meta).toEqual(b.meta);
    expect(copy.type).toBe("hand-drawn-button");
  });
});

describe("editing text in place", () => {
  test("double click edits an editable shape; the whole edit undoes as one step", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setCurrentTool("select");
    s.engine.dispatchEvent(new MouseEvent("dblclick", { clientX: 110, clientY: 110, bubbles: true }));
    expect(s.editor.getEditingShapeId()).toBe(b.id);
    for (const label of ["H", "Hi", "Hi!"]) s.editor.updateShape({ id: b.id, props: { label } });
    // Keys typed while editing never reach the tools (no delete, no tool switch).
    key(s, "Backspace");
    key(s, "d");
    expect(s.editor.getShape(b.id)).toBeDefined();
    expect(s.editor.getCurrentToolId()).toBe("select");
    s.editor.setEditingShape(null);
    expect(get(s.editor, b.id).props.label).toBe("Hi!");
    s.editor.undo();
    expect(get(s.editor, b.id).props.label).toBe("Hello");
  });

  test("shapes that are not editable are not edited", () => {
    const s = setup();
    s.editor.createShape({ type: "hand-drawn-illustration", x: 100, y: 100, props: { w: 100, h: 100 } });
    s.editor.setCurrentTool("select");
    s.engine.dispatchEvent(new MouseEvent("dblclick", { clientX: 120, clientY: 120, bubbles: true }));
    expect(s.editor.getEditingShapeId()).toBeNull();
  });

  test("the text tool on an editable shape edits it instead of adding new text", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setCurrentTool("text");
    click(s, 110, 110);
    expect(s.editor.getEditingShapeId()).toBe(b.id);
    expect(shapes(s.editor).map((x) => x.type)).toEqual(["hand-drawn-button"]);
  });

  test("the text tool on typed text edits that text", () => {
    const s = setup();
    s.editor.setCurrentTool("text");
    click(s, 300, 300);
    const textarea = s.engine.querySelector("textarea")!;
    textarea.value = "a note";
    textarea.dispatchEvent(new Event("input"));
    s.editor.setEditingShape(null);
    const note = shapes(s.editor).find((x) => x.type === "text")!;
    expect(note.props.text).toBe("a note");
    s.editor.setCurrentTool("text");
    click(s, note.x + 5, note.y + 5);
    expect(s.editor.getEditingShapeId()).toBe(note.id);
    expect(shapes(s.editor).filter((x) => x.type === "text")).toHaveLength(1);
  });

  test("the text tool still adds new text on empty canvas and on shapes without text", () => {
    const s = setup();
    s.editor.createShape({ type: "hand-drawn-illustration", x: 100, y: 100, props: { w: 100, h: 100 } });
    s.editor.setCurrentTool("text");
    click(s, 120, 120);
    const placed = s.editor.getEditingShapeId();
    expect(placed && s.editor.getShape(placed)?.type).toBe("text");
    s.editor.setEditingShape(null);
    s.editor.setCurrentTool("text");
    click(s, 500, 500);
    const placedOnEmpty = s.editor.getEditingShapeId();
    expect(placedOnEmpty && s.editor.getShape(placedOnEmpty)?.type).toBe("text");
  });

  test("a press on the canvas ends editing", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setEditingShape(b.id);
    click(s, 400, 400);
    expect(s.editor.getEditingShapeId()).toBeNull();
  });
});

describe("pen and eraser", () => {
  test("the pen draws thin black strokes above custom shapes", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setCurrentTool("draw");
    drag(s, [[110, 110], [130, 115], [150, 125]]);
    const stroke = shapes(s.editor).find((x) => x.type === "draw")!;
    expect(stroke.props).toMatchObject({ size: "s", color: "black", done: true });
    expect(shapes(s.editor).map((x) => x.id)).toEqual([b.id, stroke.id]);
    // Stays in the pen after a stroke.
    expect(s.editor.getCurrentToolId()).toBe("draw");
  });

  test("the eraser removes custom shapes and strokes, and undo brings both back in one step", () => {
    const s = setup();
    const b = button(s.editor);
    s.editor.setCurrentTool("draw");
    drag(s, [[300, 300], [320, 300], [340, 300]]);
    s.editor.setCurrentTool("eraser");
    drag(s, [[110, 110], [200, 200], [320, 300]]);
    expect(shapes(s.editor)).toEqual([]);
    s.editor.undo();
    expect(shapes(s.editor).map((x) => x.type)).toEqual(["hand-drawn-button", "draw"]);
    expect(get(s.editor, b.id).meta).toMatchObject({ item: "landing.cta" });
  });
});

describe("saving and Build", () => {
  test("the saved canvas carries edits, page meta and deletions to Build", () => {
    const { editor } = setup();
    editor.createShape({
      type: "annotation",
      props: { text: "Edited title" },
      meta: { content: [contentOverrides.bind("about.title", "Hi, I'm Prerita.")] },
    });
    const card = button(editor);
    editor.setPageMeta({ [contentOverrides.BOUND_KEYS_META]: ["about.title"], [contentOverrides.ITEM_KEYS_META]: ["landing.cta"] });
    editor.deleteShapes([card.id]);
    expect(contentOverrides.collectOverrides([editor.getSnapshot()])).toEqual({
      "about.title": "Edited title",
      hidden: ["landing.cta"],
    });
  });

  test("Build ignores canvases saved by the tldraw version", () => {
    const { editor } = setup();
    editor.createShape({ type: "annotation", props: { text: "New" }, meta: { content: [contentOverrides.bind("about.outro", "Old")] } });
    localStorage.clear();
    localStorage.setItem("prerita-wip-about-v2", JSON.stringify(editor.getSnapshot()));
    const tldrawSave = {
      document: {
        store: {
          "shape:t": { typeName: "shape", x: 0, y: 0, props: { text: "Stale" }, meta: { content: [contentOverrides.bind("contact.title", "Get in touch")] } },
        },
        schema: { schemaVersion: 2 },
      },
    };
    localStorage.setItem("prerita-wip-contact", JSON.stringify(tldrawSave));
    contentOverrides.commitOverridesFromCanvases();
    expect(contentOverrides.readOverrides()).toEqual({ "about.outro": "New" });
    localStorage.clear();
  });
});
