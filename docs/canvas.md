# The canvas

The sketch site is drawn on [Quickdraw](https://tryquickdraw.com) (`@quickdrawjs/core`, MIT). It replaced tldraw, which needs a license key in production.

Quickdraw is a small canvas engine: camera, pointer and keyboard input, select / move / resize / rotate, pen, text, eraser, undo and a store of plain records. It has a fixed set of its own shapes, drawn on a 2D canvas, and no way to add HTML shapes. The site's content is HTML shapes (cards, buttons, annotations, screenshots), so `lib/canvas/` adds them on top.

## Layers

`components/canvas/QuickdrawCanvas.tsx` stacks three layers in `.cv-container`, back to front:

1. **Custom shapes**: React components from each `ShapeUtil`, in a layer that follows the camera with a CSS transform.
2. **The Quickdraw engine** (`.cv-engine`): a transparent canvas with pen strokes and typed text, the selection frame, and all pointer and keyboard input.
3. **The shape being edited**, lifted above the engine so its text field can be clicked, and the hover outline of the select tool.

Layers 1 and 3 do not take pointer events (except the edited shape), so every press reaches Quickdraw.

## Files

| File | What it does |
|---|---|
| `lib/canvas/engine.ts` | `SiteEngine`, a subclass of Quickdraw's `Editor`. Teaches it the custom shapes (hit testing, resizing, stacking under the canvas), double click and Enter to edit, the browse tool, blocked tool shortcuts, a transparent background and a gentler Ctrl+wheel zoom. Its `_` methods override Quickdraw internals: check them when upgrading Quickdraw. |
| `lib/canvas/editor.ts` | `Editor`, the API the rest of the site uses (`createShape`, `updateShape`, `getShapesAtPoint`, `setCurrentTool`, `setEditingShape`, `setCamera`, `on("event")`, ...). Method names follow the old tldraw API, so layout creators did not change. |
| `lib/canvas/ShapeUtil.ts` | `ShapeUtil` base class, `Rectangle2d`, `resizeBox` and the `T` prop validators for custom shapes. |
| `lib/canvas/react.tsx` | `useEditor`, `useEditorValue`, `useIsEditing`, `track` and `HTMLContainer`. |
| `lib/canvas/snapshot.ts` | What a canvas saves to localStorage and how it loads. Tested in `tests/canvasSnapshot.test.ts`. |
| `components/canvas/QuickdrawCanvas.tsx` | The layered component. |
| `lib/shapes.ts` | The list of custom shape utils. Shape props are typed in `lib/shapeTypes.ts`. |

## Shapes

A shape record is `{ id, typeName: "shape", type, x, y, rot, z, props, meta }`. `rot` is in radians about the shape's centre; `z` is the stacking order. Custom shapes always draw under Quickdraw's own shapes (a pen stroke over a card stays visible).

`meta` carries the site's data (links, content bindings, items, see `docs/content-overrides.md`) and is kept when a shape is copied, duplicated or pasted.

Quickdraw's own shapes that visitors can make here are `draw` (pen strokes) and `text`. Pasting or dropping an image file makes a Quickdraw `image`. Case study screenshots are the custom `canvas-image` shape instead, so they go through the Next.js image optimizer at their on-screen size (`lib/canvasAssets.ts`) and keep their alt text.

## Saving

`components/canvas/useCanvasPersistence.ts` saves `editor.getSnapshot()` under `prerita-wip-<pageKey>` half a second after any change:

```
{ format: "quickdraw-1", document: { store: { "page:page": { typeName: "page", meta }, [id]: record } }, session: { camera } }
```

The page record's `meta` holds what the layout created (`boundKeys`, `itemKeys`), which Build needs. `collectOverrides` reads this envelope the same way it read tldraw's.

Anything saved in another format (a canvas from the old tldraw version of the site) is not loaded: the page starts from its default layout and the next save replaces it. Build skips those saves too (`commitOverridesFromCanvases`), so they never reach the rendered site.

The editor and engine are tested in `tests/canvasEditor.test.ts` (in a fake DOM, see the top of that file).
