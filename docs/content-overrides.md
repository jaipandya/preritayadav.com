# Content overrides: WIP edits carried to the rendered site

Goal: text edited on the WIP (tldraw) site shows up on the rendered site after the visitor clicks **Build**, in the same browser only. Everyone else sees the defaults from the content modules in `lib/`.

Status:

- **WIP side: done.** Every text a user can edit on the canvas is bound to a content field.
- **Rendered site: wired** in the minimal redesign (`docs/rendered-design.md`). Every content text goes through `components/rendered/Content.tsx`, the case study sections come from `lib/caseStudySections.ts`, and the layout uses the gate. "Wiring the rendered site" below is how it is done and how to keep it that way.

## How it works

```
lib/*Content.ts, lib/workData.ts          defaults (single source of truth)
        │
        ├─► lib/create*Layout.ts          creates canvas shapes, binds editable text to a content key
        │        meta.content = [{ key, prop, base, part?, prefix?, list?, head? }]
        │
        │   user edits text on canvas ──► tldraw snapshot in localStorage  (prerita-wip-<page>)
        │
        │   click Build ─► commitOverridesFromCanvases()
        │        diff every bound shape against its default hash
        │        write only edited fields ─► localStorage "prerita-content-overrides"
        │                                       { key: string | string[] }
        │
        └─► rendered pages                useContent / useContentList → override ?? default
```

Files:

| File | Role |
| --- | --- |
| `lib/contentOverrides.ts` | Keys, `bind` / `bindList` / `withContent` (WIP side), `collectOverrides` / `commitOverridesFromCanvases` (Build), `read/write/clearOverrides`, `resolveContent` / `resolveContentList`. No React. |
| `lib/useContentOverrides.ts` | `useContent(key, fallback)`, `useContentList(key, fallback)`, `useContentReady()` for client components. |
| `components/content/ContentGate.tsx`, `ContentGateHead.tsx` | No-flash gate for the rendered layout (see below). Used in `app/rendered/layout.tsx`. |
| `components/rendered/Content.tsx` | `Content`, `ContentParagraphs`, `ContentList`, `ContentLines`, `ContentEmailLink`, `CardTitle`: the client leaves every rendered page uses for content text. |
| `lib/caseStudySections.ts` | Ordered sections of a case study with the content key and default of every heading and body, per `layoutFormat`. Mirrors `createWorkDetailLayout.ts`; `tests/caseStudySections.test.ts` fails if the two drift apart. |
| `lib/workPageContent.ts` | Default labels of a case study page (headings, Role/Duration/Tools, buttons). |
| `components/ui/BuildOverlay.tsx` | `BuildButton` calls `commitOverridesFromCanvases()` on click and again on "Visit rendered page". |
| `components/canvas/useCanvasPersistence.ts` | `reset` also clears overrides. Older-version canvases are pruned on load. |

Design decisions:

- **Overrides are stored separately from the canvas snapshot.** The snapshot is discarded when a layout version changes; overrides survive. Build only updates keys it saw in a snapshot.
- **Edit detection uses a hash of the default** (`binding.base`), not a copy of the text. A shape that was never edited produces no override, so changing a default in `lib/` still reaches users with an old canvas.
- **Editing text back to the default removes the override.**
- **Scalar fields** are stored as strings. A multi-paragraph field is one string with paragraphs joined by a blank line (`\n\n`).
- **List fields** (bullets) are stored as `string[]` and can be edited, deleted, duplicated, reordered and split (see below).

## Key schema

Keys mirror the property path in the content module.

| Page | Keys |
| --- | --- |
| Work item | `work.<slug>.<path>`. Scalars: `company`, `title`, `tagline`, `summaryTagline`, `role`, `duration`, `tools`, `overview`, `overviewTitle`, `challenge`, `challengeTitle`, `processIntro`, `processTitle`, `process.<i>`, `approach`, `learnings`, `previewText`, `additionalSections.<i>.title`, `additionalSections.<i>.body`. **Lists:** `keyContributions`, `learningPoints`. **Labels:** `labels.<name>` for every name in `workPageLabels` (`back`, `role`, `duration`, `tools`, `overview`, `about`, `challenge`, `problem`, `designProcess`, `process`, `approach`, `whatIDid`, `keyContributions`, `highlights`, `outcome`, `atAGlance`, `learned`, `contactCta`). |
| Landing | `landing.hero.greeting`, `.hero.name`, `.hero.subtitle`, `.hero.cta.label`, `landing.featuredWorkHeading`, `landing.viewAllWorkLabel`, `landing.blogHeading`, `landing.blogPosts.<i>.title`, `landing.blogPosts.<i>.description`, `landing.outsideWork.heading`, `landing.teamsWorkedWith.heading`, `landing.footerClosing`, `landing.footerCta.label`. Featured work cards reuse `work.<slug>.company` and `work.<slug>.tagline`. |
| About | `about.title`, `about.paragraphs.<i>`, `about.outro`, `about.footerText`, `about.cta.label` |
| Contact | `contact.title`, `contact.subtitle`, `contact.email`, `contact.backLabel` |
| Work listing | `workListing.title`, `.subtitle`, `.archiveTitle`, `.archiveSubtitle`, `.backLabel`, `.ctaLabel`, `workListing.cards.<slug>` (card title, default `listingCardTitle(item)` = "Company: Title"), card description reuses `work.<slug>.tagline` |

Rules for headings on a work page: if the work item has its own title field (`overviewTitle`, `challengeTitle`, `processTitle`, `additionalSections.<i>.title`) the heading uses that key. Otherwise it uses `work.<slug>.labels.<name>`, defaulting to `workPageLabels[name]`. Labels are per case study so editing "Overview" on one page does not change the other pages.

Shared keys: a landing or listing card and the work detail page bind the same `work.<slug>.tagline`. If both are edited, an edit beats an unedited copy.

## Lists (bullets)

`keyContributions`, `learningPoints` (and "Highlights" on minimal pages) are list fields. The heading shape and every bullet shape carry the same list key.

On the canvas a user can:

- edit a bullet,
- delete a bullet or all of them (the heading keeps the list known, so `[]` is stored),
- duplicate a bullet (Cmd+D) to add one,
- drag a bullet to reorder (items are read in top-to-bottom order),
- press Enter inside a bullet to split it into two items.

Build reads each list shape's lines, strips the `· ` marker, drops empty lines, orders by position and stores the array if it differs from the default.

Other lists stay text-per-item (items carry non-text data): `process.<i>`, `landing.blogPosts.<i>`, `about.paragraphs.<i>`.

## Bound on the canvas but not rendered

- `work.<slug>.summaryTagline`: only used by the canvas hero card (a decorative card the rendered page does not draw). The rendered page shows `work.<slug>.tagline`.
- `work.<slug>.labels.atAGlance` when a case study has no images (process-heavy canvases show a bare heading). The rendered page skips an empty gallery.

## Rendered fields that are not content keys

Floating bar labels (`Home`, `Work`, `About`, `Let's talk`), the outside work items, the team names and the social labels are fixed or imported without a key, because the canvas has no editable text for them.

## What is not editable (and so has no key)

Shapes that the canvas cannot edit as text: outside-work cards, company logos, social icons, images, illustrations, the decorative browser frame, step numbers. Links (`href`) are not editable either.

## Adding a new editable text shape (WIP side)

1. Put the text in a content module in `lib/` (never hardcode it in the layout).
2. Choose a key by the path rule above.
3. Bind it in the layout creator:
   ```ts
   import { bind, withContent } from "./contentOverrides";

   editor.createShape({
     type: "annotation",
     props: { /* ..., */ text: aboutOutro },
     meta: withContent({ componentType: "annotation", variationId: "about-outro" }, bind("about.outro", aboutOutro)),
   });
   ```
4. `bind(key, value, opts)`:
   - `prop`: shape prop holding the text. Default `text`; `label` for `hand-drawn-button`; `title` / `description` for `project-card`.
   - `part`: paragraph index when one field is split across paragraph shapes.
   - `prefix`: decoration the shape adds around the value that is not content. Avoid it for anything a user could edit: put the label and value in **separate shapes** instead (see Role/Duration/Tools and the process steps).
5. For a list, use `bindList(key, defaultArray, { prefix: "· " })` on every item shape and `bindList(key, defaultArray, { head: true })` on the heading shape.
6. Pass the **value without decoration** to `bind`.
7. Bump the page's layout version (below).

In `createWorkDetailLayout.ts`, use the helpers instead: `section(..., heading(...), text, { key })`, `paragraphs(..., key)`, `bulletList(..., heading, items, keyPath)`, `processTimeline(...)`.

## Wiring the rendered site (for the redesign)

Rendered pages keep importing the content modules; the override is applied on top, on the client.

### 1. Wrap content in `useContent`

Server components cannot read `localStorage`. Create small client components and use them wherever the rendered site shows a content field:

```tsx
// components/rendered/Content.tsx
"use client";
import { useContent, useContentList } from "@/lib/useContentOverrides";

export function Content({ k, fallback }: { k: string; fallback: string }) {
  return <>{useContent(k, fallback)}</>;
}

/** Multi-paragraph field. Overrides use a blank line between paragraphs. */
export function ContentParagraphs({ k, fallback }: { k: string; fallback: string }) {
  const text = useContent(k, fallback);
  return text.split(/\n{2,}/).map((p, i) => <p key={i} style={{ whiteSpace: "pre-line" }}>{p}</p>);
}

/** List field (bullets): the override can have more or fewer items than the default. */
export function ContentList({ k, fallback }: { k: string; fallback: string[] }) {
  const items = useContentList(k, fallback);
  return <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
}
```

Use it like:

```tsx
<h1><Content k="about.title" fallback={aboutTitle} /></h1>
<ContentParagraphs k={`work.${work.slug}.overview`} fallback={work.overview} />
<ContentList k={`work.${work.slug}.keyContributions`} fallback={work.keyContributions} />
<h2><Content k={`work.${work.slug}.labels.approach`} fallback={workPageLabels.approach} /></h2>
```

Rules:

- The `fallback` must be the exact default from the content module (`lib/`), so the server HTML is the default. Do not retype copy in rendered components. Labels come from `workPageLabels`.
- Use the key schema above exactly, including the heading rule (own title field, else `labels.<name>`).
- Work listing card titles: if `workListing.cards.<slug>` is overridden, show it as one title in place of the separate company and title spans.
- Do not use overrides in `<title>`, `metadata`, JSON-LD or the `/md/*` routes. Those stay default.
- If the redesign removes or renames a field, update the key in the layout creator and in this doc. Overrides for unused keys are ignored.

### 2. No flash of default text: `ContentGate`

Overrides live in `localStorage`, so the server can only render defaults. To avoid showing them before the override applies:

```tsx
// app/layout.tsx (root layout, server component)
<html lang="en" suppressHydrationWarning>
  <head><ContentGateHead /> ...</head>

// app/rendered/layout.tsx
<div className="rendered-root ...">
  <ContentGate><main>{children}</main></ContentGate>
  <FloatingBar />   {/* chrome, holds no content text */}
</div>
```

How it works:

- `ContentGateHead` (a style and an inline script) is rendered once in the root `<head>`. It must not live in the rendered layout: that layout is created on the client when a visitor navigates from the WIP site, and React warns about scripts rendered on the client.
- The script adds `content-pending` to `<html>` only when the path is under `/rendered` **and** `prerita-content-overrides` exists. **Visitors without overrides paint immediately and see no change**, and other pages are untouched.
- `suppressHydrationWarning` on `<html>` is needed because the script changes its class before React hydrates (same pattern as next-themes).
- While pending, CSS sets `visibility: hidden` on `[data-content-gate]`. The text stays in the HTML, so crawlers and the no-JS case still get the defaults.
- `ContentGate` removes the class in a layout effect once `useContentReady()` is true. That flips in the same render pass in which `useContent` returns the overrides, so the reveal and the override land together.
- The spinner (`::after` on `<html>`) is scoped with `:has([data-content-gate])`, so a stray class can never leave a spinner stuck. It fades in only after about 200 ms and respects `prefers-reduced-motion`.
- On a client-side navigation from the WIP site the script does not run, the page renders on the client with the overrides already readable, so nothing flashes.

Verified in a browser by sampling every frame, on a hard load (rendered page in an iframe with overrides set) and on the real flow (edit on the canvas, Build, "Visit rendered page"): the first visible frame already shows the override and no frame shows default text.

### 3. Testing checklist

1. Open a WIP page and click Reset.
2. On the canvas: edit a paragraph, a heading and a button label; edit a bullet, duplicate one (Cmd+D), delete one, drag one to reorder. Wait one second (saves are debounced).
3. Click Build, then "Visit rendered page". All edits appear, bullets in the new order, without a flash of the old text.
4. Open the rendered site in a private window. It shows the defaults.
5. Click Reset on the WIP site. The rendered site shows the defaults again.
6. Edit text back to its original wording and Build. The override is removed from `localStorage["prerita-content-overrides"]`.

## Tests

`bun test` runs `tests/contentOverrides.test.ts`. It builds every WIP layout with a fake editor and checks that nothing is overridden until text is edited, then that edits, label changes, bullet add/delete/reorder/split and shared keys turn into the right overrides. Run it after changing a layout creator, a binding or `lib/contentOverrides.ts`. (`tests/` is excluded from `tsconfig.json` because it uses `bun:test`.)

## Layout versions and stale canvases

Saved canvases only get bindings (and new shapes) when they are created, so every page that has bindings carries a layout version in its page key:

- Work items: `layoutVersion` in `lib/workData.ts` (page key `work-<slug>-v<n>`).
- Static pages: `landing-v3`, `about-v3`, `contact-v3`, `work-listing-v3` (set in each `app/**/page.tsx`).

**When a layout creator changes shape structure, bump that page's version** (and bind any new text). Otherwise users keep their old canvas and the new shapes never appear. `useCanvasPersistence` deletes saved canvases of older versions of the same page on load, so Build never merges text from two different layouts.

## Known limits

- Overrides are per browser. There is no server or sync.
- The Build click collects from saved canvases, which are written about 500 ms after the last edit. Collecting again on "Visit rendered page" catches anything the first pass missed.
- An override is stored for fields seen in a canvas. If a page's canvas is discarded (layout version bump), its earlier overrides remain until Reset. The canvas edits themselves are lost, so the WIP page shows the defaults while the rendered site still shows the override.
- Structure other than bullet lists cannot change: process steps, blog posts and about paragraphs keep their count.
- Bullets with text pasted as multiple lines become multiple items.
