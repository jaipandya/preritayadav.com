# preritayadav.com

A work-in-progress portfolio for Prerita Yadav. The site is built around an interactive canvas — instead of a traditional page layout, visitors navigate the portfolio by panning and interacting with a hand-drawn canvas powered by [tldraw](https://tldraw.dev).

Live at: **wip.preritayadav.com**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + global CSS |
| Canvas | [tldraw v4](https://tldraw.dev) |
| Font | Loranthus (custom, self-hosted in `public/fonts/`) |
| Package manager | [Bun](https://bun.sh) |
| Hosting | Vercel (auto-deploy from `main`) |
| Repo | GitHub — `jaipandya/preritayadav.com` |

---

## How the site works

Every route in the app renders a `WipCanvas` — a full-screen tldraw canvas. Instead of HTML content, each page's content (project cards, text, images, buttons) is represented as **custom tldraw shapes** positioned on the canvas. Visitors can pan around, zoom, draw, erase, and click on interactive shapes to navigate between pages.

### Routing

Standard Next.js App Router routes live in `app/`:

```
app/
  page.tsx                 ← Landing / home canvas
  contact/page.tsx         ← Contact canvas
  blog/[slug]/page.tsx     ← Individual blog post canvas
  project/[slug]/page.tsx  ← Individual project canvas
  not-found.tsx            ← 404 canvas
  error.tsx                ← Error canvas
  meta/                    ← Internal dev pages (not linked publicly)
    typography/
    ui-components/
```

Each page calls `WipCanvas` with a `pageKey` (used for localStorage persistence) and an `onCreateLayout` callback that populates the canvas with the right shapes for that page.

---

## Key files and what they do

### `components/canvas/WipCanvas.tsx`
The core component. It:
- Mounts a `<Tldraw>` instance with custom shapes and tools
- Loads/saves canvas state via `useCanvasPersistence`
- Sets the default tool to `browse` on mount
- Listens for pointer events to detect clicks on navigable shapes and routes via Next.js router
- Manages custom cursor cleanup when switching tools

### `components/canvas/BrowserChrome.tsx`
A decorative browser-window frame wrapping the canvas. Renders the top bar with traffic-light dots and a fake URL bar. The canvas itself sits inside this frame.

### `components/canvas/CanvasUI.tsx`
The floating tool toolbar rendered on top of the canvas (via tldraw's `InFrontOfTheCanvas` slot). Shows tool buttons (Browse, Select, Draw, Text, Eraser) and Undo/Redo/Reset. Fixed-position so it always appears at the bottom center regardless of canvas pan/zoom.

### `components/canvas/useCanvasPersistence.ts`
Persists the tldraw store to `localStorage` keyed by `pageKey`. On first load for a page it triggers `onCreateLayout` to place the initial shapes. Exposes `reset()` to wipe and re-run the layout.

---

## Custom shapes

All custom shapes live in `components/shapes/` and are registered in `lib/shapes.ts`. Each shape follows tldraw's `ShapeUtil` pattern: define the shape's data type, default props, and a `component()` method returning the JSX to render.

| File | What it renders |
|---|---|
| `HandDrawnButtonShapeUtil.tsx` | Clickable button with a hand-drawn SVG border |
| `ProjectCardShapeUtil.tsx` | Card showing project title, description, and thumbnail |
| `AnnotationShapeUtil.tsx` | Hand-written-style text annotation |
| `SkillIconShapeUtil.tsx` | Skill/technology icon badge |
| `TeamAvatarsShapeUtil.tsx` | Row of avatar images for a team |
| `ImagePlaceholderShapeUtil.tsx` | Placeholder image frame |
| `BrowserFrameShapeUtil.tsx` | Mini browser-window frame as a canvas shape |

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
  createLandingLayout.ts       ← Home page
  createContactLayout.ts       ← Contact page
  createBlogLayout.ts          ← Blog post pages
  createProjectLayout.ts       ← Project pages
  createNotFoundLayout.ts      ← 404 page
  createTypographyLayout.ts    ← Meta: typography
  createUiComponentsLayout.ts  ← Meta: UI components
```

**To change what appears on a page**, edit the relevant `create*Layout.ts` file. Shape coordinates are in tldraw's canvas space (origin top-left, x increases right, y increases down).

---

## Custom tools

### `lib/BrowseTool.ts`
The default tool. Acts as a read-only viewer — pan/scroll works, cursor is the default arrow, and clicking a navigable shape triggers Next.js routing. Shapes cannot be selected or modified in this mode.

### Built-in tldraw tools (enabled)
The toolbar exposes a curated subset of tldraw's built-in tools: `select`, `draw`, `text`, `eraser`, `hand`. All others are hidden via `uiOverrides` in `WipCanvas.tsx`.

---

## Custom cursors

Custom SVG cursors are defined in `app/globals.css`. They use the `data-state` attribute that tldraw sets on `.tl-container` to know which tool is active (e.g. `data-state="eraser.idle"`).

**Important:** The cursor must be set with `!important` directly on `.tl-container`, not via tldraw's `--tl-cursor` CSS variable. This is because tldraw's `cursor: var(--tl-cursor)` rule is on the inner `.tl-canvas` child element, not the container. Setting it on the container + `* { cursor: inherit !important }` on children ensures the cursor is locked across all child elements.

| Tool | Cursor |
|---|---|
| Browse | OS default arrow |
| Select | tldraw default |
| Draw | Pencil SVG (hotspot at tip, lower-left) |
| Text | T-shape SVG matching the toolbar icon |
| Eraser | Monochrome eraser rectangle SVG |
| Hand | tldraw grab/grabbing hand |

---

## Navigation between pages

Navigable shapes are identified by a `canvasMeta.href` field in their props (see `lib/canvasMeta.ts`). In `browse` mode, `WipCanvas` listens for `pointer_up` events, checks if the pointer is over a shape with an `href`, and either calls `router.push(href)` (internal) or `window.open(href, '_blank')` (external). The cursor changes to a pointer when hovering over a navigable shape in browse mode.

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
