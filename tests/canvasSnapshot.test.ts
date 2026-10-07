/**
 * Saving and loading WIP canvases (lib/canvas/snapshot.ts). No DOM needed. Run with `bun test`. See docs/canvas.md.
 */
import { describe, expect, test } from "bun:test";
import { isSavedCanvas, parseCanvas, serializeCanvas, SNAPSHOT_FORMAT, PAGE_RECORD_ID } from "../lib/canvas/snapshot";
import { BOUND_KEYS_META, ITEM_KEYS_META, collectOverrides, hashText } from "../lib/contentOverrides";
import { steppedScreenScale } from "../lib/canvasAssets";

const records = [
  {
    id: "shape:a",
    typeName: "shape",
    type: "annotation",
    x: 1,
    y: 2,
    rot: 0,
    z: 1,
    props: { text: "hi" },
    meta: { content: [{ key: "about.title", prop: "text", base: hashText("hello") }], item: "x" },
  },
  { id: "shape:b", typeName: "shape", type: "draw", x: 0, y: 0, rot: 0, z: 2, props: { pts: [0, 0, 0.5] } },
];

describe("saved canvas", () => {
  test("round trips records, page meta and camera", () => {
    const saved = serializeCanvas(records, { boundKeys: ["k"] }, { x: 5, y: 6, z: 0.5 });
    expect(saved.format).toBe(SNAPSHOT_FORMAT);
    expect(saved.document.store[PAGE_RECORD_ID]).toMatchObject({ typeName: "page", meta: { boundKeys: ["k"] } });
    const loaded = parseCanvas(JSON.parse(JSON.stringify(saved)))!;
    expect(loaded.records).toEqual(records);
    expect(loaded.pageMeta).toEqual({ boundKeys: ["k"] });
    expect(loaded.camera).toEqual({ x: 5, y: 6, z: 0.5 });
  });

  test("broken records are skipped, a bad camera is dropped", () => {
    const saved = serializeCanvas(records, {}, { x: 0, y: 0, z: 1 });
    (saved.document.store as Record<string, unknown>)["shape:bad"] = { id: "shape:bad", typeName: "shape", type: "annotation" };
    saved.session = { camera: { x: 0, y: 0, z: 0 } };
    const loaded = parseCanvas(saved)!;
    expect(loaded.records.map((r) => r.id)).toEqual(["shape:a", "shape:b"]);
    expect(loaded.camera).toBeNull();
  });

  test("a canvas saved by the tldraw version, or anything else, is not loaded", () => {
    const tldraw = {
      document: { store: { "shape:x": { id: "shape:x", typeName: "shape", type: "annotation", x: 0, y: 0, props: {} } }, schema: { schemaVersion: 2 } },
      session: { pageStates: [] },
    };
    expect(isSavedCanvas(tldraw)).toBe(false);
    expect(parseCanvas(tldraw)).toBeNull();
    expect(parseCanvas(null)).toBeNull();
    expect(parseCanvas("nope")).toBeNull();
    expect(parseCanvas({ format: SNAPSHOT_FORMAT })).toBeNull();
  });

  test("Build reads a saved canvas: edits, erased fields and deleted items", () => {
    const pageMeta = { [BOUND_KEYS_META]: ["about.title", "about.outro"], [ITEM_KEYS_META]: ["x", "y"] };
    const overrides = collectOverrides([serializeCanvas(records, pageMeta, { x: 0, y: 0, z: 1 })]);
    // "hi" differs from the default "hello"; about.outro has no shape any more; item y has no shape any more.
    expect(overrides).toEqual({ "about.title": "hi", "about.outro": "", hidden: ["y"] });
  });
});

describe("helpers", () => {
  test("steppedScreenScale rounds up to a power of two, at least 1/8", () => {
    expect(steppedScreenScale(0.22)).toBe(0.25);
    expect(steppedScreenScale(1)).toBe(1);
    expect(steppedScreenScale(1.1)).toBe(2);
    expect(steppedScreenScale(0.01)).toBe(0.125);
    expect(steppedScreenScale(0)).toBe(0.125);
  });
});
