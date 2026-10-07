# preritayadav.com

A portfolio for Prerita Yadav in two worlds. The **sketch** (work in progress) is an interactive hand-drawn canvas built on [Quickdraw](https://tryquickdraw.com) (MIT). The **rendered** site under `/rendered` is the same content built as a minimal, fast, accessible set of normal pages. Text edited on the sketch can be carried to the rendered pages in the same browser (see `docs/content-overrides.md`).

Live at: **wip.preritayadav.com**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + global CSS |
| Canvas | [Quickdraw](https://tryquickdraw.com) (`@quickdrawjs/core`, MIT) with the site's own canvas layer in `lib/canvas/` (see `docs/canvas.md`) |
| Fonts | Sketch: Loranthus (custom, self-hosted in `public/fonts/`). Rendered: Geist and Geist Mono via `next/font` |
| Package manager | [Bun](https://bun.sh) |
| Hosting | Vercel (auto-deploy from `main`) |
| Repo | GitHub — `jaipandya/preritayadav.com` |

---

## How the site works

Every route outside `/rendered` renders a `WipCanvas`, a full-screen canvas. Instead of HTML content, each page's content (project cards, text, images, buttons) is represented as **custom canvas shapes** positioned on the canvas. Visitors can pan around, zoom, draw, erase, and click on interactive shapes to navigate between pages.

### Routing

Standard Next.js App Router routes live in `app/`:

```
app/
  page.tsx                 ← Landing / home canvas
  about/ contact/ work/    ← Canvas pages
  work/[slug]/page.tsx     ← Individual case study canvas
  blog/[slug]/page.tsx     ← Individual blog post canvas
  rendered/                ← The rendered site (normal HTML pages, see below)
  md/                      ← Markdown versions of the pages (/md/*), built at build time
  not-found.tsx            ← 404 canvas
  error.tsx                ← Error canvas
  meta/                    ← Internal dev pages (not linked publicly)
    typography/
    ui-components/
```

Each canvas page calls `WipCanvas` with a `pageKey` (used for localStorage persistence) and an `onCreateLayout` callback that populates the canvas with the right shapes for that page.

### The rendered site

`app/rendered/**`, `components/rendered/**` and `app/rendered/rendered.css` make up the rendered site: one 540px column, a navigation bar (top on desktop, bottom on phones), and static server-rendered pages. All text comes from the same content modules in `lib/` as the canvas and is shown through the `Content*` components so overrides apply. The design, its rules and the reference study are in `docs/rendered-design.md`.

---

## Key files and what they do

### `components/canvas/WipCanvas.tsx`
The core component. It:
- Mounts a `<QuickdrawCanvas>` (`components/canvas/QuickdrawCanvas.tsx`) with the custom shapes
- Loads/saves canvas state via `useCanvasPersistence`
- Sets the default tool to `browse` on mount
- Listens for pointer events to detect clicks on navigable shapes and routes via Next.js router
- Manages custom cursor cleanup when switching tools

### `components/canvas/BrowserChrome.tsx`
A decorative browser-window frame wrapping the canvas. Renders the top bar with traffic-light dots and a fake URL bar. The canvas itself sits inside this frame.

### `components/canvas/CanvasUI.tsx`
The floating tool toolbar rendered on top of the canvas (a child of `QuickdrawCanvas`, portaled to `body`). Shows tool buttons (Browse, Select, Draw, Text, Eraser) and Undo/Redo/Reset. Fixed-position so it always appears at the bottom center regardless of canvas pan/zoom.

### `components/canvas/useCanvasPersistence.ts`
Persists the canvas (Quickdraw store, page meta and camera) to `localStorage` keyed by `pageKey`. On first load for a page it triggers `onCreateLayout` to place the initial shapes. Exposes `reset()` to wipe and re-run the layout. Saves from the old tldraw version are not loaded: the page starts from its default layout.

---

## Custom shapes

All custom shapes live in `components/shapes/` and are registered in `lib/shapes.ts`. Each shape extends `ShapeUtil` from `lib/canvas`: define the shape's data type, default props, a hit area (`getGeometry`) and a `component()` method returning the JSX to render. Quickdraw selects, moves, resizes and erases them like its own shapes.

| File | What it renders |
|---|---|
| `HandDrawnButtonShapeUtil.tsx` | Clickable button with a hand-drawn SVG border |
| `ProjectCardShapeUtil.tsx` | Card showing project title, description, and thumbnail |
| `AnnotationShapeUtil.tsx` | Hand-written-style text annotation |
| `SkillIconShapeUtil.tsx` | Skill/technology icon badge |
| `TeamAvatarsShapeUtil.tsx` | Row of avatar images for a team |
| `ImagePlaceholderShapeUtil.tsx` | Placeholder image frame |
| `BrowserFrameShapeUtil.tsx` | Mini browser-window frame as a canvas shape |
| `CanvasImageShapeUtil.tsx` | Case study screenshot, served through the Next.js image optimizer at its on-screen size |

Shared behaviour across shapes is centralised in `lib/useShapeInteraction.ts`:
- **`useShapeHover(editor, shapeId, enabled?)`** — tracks hover/press state from the editor's pointer events (`editor.on("event")`), active only in browse mode so shapes don't react when drawing tools are selected.
- **`useFocusOnEdit(isEditing, ref)`** — auto-focuses and selects an input/textarea when editing begins.

Link detection uses `isNavigable(shape)` from `lib/canvasMeta.ts` everywhere (rather than inline `meta.href` checks).

**To add a new shape:**
1. Create `components/shapes/MyShapeUtil.tsx` — copy an existing simple shape as a starting point
2. Register it in the `customShapeUtils` array in `lib/shapes.ts`
3. Add its type/props in `lib/shapeTypes.ts` if needed
4. Place it on the canvas via `editor.createShape(...)` in the relevant layout file

---

## Canvas layouts

Each page's initial content is defined in a `lib/create*Layout.ts` file. These receive an `editor` instance and call `editor.createShape(...)` to position shapes at specific coordinates.

```
lib/
  layoutHelpers.ts             ← Shared constants (CANVAS_W, LEFT_PAD) and helpers (centerCamera, createBackButton)
  createLandingLayout.ts       ← Home page
  createContactLayout.ts       ← Contact page
  createBlogLayout.ts          ← Blog post pages
  createProjectLayout.ts       ← Project pages
  createNotFoundLayout.ts      ← 404 page
  createTypographyLayout.ts    ← Meta: typography
  createUiComponentsLayout.ts  ← Meta: UI components
```

`lib/layoutHelpers.ts` exports the shared canvas width, padding, camera centering, and a `createBackButton` helper used by all layouts that include a "← Back home" button.

**To change what appears on a page**, edit the relevant `create*Layout.ts` file. Shape coordinates are in canvas page space (origin top-left, x increases right, y increases down).

---

## Tools

The toolbar offers `browse`, `select`, `draw`, `text` and `eraser`, plus undo, redo and reset (`hand` is on the `h` key). Quickdraw's other tools (arrow, note, shapes, laser, highlighter) are not offered: their shortcuts are blocked in `lib/canvas/engine.ts`.

- **Browse** is the default. It is Quickdraw's hand tool (drag pans) plus link handling in `WipCanvas.tsx`: clicking a navigable shape triggers Next.js routing. Shapes cannot be selected or modified in this mode.
- **Select, draw, text, eraser, hand** are Quickdraw's own tools. They work on custom shapes too: select, move, resize, delete, erase, undo. Double click (or Enter, or the "Edit text" button on touch screens) edits a shape's text in place. With the text tool, clicking existing text edits it too; clicking anywhere else adds new text.

---

## Custom cursors

Custom SVG cursors are defined in `app/globals.css`. They use the `data-tool` attribute the editor sets on `.cv-container` (e.g. `data-tool="eraser"`). The cursor is set with `!important` on the container and inherited by everything in it, so Quickdraw's own cursors never show for these tools. The toolbar is portaled to `body`, so its buttons keep `cursor: pointer`.

| Tool | Cursor |
|---|---|
| Browse | OS default arrow (pointer over links) |
| Select | Quickdraw default (move and resize cursors over the selection) |
| Draw | Pencil SVG (hotspot at tip, lower-left) |
| Text | T-shape SVG matching the toolbar icon |
| Eraser | Monochrome eraser rectangle SVG |
| Hand | Grab/grabbing hand |

---

## Navigation between pages

Navigable shapes are identified by an `href` field in their `meta` (see `lib/canvasMeta.ts`). In `browse` mode, `WipCanvas` listens for `pointer_up` events, checks if the pointer is over a shape with an `href`, and either calls `router.push(href)` (internal) or `window.open(href, '_blank')` (external). The cursor changes to a pointer when hovering over a navigable shape in browse mode.

---

## Persistence

Canvas state (shape positions, drawn strokes, etc.) is stored in `localStorage` under a key derived from `pageKey`. This means:
- Each page has independent canvas state
- Changes survive page refreshes in the same browser
- The **Reset** button wipes the stored state and re-runs the layout function from scratch

---

## Running locally

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

> Always use `bun` — not `npm`, `yarn`, or `pnpm`.

---

## Deploying

Pushes to `main` auto-deploy to Vercel via the connected GitHub repo. To deploy manually:

```bash
vercel --prod
```

---

## DNS: pointing wip.preritayadav.com to Vercel

The domain `preritayadav.com` is managed externally. The Vercel project is already configured to accept `wip.preritayadav.com`. To activate it, add this record at your DNS provider:

| Type | Name | Value |
|---|---|---|
| `CNAME` | `wip` | `cname.vercel-dns.com` |

Once the record propagates (usually a few minutes to an hour), Vercel will automatically provision a TLS certificate and the site will be live at `https://wip.preritayadav.com`.
