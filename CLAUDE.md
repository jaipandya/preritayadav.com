# CLAUDE.md

## Package Manager

Always use `bun` instead of `npm`, `yarn`, or `pnpm` for all operations (install, run, build, etc.).

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

Both the **tldraw layout creators** (`lib/create*Layout.ts`) and the **semantic HTML layers** (in each `app/*/page.tsx`) import from these modules. This ensures crawlers, screen readers, and the visual canvas all render the same content.

**When adding or changing content:**
1. Edit the relevant content module in `lib/` — never hardcode text in a layout creator or page component.
2. Both the canvas and the hidden HTML will automatically pick up the change.
3. If adding a new page, create a content module first, then wire it into both the layout creator and the page's sr-only `<article>`.

### Component decomposition

When building or modifying features, keep components small and focused. Extract shared logic into hooks (`lib/`) and shared UI into components (`components/`). If you find yourself copying code between shape utils or layout creators, extract it into a shared module first.
