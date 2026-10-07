# Rendered site: design spec and redesign plan

Scope: everything under `/rendered` (`app/rendered/**`, `components/rendered/**`, `app/rendered/rendered.css`).
The WIP (tldraw) site is out of scope except where a content field changes (see "Content wiring").

Status: **implemented**, pending review. See "6. Decisions" for the answers to the open questions.

## 1. Background: why the previous design was replaced

The previous rendered site (measured at 1440 wide, `/rendered`: 5012px tall landing page):

- Heavy: grain overlay, a hero illustration with a drop shadow, 693 lines of inline SVG illustrations, three card styles, a sticky uppercase top nav with a black CTA, a floating Sketch button.
- Two type families (Libre Baskerville + Manrope) loaded from Google Fonts with a render-blocking `@import`.
- Two content widths (840 and 1080) that do not line up with each other. Content jumps between pages.
- Every page is a client component using `motion/react` for entrance animations. Content is hidden (opacity 0) on first paint until animations run.
- Uppercase, letter-spaced labels everywhere. It reads as "template", not as a person.

Goal: a **minimal, quiet, typographic** portfolio. One narrow column, almost no chrome, content does the talking. Inspiration: https://www.alexkehr.com/.

## 2. Reference study: alexkehr.com

Measured in Chrome with computed styles at 1440 wide (Tailwind CSS site). Pages inspected: home, a project page (`/projects/superlocal`), a "thought" article (`/thoughts/grounding-ai-in-the-real-world`). The window would not resize below desktop, so every **mobile value below comes from the site's Tailwind classes** (`text-[33px] sm:text-[42px]`, `pt-12 sm:pt-18`, `px-6`), not from a measurement at 390px. Verify the mobile behavior on a real phone viewport during implementation.

### 2.1 Page width and layout

| Thing | Value |
| --- | --- |
| Container | `max-w-[540px] mx-auto px-6` = 540px wide, **492px of content**, 24px side padding |
| One column everywhere | Home, project and article pages all use the same 540px container. No wide breakpoint. |
| Top padding | 48px mobile, 72px (`sm:pt-18`) on home; 64px / 96px on article pages |
| Bottom padding | 128px (`pb-32`), clears the floating bar |
| Background | `#ffffff`, body text `#1a1a1a` |
| Page height | Home about 1800px. Short, one scroll. |
| Chrome | **No header.** A floating bar at the bottom and a floating round back button (top left, appears after scrolling on detail pages) |

### 2.2 Typography

Family: `"Helvetica Neue", Helvetica, Arial, sans-serif` for everything, plus a monospace (`SF Mono`) used only for small labels and dates. No serif.

| Role | Size / weight | Line height | Tracking | Color |
| --- | --- | --- | --- | --- |
| Home name (h1) | 42px (33px mobile) / 700 | 44px (1.05) | -1.47px (-0.035em) | `#000` |
| Home tagline | 16px / 400 | 24px | -0.08px | `#1a1a1a` |
| Home sub tagline | 13px / 400 | 20px | normal | `#999` |
| Section label ("Latest") | 13px **mono** / 400 | 19.5px | -0.325px (tight) | `#c0c0c0` |
| Row title | 16px / 500 | 24px | normal | `#1a1a1a` |
| Row subtitle | 14px / 400 | 21px | normal | `#666` |
| Row date / years | 12px mono | 18px | normal | `#ccc` |
| Separator dot | 14px | | | `#ccc` |
| Project h1 | 28px / 700 | 35px | -0.84px (-0.03em) | `#000` |
| Project lede | 19px / 500 | 29.5px | normal | `#1a1a1a` |
| Project body | 15px / 400 | 25.5px (1.7) | normal | `#666` |
| Article body | 15px / 400 | 26.25px (1.75) | normal | `#444` |
| Article subtitle | 15px / 400 | 24px | normal | `#999` |
| List item | 15px / 400 | 22.5px | normal | `#444` |
| Caption | 13px / 400 | 17.9px | normal | `#999`, centered |
| Badge | 11px / 500 | | | per status, see below |

Takeaways: only **three weights** (400, 500, 700). Hierarchy comes from size, color (`#000` > `#1a1a1a` > `#666` > `#999` > `#c0c0c0`) and one monospace voice for metadata. Display type is tightly tracked, body is untouched.

### 2.3 Whitespace and rhythm

- Hero: h1 at y=72, tagline 12px below, sub tagline 4px below. About 80px of air before the first section label.
- **Section = 64px top margin (`mt-16`), label, 20px gap (`mb-5`), then the list.** Sections are never boxed or divided by rules. Space is the divider.
- List rows: `py-3` (12px) vertical padding, rows are 68px tall (home) or 48px (text-only). Rows have `-mx-3 px-3` so the hover background bleeds 12px outside the text column while the text stays on the column edge.
- Row hover: `hover:bg-[#fafafa]`, `rounded-lg` (8px), `transition-colors duration-150`. That is the entire hover vocabulary.
- Project page: back link, then a 44px logo tile beside the h1, lede 32px below, media 40px below the lede, body paragraphs about 16px apart, a mono label ("Highlights") 48px before each new block, bullets about 8px apart.
- Gap between icon tile and text: 14px. Row title to subtitle: about 3px.

### 2.4 Components

- **Mark tile**: 36px square (44px on project pages), `rounded-[10px]`, `#f0f0f0` placeholder, logo image inside (`object-cover`). A loading shimmer is just the grey tile.
- **Row**: `[tile] [title + subtitle . years]` on the left, optional thumbnail pair or a small `↗` on the right. Whole row is one link.
- **Badge**: 11px / 500, `2px 8px`, full radius. Acquired = `#946800` on `#fef3cd`. New = `#34785a` on `#e8f5ee`. In Development = grey.
- **Floating bar**: `fixed bottom-5`, centered, same 540px / `px-6` container, inner pill `bg-white/70 backdrop-blur-xl rounded-2xl px-3 py-2`, `border border-white/60`, `ring-1 ring-black/[0.04]`, `shadow 0 2px 20px rgba(0,0,0,.06)`. Left: three 20px social icons in `#999`. Right: "Let's chat ↗" at 13px / 500 `#999`.
- **Media**: `rounded-2xl` (16px), full column width (492px), caption below at 13px `#999`.
- **Bullets**: small `#ccc` dot, 15px `#444`.
- **Back**: arrow + "Back", 13px `#999`, at the top of detail pages.
- **Media tray** (seen on `/projects/foursquare`): product screenshots sit inside a light grey rounded tray (`#f5f5f7`-ish, 16px radius, about 20px padding) with the screenshots inside it at a smaller radius. The tray makes dark or odd-shaped mockups feel intentional on a white page. Video/hero media is a plain full-width block with 16px radius and a centered 13px caption.
- **Links block**: a mono "Links" label, then plain rows with a small `↗` ("Superlocal on the App Store").
- **Inline emphasis**: body copy may contain bold phrases (500/600 weight, darker color). No italics, no colored text.

### 2.5 Motion

Almost none. No scroll-triggered entrances, no parallax, no keyframes found. Only the 150ms row hover color and the bar's blur. Quiet is the point.

### 2.6 What makes it feel premium (the principles to copy)

1. One column, one width, everywhere.
2. Almost no color. Grey ramp plus tiny semantic badges.
3. Hierarchy by size and grey value, not by boxes, rules or uppercase.
4. Generous, consistent vertical rhythm (64px between sections, 12px row padding).
5. Real imagery (logos, product shots) is the only decoration.
6. A monospace micro-voice for labels and dates gives the page a "designer's notebook" tone.
7. Persistent chrome is a single small floating bar, not a header.

## 3. Design for preritayadav.com

### 3.1 Principles

Copy the structure and restraint of the reference, keep Prerita's content. Do not copy the look 1:1: use our own type and a hint of warmth where it costs nothing.

### 3.2 Layout tokens

| Token | Value |
| --- | --- |
| `--r-col` | `540px` outer, 24px side padding, **492px text column**. Same on every page. |
| Padding top | 48px mobile, 72px from `sm` (640px). Article pages 64 / 96. |
| Padding bottom | 128px (clears floating bar) |
| `--r-section-gap` | 64px |
| `--r-label-gap` | 20px |
| Row padding | 12px vertical, 12px bleed (`-12px` margin, `12px` padding) |
| Radii | row 8px, tile 10px, media 16px, bar 16px, badge 999px |
| Breakpoint | one, `sm` = 640px. Below it the same column fills the screen with 24px gutters. |

### 3.3 Color

Light only for now (the reference is light only; dark mode is out of scope for this pass).

```
--r-bg:        #ffffff
--r-ink:       #000000   h1 only
--r-text:      #1a1a1a   titles, tagline, row title
--r-body:      #666666   long-form paragraphs, row subtitle (5.7:1, AA)
--r-body-dark: #444444   list items, About paragraphs
--r-muted:     #737373   anything meaningful and light: captions, sub taglines, bar links,
                         back link, greeting, section labels, years (4.7:1, AA)
--r-hair:      #cccccc   decorative only: bullet dots, separators, tile placeholder edge
--r-wash:      #fafafa   row hover
--r-tile:      #f0f0f0   logo tile placeholder
badge pairs:   gold #946800 / #fef3cd,  green #34785a / #e8f5ee,  grey #666 / #eee
```

Contrast: the reference uses `#999`, `#c0c0c0` and `#ccc` for real text (about 2.8:1, 1.8:1 and 1.6:1 on white), which fails WCAG AA. **We do not copy that.** Every piece of text that carries meaning is `#737373` or darker. `#ccc` is only for decorative marks (bullet dots, separators). The look stays light because the ramp is still `#000 > #1a1a1a > #666 > #737373`, just with a floor.

### 3.4 Type

One sans family plus one mono, both self-hosted through `next/font` (removes the render-blocking Google `@import`, no layout shift).

- Sans: **Geist** (variable, 400/500/700). Neutral, Helvetica-like at small sizes, consistent on every OS. The reference leans on system Helvetica Neue, which is not on Windows/Android, so a self-hosted font gives the same look to everyone.
- Mono: **Geist Mono** (400) for section labels, years, metadata.
- Drop Libre Baskerville and Manrope from the rendered site.

Scale (the reference numbers raised by 1 to 2px after a readability review: 15px body and 13px labels were too small on a laptop and a phone):

| Token | Size / lh / tracking / weight |
| --- | --- |
| `display` (home name) | 48px (36 mobile) / 1.05 / -0.035em / 700 |
| `title` (case study h1) | 32px / 1.25 / -0.03em / 700 |
| `lede` | 21px / 1.55 / 0 / 500 |
| `intro` (home subtitle) | 18px / 1.5 / 0 / 400 |
| `body` | 17px / 1.7 / 0 / 400 (list items 16px) |
| `row-title` | 17px / 1.5 / 0 / 500 |
| `row-sub` | 15px / 1.5 / 0 / 400 |
| `small` | 15px / 1.5 / 0 / 400 |
| `label` (mono) | 14px / 1.5 / -0.025em / 400 |
| `micro` (mono, years) | 13px / 1.5 / 0 / 400 |
| `badge` | 11px / 1 / 0 / 500 |

Rules: no uppercase transforms, no letter-spacing on body, no italics (the About outro is `lede`). `text-wrap: balance` on h1 and lede, `text-wrap: pretty` on body. `font-variant-numeric: tabular-nums` on years.

### 3.5 Components (small, in `components/rendered/`)

| Component | Notes |
| --- | --- |
| `Content`, `ContentParagraphs`, `ContentList`, `ContentLines`, `ContentEmailRow`, `CardTitle` | Client leaves over `useContent` / `useContentList`; the only client components that show content text (see section 4). |
| `Mark` + `markSources.ts` | 36 / 44px logo tile, one white frame with a hairline ring. Marks are cropped to the emblem where there is one and get about 18% air (`pad`). The portfolio uses `/icon.svg`; only a company with no logo shows its initial, dark on `#f0f0f0`. The broken `epic-wiki.png` and `toppr-wiki.png` (HTML error pages saved as PNG) were deleted. |
| `TeamLogos` | Home team logos, see 3.7. |
| `SocialIcon` | LinkedIn, X, Medium and envelope icons, shared by the bar and the contact page. |
| `FloatingBar` | The navigation bar. See 3.6. |
| `FloatingBack`, `BackLink` | `BackLink` renders the stored label as is (it already has "←"), no icon, with a 44px hit area. `FloatingBack` is the round button that appears after scrolling on case studies. |

Layout primitives are CSS classes, not components: `.r-col` (column), `.r-label` (mono section label), `.r-row` (link row), `.r-prose`, `.r-list`, `.r-steps` and `.r-tray` (media tray, wraps the existing `CaseStudyGallery`, restyled with CSS only). There are no status badges yet.

### 3.6 Navigation: the floating bar

The reference has social icons and "Let's chat" in a floating bar at the bottom. We also need Home / Work / About, and (decision after review) the bar sits **at the top from 640px up**, where people look for navigation, and **at the bottom on phones**, within thumb reach.

```
┌──────────────────────────────────────────────────────┐
│  Home  Work  About  [pencil] │ [in] [M] [X]  Let's talk ↗ │   fixed, 540px wide
└──────────────────────────────────────────────────────┘
```

- One `<nav aria-label="Primary">` contains everything, including the CTA (axe flagged the CTA when it sat outside a landmark). It comes first in the DOM, after the skip link, so keyboard order matches the visual order on desktop.
- Left: `Home`, `Work`, `About` text links (13px / 500, `#666`, active `#1a1a1a`, `aria-current="page"`), then a pencil icon with `aria-label="Switch to sketch version"` (maps `/rendered/x` to `/x`).
- Right: `Let's talk` and an `aria-hidden` arrow, linking to the contact page. Labels are fixed chrome from `lib/renderedChrome.ts`, not content keys (see 4.5).
- Social icons (LinkedIn, Medium, X, from `socials`) show from 640px up, with an accessible name that includes "(opens in a new tab)". Below that they are hidden so the bar fits; checked down to 320px.
- Styling: `rgba(255,255,255,.86)` with 24px backdrop blur (falls back to `.95` without `backdrop-filter`), 16px radius, 1px white border, hairline ring, soft shadow. Position: `top: 16px` from 640px, otherwise `bottom: max(20px, env(safe-area-inset-bottom))`.
- The page content starts below the bar: `padding-top: 112px` from 640px; on phones `padding-bottom: 128px` so the bar never covers the last row.
- The round floating back button on case studies sits at `top: 84px` below the bar and only shows from 960px, where there is room beside the column.

### 3.7 Pages

Labels that already contain an arrow glyph in `lib/` (`labels.back` "← Back to work", `workListing.backLabel` and `contact.backLabel` "← Back home", `landing.viewAllWorkLabel` "View all work →") are rendered **exactly as stored**. Components must not add a second arrow icon. `BackLink` and `Row` have no built-in icon. The only arrows we draw ourselves are the `↗` on external links (blog posts, socials, Let's talk), which are not content fields.

#### Home `/rendered`

```
Hello!                         mono 13px #737373           landing.hero.greeting
I'm Prerita.                   display 42/700 (the h1)     landing.hero.name
Product Designer & Creative..  16px #1a1a1a                landing.hero.subtitle, line 1
Crafting intuitive...          13px #737373                landing.hero.subtitle, line 2

Featured work                  section label               landing.featuredWorkHeading
[mark] Fitpass  Partner App..                              work.<slug>.company, work.<slug>.title
       Turning a fragmented...                             work.<slug>.tagline
...
View all work →                row, 15px #737373           landing.viewAllWorkLabel

Writing & ideas                section label               landing.blogHeading
Hatch Conference 2023   ↗      row, title + description    landing.blogPosts.<i>.title / .description
...
Outside work                   section label               landing.outsideWork.heading
Mentoring at 10kdesigners      text rows, no tile          (plain lib import, see note)
...
Teams I have worked with       section label               landing.teamsWorkedWith.heading
[logo] [logo] [logo] ...       8 logos, up to 34px, grayscale   (plain lib import)

Let's build something great.   lede                        landing.footerClosing
[ Say hello → ]                dark button, 16/500         landing.footerCta.label
```

- Hero: `Hello!` and `I'm Prerita.` are two fields today. The greeting renders as a small mono line above the name, so both stay editable. The name is the page `h1`. `<title>` and metadata stay as they are.
- Home loses: hero illustration, testimonial ("Kind words", decision 1), design principles, skills strip. None of these is editable on the WIP canvas (no keys), so no override is lost; they stay in `lib/landingContent.ts` for the canvas and the sr-only HTML.
- Outside work: three items, each with its number (mono, `#737373`), title (17/500), subtitle (15/`#666`) and the full `description` (16/1.65, `#666`), the same text as the WIP card. The order follows `lib/landingContent.ts` (travel, mentoring, tinkering). Their text has no content keys (not editable on canvas), so they import straight from that module. The wobbly line illustrations belong to the sketch and are not shown. Each item has a 112px (80px on phones) watercolor thumbnail on the right, `public/rendered/generated/outside-<illustration>.webp` (about 7 KB each), chosen by the item's `illustration` field. They are painted by `scripts/generate-watercolors.py` (OpenCV: glazed washes with wobbly edges, pigment pooling, paper grain, fading into white so there is no box). Edit the scenes in that script and re-run it to change them. Decorative, `alt=""`.
- Teams (`components/rendered/TeamLogos.tsx`): a fixed 4 by 2 grid, left aligned, so eight logos fill it exactly with no orphan row. Logos are sized by visual weight, not by one height: height shrinks with the square root of the aspect ratio (clamped 18 to 34px), so a wide wordmark and a square icon take up about the same area. One ink: `grayscale(1) brightness(.7) contrast(1.2)`, 60% opacity and `mix-blend-mode: multiply` (drops any white background). No hover state, because they are not links. Each logo has its intrinsic size in a map so nothing shifts while loading, and the company name is the `alt`. Source files are cropped marks in `public/logos/mark/`: taglines removed from Byju's and EMA, Fitpass as a wordmark, 10kdesigners as its lilac "10K" only (the rest of the wordmark is white, made for dark backgrounds), and zkAGI uses the dark mark in `logos/square/zkagi.png` because `logos/zkagi.svg` is all white. Crop boxes were measured from the real element bounds in a browser; the Next image cache keys on URL, so a changed file needs a new name.

#### Work `/rendered/work`

```
← Back home                    13px #737373                workListing.backLabel
Work                           h1 32/700                   workListing.title
Product design, UX...          16px #666                   workListing.subtitle

[mark] Fitpass  Partner App Redesign                       workListing.cards.<slug> (else company + title)
       Turning a fragmented...                             work.<slug>.tagline
...
Archive                        section label               workListing.archiveTitle
Earlier projects and...        14px #737373                workListing.archiveSubtitle
rows...
Contact me                     closing row                 workListing.ctaLabel
```

- The old design's "Featured & Recent" group label is hardcoded and has no field. It is dropped: the first list sits directly under the subtitle. No new copy needed.
- Every WIP-editable field on this page stays visible, including `backLabel` and `ctaLabel`.

#### Case study `/rendered/work/[slug]`

Header (one block, mirrors the canvas order: back, company, title, tagline, Role/Duration/Tools):

```
← Back to work                      13px #737373            work.<slug>.labels.back
[44px mark]  Fitpass                13px #737373            work.<slug>.company
             Partner App Redesign   h1 32/700               work.<slug>.title
Turning a fragmented...             lede 19/500             work.<slug>.tagline
Role   Duration   Tools             mono label 12px         work.<slug>.labels.role / .duration / .tools
Product Designer  6 months  Figma   14px #1a1a1a            work.<slug>.role / .duration / .tools
```

The project **title is the h1** and the company is the small line (the reference's h1 is a company name; ours is a project). Role, Duration and Tools label and value are separate elements, as on the canvas.

Body: one column, each section = mono label + body. No cards, no boxes. Process steps are a numbered mono list ("01  Interface Audit"), not pills.

**Section keys must mirror the canvas.** The WIP layout creator (`lib/createWorkDetailLayout.ts`) picks label names per `layoutFormat`, and the rendered page must use the same name for the same section, otherwise editing a heading on the canvas has no effect on the rendered page. Build one `caseStudySections(work)` helper in `lib/` (pure data, no React) that returns the ordered sections for an item and is used by the rendered page. Keep it next to `workPageContent.ts` and unit test it against the canvas table below.

"Heading key" follows the rule: the item's own title field if it has one and the format uses it, otherwise `labels.<name>`. All keys are prefixed `work.<slug>.`.

| Section | process-heavy | before-after | preview | narrative | standard | minimal |
| --- | --- | --- | --- | --- | --- | --- |
| Overview | `overviewTitle`/`labels.overview` ; `overview` | same | same | same | same | `labels.about` ; `overview` |
| Challenge | `challengeTitle`/`labels.challenge` ; `challenge` | `challengeTitle`/`labels.problem` ; `challenge` | not shown | `challengeTitle`/`labels.challenge` ; `challenge` | same as narrative | not shown |
| Preview text | not shown | not shown | `previewText` (no heading) | not shown | not shown | not shown |
| Design process intro | `labels.designProcess` ; `processIntro` (if present) | not shown | not shown | not shown | not shown | not shown |
| Process steps | `processTitle`/`labels.process` ; `process.<i>` | same | not shown | same | same | not shown |
| Approach | `labels.approach` ; `approach` | same | not shown | same | same (only if non-empty) | `labels.whatIDid` ; `approach` |
| Contributions (list) | `labels.keyContributions` ; `keyContributions` | same | not shown | same | same (only if non-empty) | `labels.highlights` ; `keyContributions` |
| Additional sections | not shown | not shown | not shown | not shown | `additionalSections.<i>.title` ; `.body` | not shown |
| Outcome | `labels.outcome` ; `outcome` | same | not shown | same | same | same |
| At a glance | `labels.atAGlance` if `showAtAGlance` | `labels.atAGlance` if images | not shown | not shown | `labels.atAGlance` if `showAtAGlance` | not shown |
| What I learned | `labels.learned` ; `learnings` | same | not shown | same | `labels.learned` ; `learningPoints` (list) else `learnings` | not shown |
| Contact CTA | `labels.contactCta` | same | same | same | same | same |

Meta (Role/Duration/Tools) and the Back label appear in every format. `summaryTagline` is only used by the canvas hero card (a decorative card the rendered page does not draw), so the rendered page does not show it. This is recorded in `docs/content-overrides.md` as "bound on canvas, not rendered" (brief item 9). The old rendered page showed `processIntro` for every format and the contributions heading as "Key Contributions" for all; both change to match the canvas.

Other case study rules:

- Gallery: a **media tray** as on the reference's Foursquare page. Tray is `#f5f5f5`, 16px radius, 16px padding, 40px above. Images inside keep their aspect ratio with a 10px radius and a 1px `rgba(0,0,0,.06)` ring. Rows of two or three images (the existing `row` field) sit side by side inside the tray with 12px gap. The existing `CaseStudyGallery` is reused and restyled via CSS only; images link to the full-size file. The tray fits the 492px column (no wider exception).
- Prev / next case studies at the bottom are two plain rows showing `CardTitle`-style company + title. They have no label of their own.
- `<title>`, metadata, JSON-LD and `/md/*` stay on defaults.

#### About `/rendered/about`

- h1 = `about.title` (32/700). Five paragraphs as `Prose` (17px, `#444`, 16px apart). Outro as `lede`. Footer text as body, then a dark button (`.r-btn`, same as the home footer) with `about.cta.label` ("Say hello", arrow added by CSS).
- The three scene illustrations are not shown (`illustrations` in `lib/aboutContent.ts` stays for the WIP canvas).
- **Portrait** (decision 2): between the h1 and the first paragraph, one image inside the media tray at the top of the page, 16:12, `alt` describing it. It uses the existing illustrated portrait `public/rendered/generated/about-portrait.webp` (1000 by 750, about 44 KB, down from a 1.6 MB PNG that made the page wait) until a photo is supplied. The source path is a single constant in the About page so swapping to a real photo is a one-line change. The image is loaded with `priority` and explicit dimensions so there is no layout shift.

#### Contact `/rendered/contact`

- `contact.backLabel` ("← Back home") as the small top link, then h1 = `contact.title`, subtitle (`contact.subtitle`; the newline joins to a space), then one list of rows with the same logo-tile pattern as the Work list: an envelope tile with the email (`contact.email`, `mailto:`), and LinkedIn, Medium and X, each with an icon tile, the name, the handle in grey underneath (derived from the URL, for example `linkedin.com/in/preritayadav`) and a small SVG arrow (`ExtArrow.tsx`) on the right. Labels and URLs come from `socials` and are not editable. The icons are shared with the floating bar (`SocialIcon.tsx`).

### 3.8 Motion and interaction

- Row hover: background to `#fafafa`, 150ms ease. Link text color change 150ms.
- Page load: no stagger. One optional 200ms opacity fade of the whole `data-content-gate` wrapper, `@media (prefers-reduced-motion: no-preference)` only, and it must not conflict with the ContentGate (the gate only toggles `visibility`).
- Floating back button: fade in at 200ms after 200px scroll.
- No scroll-triggered entrances. Remove `motion/react` from the rendered tree. Pages become server components (smaller bundle, content in HTML at first byte).

### 3.9 Accessibility

- Semantic structure: one `h1` per page, labels as `h2` (styled mono), lists as `ul`/`ol`. One `<nav aria-label="Primary">` holds the whole bar, one `<main id="main">`; current page `aria-current="page"`. A "Skip to content" link is the first focusable element and appears on focus.
- Every page has its own `<title>` (Work, About, Contact, and each case study); the home page keeps the site title.
- Links that open a new tab say so: visually hidden "(opens in a new tab)" text, or an `aria-label` for icon links.
- No text is hidden or clamped: descriptions show in full, so text spacing and zoom (WCAG 1.4.12, 1.4.4) cannot cut content off.
- Hidden controls are really hidden: the floating back button uses `visibility: hidden` until it shows, so it is not focusable.
- Visible focus ring on every link and row: `outline: 2px solid #1a1a1a; outline-offset: 2px`, rows use `outline-offset: -2px` so the ring is not clipped.
- Tap targets 44px minimum: rows are 48px+, bar links and the back link have 44px hit areas (icons are 40 by 44).
- Contrast: all text is AA (4.5:1) or better. Nothing lighter than `#737373` is used for text. `#ccc` is decorative only.
- `prefers-reduced-motion` respected (fade removed, spinner stops spinning).
- Images have `alt`. Logo tiles inside rows are decorative (`alt=""`) because the company name is adjacent text.

## 4. Content wiring (content overrides)

Follows `docs/content-overrides.md` exactly. Decisions for this redesign:

### 4.1 Components

`components/rendered/Content.tsx` (client): `Content`, `ContentParagraphs`, `ContentList` (snippets from the doc; `ContentList` takes `className`), plus:

- `ContentLines`: splits the value on `\n`; the first line is primary text and the remaining lines secondary. Used by `landing.hero.subtitle` (two-line default) and `contact.subtitle` (joined with a space).
- `CardTitle`: reads `useContentOverrides()`. If `workListing.cards.<slug>` has an override it renders that as one `<span>`; otherwise it renders `<span>{company}</span><span>{title}</span>` (brief item 6). Fallbacks are the exact `item.company` and `item.title`. Home rows and prev/next rows use `Content` on `work.<slug>.company` and `work.<slug>.title`; only the Work listing uses `CardTitle`.
- `ContentEmailRow`: renders `contact.email` as text and builds `mailto:` from the same resolved value, so a changed email changes both.

Pages and layouts stay server components. Only these leaf components are client components. Fallback props are always the exact default from the `lib/` module, never retyped copy.

### 4.2 Key map per page

Keys exactly as in the doc's key schema. Case study heading and body keys come from the per-format table in 3.7.

| Page | Fields rendered through `Content*` | Plain (no content key) |
| --- | --- | --- |
| Home | `landing.hero.greeting/name/subtitle`, `landing.featuredWorkHeading`, `work.<slug>.company/title/tagline`, `landing.viewAllWorkLabel`, `landing.blogHeading`, `landing.blogPosts.<i>.title/description`, `landing.outsideWork.heading`, `landing.teamsWorkedWith.heading`, `landing.footerClosing`, `landing.footerCta.label` | outside work item text, team logos and names, blog hrefs |
| Work | `workListing.title/subtitle/archiveTitle/archiveSubtitle/backLabel/ctaLabel`, `workListing.cards.<slug>`, `work.<slug>.tagline` | company marks |
| Case study | the table in 3.7, plus `labels.back`, `labels.role/duration/tools`, `labels.contactCta`, `role`, `duration`, `tools`, `company`, `title`, `tagline` | `number`, gallery images, prev/next hrefs |
| About | `about.title`, `about.paragraphs.<i>`, `about.outro`, `about.footerText`, `about.cta.label` | |
| Contact | `contact.title`, `contact.subtitle`, `contact.email`, `contact.backLabel` | social labels and URLs |

Every key that has a WIP canvas binding is rendered somewhere, except `work.<slug>.summaryTagline` (canvas hero card only, see 3.7). That exception is added to `docs/content-overrides.md`.

### 4.3 Gate (decision, as built)

`ContentGate` wraps the page content in `app/rendered/layout.tsx`. `ContentGateHead` (style + inline script) is rendered **once in the `<head>` of the root layout** (`app/layout.tsx`), not in the rendered layout. First attempt was to put it in the rendered body, but that layout is created on the client when a visitor navigates from the WIP site ("Visit rendered page"), and React logs "Encountered a script tag while rendering React component" for scripts rendered on the client. Found by driving the real Build flow.

1. The script runs in `<head>` before first paint. It adds `content-pending` to `<html>` only when the path is `/rendered` or `/rendered/...` **and** `prerita-content-overrides` exists. A hard load of any other page is untouched.
2. `app/layout.tsx` has `suppressHydrationWarning` on `<html>` because the script changes its class before React hydrates (same pattern as next-themes).
3. On a client-side navigation WIP to rendered, the script does not run (it is already in the head and does not re-execute), and the rendered page renders on the client with overrides readable straight away, so there is nothing to hide.
4. The spinner is scoped to `.content-pending:has([data-content-gate])` as a second guard against a stuck spinner.
5. Verified in a browser: hard load (iframe, every frame sampled) and the real Build then "Visit rendered page" client navigation (every frame sampled): no frame shows default text while visible, no console errors.

The floating bar sits outside `ContentGate` (it holds no content text).

Spinner (names `content-pending` and `data-content-gate` kept): 20px ring, 1.5px border `#1a1a1a` at 20% with the leading edge `#1a1a1a`, centered, fades in after 200ms, 700ms linear spin, static under `prefers-reduced-motion`.

### 4.4 New copy

Target: none. The design reuses existing fields. If a later decision adds copy (for example a kept testimonial, or editable nav labels), it goes in the matching `lib/*Content.ts`, gets a key in `docs/content-overrides.md` and a binding in the layout creator, and bumps that page's layout version (brief item 8).

### 4.5 What is deliberately not an override

Floating bar labels (`Home`, `Work`, `About`, `Let's talk`), aria labels and the "Switch to sketch version" label. These are navigation chrome. The canvas has no shape for them and the brief says not to change the WIP side unless the redesign needs a new field. This is the one place where "every piece of text" is narrowed. Open question 3 asks whether to make them editable.

## 5. Implementation notes (as built)

| Area | Where |
| --- | --- |
| Styles and tokens | `app/rendered/rendered.css`, everything scoped under `.rendered-root`. Layout primitives (column, section label, row, tile, tray, prose, list, steps) are CSS classes, not components. |
| Fonts | Geist and Geist Mono via `next/font` in `app/rendered/layout.tsx` |
| Layout | `app/rendered/layout.tsx`: skip link, `FloatingBar`, then `ContentGate` around `<main id="main">`. `ContentGateHead` lives in the root `<head>` (4.3). |
| Content components | `components/rendered/Content.tsx` (`Content`, `ContentParagraphs`, `ContentList`, `ContentLines`, `ContentEmailRow`, `CardTitle`) |
| Case study sections | `lib/caseStudySections.ts`, tested against the canvas in `tests/caseStudySections.test.ts` |
| Navigation | `components/rendered/FloatingBar.tsx`, `FloatingBack.tsx`, `BackLink.tsx` |
| Logos | `Mark.tsx` + `markSources.ts` (tiles), `TeamLogos.tsx` (home grid), `SocialIcon.tsx`; files in `public/logos` and `public/logos/mark` |
| Fixed text | `lib/renderedChrome.ts` (nav labels, skip link, new-tab hint, portrait alt) |
| Pages | `app/rendered/{page,work/page,work/[slug]/page,about/page,contact/page}.tsx`, all static server components |
| Docs | this file, `docs/content-overrides.md`, `.impeccable.md` |

Removed: the old nav, footer, sketch toggle, grain overlay, 693 lines of inline SVG illustrations, `lib/renderedAnimations.ts` and the `motion` dependency, three unused avatar images and two broken logo files.

### 5.1 Verification

Automated: `bun test`, `bun run lint`, `bunx tsc --noEmit`, `bun run build` (check `/md/*` output unchanged: diff the generated markdown before and after).

Manual in a real browser, widths 390, 768, 1440:

1. Every rendered page, every case study: one column, text column is 492px at 1440, no horizontal scroll at 390, the bar never covers the last row.
2. Content-overrides checklist from the doc: Reset, edit paragraph + heading + button label + bullets on the WIP canvas, Build, "Visit rendered page": edits appear with no flash of the old text (record a screen capture or check `content-pending` timing). Private window shows defaults. Reset returns defaults. Edit-back removes the override.
3. Case-study headings, one slug per format (Fitpass process-heavy, Abhiloans before-after, Ema preview, Zkagi narrative, Epic standard, Toppr minimal): edit each heading on the canvas, Build, and confirm the same heading changes on the rendered page. Own-title fields (`overviewTitle`, `challengeTitle`, `processTitle`, `additionalSections.<i>.title`) win over `labels.<name>`.
4. Work card: override `workListing.cards.<slug>` shows one title; without override, company + title.
5. View source of a page: default copy is in the HTML (crawlers, no-JS). Check the console for hydration warnings and that no spinner is stuck after navigating rendered to WIP and back.
6. Keyboard: tab through the bar and rows, visible focus on every stop. VoiceOver reads one `h1` and the nav landmark.
7. Lighthouse (mobile): Performance, Accessibility, Best Practices at or above 95. LCP is text, CLS 0.
8. `prefers-reduced-motion`: no fade, spinner static.

## 6. Decisions

Answered after the first review of this doc.

1. **Testimonial: dropped** from the rendered home page.
2. **About gets a portrait** (see 3.7).
3. **Nav and bar labels are not editable** (see 4.5).
4. **Outside work stays on home** as three items with their full text, because it is on the WIP home page too.
5. **No serif.** Typography follows alexkehr.com and its project pages: one sans plus mono, no italics. The About outro is `lede`.
6. **This file lives in `docs/`.**
7. Dark mode is out of scope for this pass; the tokens make it a later addition.
