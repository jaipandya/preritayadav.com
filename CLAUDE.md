# CLAUDE.md

## Package Manager

Always use `bun` instead of `npm`, `yarn`, or `pnpm` for all operations (install, run, build, etc.).

## Copywriting Rules

**Never use em dashes (—) in any copy.** This applies to all user-facing text: content modules in `lib/`, case study data, page metadata, sr-only HTML, markdown endpoints, and any new strings you write. Rewrite the sentence instead, using a period, comma, colon, parentheses, or "and"/"but" as fits. Do not swap in a spaced en dash or double hyphen as a workaround.

## Architecture Principles

### Reuse before creating

Always check for existing shared hooks, helpers, and components before writing new code. Build on top of what already exists:

- **Shape interaction hooks** — `lib/useShapeInteraction.ts` exports `useShapeHover` (browse-only hover/press tracking) and `useFocusOnEdit` (auto-focus on edit). Use these in any new shape that needs hover effects or inline editing.
- **Link detection** — Always use `isNavigable(shape)` from `lib/canvasMeta.ts` to check if a shape has a link. Never check `shape.meta.href` inline.
- **Layout helpers** — `lib/layoutHelpers.ts` exports `CANVAS_W`, `LEFT_PAD`, `centerCamera`, and `createBackButton`. Use these in all layout creators instead of duplicating constants or boilerplate.
- **Page shell** — `components/PageShell.tsx` wraps every page with the common structure: accessible nav, sr-only semantic HTML article, and tldraw canvas. Use this for any new page instead of assembling the pieces manually.

### Single source of truth for page content

All page text content lives in shared data modules under `lib/`:

- `lib/landingContent.ts` — hero, blog posts, design principles, skills, testimonial, footer
- `lib/aboutContent.ts` — title, paragraphs, outro, footer text, illustration placement
- `lib/contactContent.ts` — title, subtitle, email, social links
- `lib/workListingContent.ts` — headings and subtitles for the work listing page
- `lib/workData.ts` — all work/project case study content (already existed)
- `lib/workPageContent.ts` — default labels of a case study page (headings, Role/Duration/Tools, buttons)

Both the **tldraw layout creators** (`lib/create*Layout.ts`) and the **semantic HTML layers** (in each `app/*/page.tsx`) import from these modules. This ensures crawlers, screen readers, and the visual canvas all render the same content.

**When adding or changing content:**
1. Edit the relevant content module in `lib/` — never hardcode text in a layout creator or page component.
2. Both the canvas and the hidden HTML will automatically pick up the change.
3. If adding a new page, create a content module first, then wire it into both the layout creator and the page's sr-only `<article>`.

### Content overrides (WIP edits reach the rendered site)

Text edited on the WIP canvas is carried to the rendered site (same browser only) through `lib/contentOverrides.ts`. Details, the key schema and how the rendered site is wired are in `docs/content-overrides.md`.

- Every text shape a layout creator makes from a content module must bind its text with `withContent(meta, bind(key, value, opts))`. Bullet lists use `bindList` on the heading and every item. Keys mirror the field path in the content module (`work.<slug>.overview`, `about.outro`).
- Anything a user can edit on the canvas must have a content-module field and a binding, including labels and button text. If it has no field, add one to a `lib/*Content.ts` module.
- Do not put editable decoration in a shape (like a label plus value in one text). Use separate shapes.
- When a layout creator changes shape structure, bump that page's layout version (`layoutVersion` in `workData.ts`, or the `-vN` page key on static pages).
- Run `bun test` after changing layout creators, bindings or `lib/contentOverrides.ts`.
- New rendered-site copy must come from `lib/` and be shown through the `components/rendered/Content.tsx` components (`Content`, `ContentParagraphs`, `ContentList`, ...), inside the `ContentGate` (see the doc). Case study headings come from `lib/caseStudySections.ts`, which must match the canvas labels per layout format (`bun test` checks it). The rendered design is described in `docs/rendered-design.md`.

### Fake build log stays in sync with /rendered

The "build agent" log shown when switching to the rendered site (`BUILD_LINES` and `CACHED_LINES` in `components/ui/BuildOverlay.tsx`) narrates how `/rendered` was built: content counts, layout and design tokens (column width, fonts, colours), components, pages, routes and page counts. It must not drift from what `/rendered` actually is.

Update it when a change to `/rendered` (or the content it reads) makes a line wrong or adds or changes something major. Examples: a work item, page, route or component is added or removed (counts, `[n/N]` page steps, static generation list), the typeface or colour tokens change, the layout or navigation pattern changes. Skip it for small tweaks (spacing, copy edits, bug fixes) that no log line refers to. When you edit it, follow the copywriting rules (no em dashes) and check the numbers against the code, not memory.

### Component decomposition

When building or modifying features, keep components small and focused. Extract shared logic into hooks (`lib/`) and shared UI into components (`components/`). If you find yourself copying code between shape utils or layout creators, extract it into a shared module first.

### Markdown endpoints are pre-rendered at build time

The `/md/*` routes (served from `app/md/[...path]/route.ts`) are statically generated via `generateStaticParams` on every `bun run build`. This means markdown regenerates from the content modules automatically — no runtime rendering, no stale cache.

**When adding a new top-level markdown path** (e.g. `/md/blog`): update both `generateMarkdownForPath` in `lib/markdownGenerators.ts` and the `generateStaticParams` array in `app/md/[...path]/route.ts`. Work slug paths are enumerated automatically from `workData.ts`, so adding a new case study needs no route changes.
