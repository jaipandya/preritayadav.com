import type { Editor } from "@/lib/canvas";
import { CANVAS_W, LEFT_PAD, centerCamera, createBackButton } from "./layoutHelpers";
import { getWorkBySlug, type WorkItem } from "./workData";
import { bind, bindList, contentKey, itemIds, withContent, withItem, type ContentBinding } from "./contentOverrides";
import { workPageLabels, type WorkPageLabel } from "./workPageContent";

export function createWorkDetailLayout(editor: Editor, slug: string) {
  const data = getWorkBySlug(slug);
  if (!data) {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y: 40,
      props: { w: 400, h: 40, text: "Work not found", fontSize: 24, showArrow: false, arrowDirection: "right" },
      meta: { componentType: "annotation", variationId: "not-found" },
    });
    createBackButton(editor, LEFT_PAD, 100, "back-home-404", { w: 140, h: 36, label: "← Back to work", href: "/work" });
    return;
  }

  switch (data.layoutFormat) {
    case "preview":
      layoutPreview(editor, data);
      break;
    case "process-heavy":
      layoutProcessHeavy(editor, data);
      break;
    case "before-after":
      layoutBeforeAfter(editor, data);
      break;
    case "narrative":
      layoutNarrative(editor, data);
      break;
    case "minimal":
      layoutMinimal(editor, data);
      break;
    default:
      layoutStandard(editor, data);
  }

  centerCamera(editor);
}

// ─── Shared helpers ────────────────────────────────────────────

const CW = CANVAS_W - LEFT_PAD * 2;

function header(editor: Editor, data: WorkItem): number {
  let y = 40;

  createBackButton(editor, LEFT_PAD, y, `${data.slug}-back`, {
    label: workPageLabels.back,
    href: "/work",
    labelKey: workKey(data.slug, "labels.back"),
  });
  y += 60;

  annotation(editor, data.slug, "company", y, data.company, 13, 300, 20, LEFT_PAD, [bind(workKey(data.slug, "company"), data.company)]);
  y += 24;

  const titleHeight = data.title.length > 30 ? 84 : 45;
  annotation(editor, data.slug, "title", y, data.title, 30, 500, titleHeight, LEFT_PAD, [bind(workKey(data.slug, "title"), data.title)]);
  y += titleHeight + 5;

  const taglineHeight = data.summaryTagline || data.previewText ? textHeight(data.tagline, 15) : 30;
  annotation(editor, data.slug, "tagline", y, data.tagline, 15, CW, taglineHeight, LEFT_PAD, [bind(workKey(data.slug, "tagline"), data.tagline)]);
  y += taglineHeight + 20;

  return y;
}

function metaRow(editor: Editor, slug: string, data: WorkItem, y: number): number {
  const details: Array<{ name: WorkPageLabel; value: string; path: string }> = [
    { name: "role", value: data.role, path: "role" },
    { name: "duration", value: data.duration, path: "duration" },
    { name: "tools", value: data.tools, path: "tools" },
  ];
  const labelH = Math.ceil(13 * LINE_HEIGHT);
  let valueH = 0;
  details.forEach((d, i) => {
    const x = LEFT_PAD + i * 180;
    annotation(editor, slug, `meta-${i}-label`, y, workPageLabels[d.name], 13, 160, labelH, x, [
      bind(workKey(slug, `labels.${d.name}`), workPageLabels[d.name]),
    ]);
    const h = textHeight(d.value, 13, 160);
    annotation(editor, slug, `meta-${i}`, y + labelH, d.value, 13, 160, h, x, [bind(workKey(slug, d.path), d.value)]);
    valueH = Math.max(valueH, h);
  });
  return y + labelH + valueH + 40;
}

function heroCard(editor: Editor, data: WorkItem, y: number): number {
  editor.createShape({
    type: "project-card",
    x: LEFT_PAD,
    y,
    props: { w: CW, h: 160, number: data.number, title: data.company, description: data.summaryTagline ?? data.tagline, mediaType: data.illustrationType },
    meta: withContent(
      { componentType: "project-card", variationId: `${data.slug}-hero-card` },
      bind(workKey(data.slug, "company"), data.company, { prop: "title" }),
      bind(workKey(data.slug, data.summaryTagline ? "summaryTagline" : "tagline"), data.summaryTagline ?? data.tagline, { prop: "description" })
    ),
  });
  return y + 190;
}

// Vertical rhythm. Every text block uses these so gaps stay uniform.
const LINE_HEIGHT = 1.2; // matches AnnotationShapeUtil for fontSize <= 24
const LABEL_GAP = 12; // section heading to its first line of body
const PARAGRAPH_GAP = 10; // between paragraphs inside a section
const BULLET_GAP = 6; // between bullet items
const SECTION_GAP = 32; // after a section ends

/** Content key for a field of a work item, e.g. `work.fitpass-partner-app.overview`. */
function workKey(slug: string, path: string | number): string {
  return contentKey("work", slug, path);
}

/** A heading and the work-item path its text is stored under. */
type Heading = { text: string; key: string };

/**
 * Heading for a section. Uses the work item's own title field when it has one (e.g. `overviewTitle`),
 * otherwise the shared default label, overridable per case study as `labels.<name>`.
 */
function heading(data: WorkItem, name: WorkPageLabel, field?: "overviewTitle" | "challengeTitle" | "processTitle"): Heading {
  const custom = field ? data[field] : undefined;
  return custom ? { text: custom, key: field! } : { text: workPageLabels[name], key: `labels.${name}` };
}

type SectionOpts = {
  /** Path of the body field in WorkItem (e.g. "overview", "additionalSections.0.body"). */
  key: string;
  labelSize?: number;
  id?: string;
};

/** Heading + body paragraphs. Returns y after the block, including SECTION_GAP. */
function section(
  editor: Editor, slug: string, y: number, head: Heading, text: string,
  { key, labelSize = 18, id = head.text.toLowerCase().replace(/\s+/g, "-") }: SectionOpts
): number {
  y = headingShape(editor, slug, y, head, labelSize, id);
  return paragraphs(editor, slug, y, id, text, 14, key) + SECTION_GAP;
}

/** Creates the heading shape and returns y where the content below it starts. */
function headingShape(
  editor: Editor, slug: string, y: number, head: Heading, size: number, id: string, extra: ContentBinding[] = []
): number {
  const h = Math.ceil(size * LINE_HEIGHT);
  annotation(editor, slug, `${id}-label`, y, head.text, size, 300, h, LEFT_PAD, [
    bind(workKey(slug, head.key), head.text),
    ...extra,
  ]);
  return y + h + LABEL_GAP;
}

/**
 * One annotation per paragraph (any newline starts a new one). Returns y after the last, no trailing gap.
 * With `key` (a WorkItem path), each paragraph is bound to that field with its index as `part`.
 */
function paragraphs(editor: Editor, slug: string, y: number, id: string, text: string, fontSize: number, key?: string): number {
  const parts = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  parts.forEach((part, i) => {
    const h = textHeight(part, fontSize);
    annotation(
      editor, slug, i === 0 ? id : `${id}-${i}`, y, part, fontSize, CW, h, LEFT_PAD,
      key ? [bind(workKey(slug, key), part, { part: i })] : []
    );
    y += h + (i < parts.length - 1 ? PARAGRAPH_GAP : 0);
  });
  return y;
}

/**
 * Heading + bullets, bound as one list (`keyPath` is the WorkItem array field, e.g. "keyContributions").
 * On the canvas a bullet can be edited, deleted, duplicated, reordered, or split with Enter.
 */
function bulletList(editor: Editor, slug: string, y: number, head: Heading, items: string[], keyPath: string): number {
  const sid = head.text.toLowerCase().replace(/\s+/g, "-");
  const listKey = workKey(slug, keyPath);
  const prefix = "· ";
  y = headingShape(editor, slug, y, head, 18, sid, [bindList(listKey, items, { head: true })]);
  items.forEach((item, i) => {
    const text = `${prefix}${item}`;
    const h = textHeight(text, 14);
    annotation(editor, slug, `${sid}-${i}`, y, text, 14, CW, h, LEFT_PAD, [bindList(listKey, items, { prefix })]);
    y += h + (i < items.length - 1 ? BULLET_GAP : 0);
  });
  return y + SECTION_GAP;
}

function glanceLabel(editor: Editor, data: WorkItem, y: number): number {
  return headingShape(editor, data.slug, y, heading(data, "atAGlance"), 18, "at-a-glance");
}

function processTimeline(editor: Editor, data: WorkItem, y: number, steps: string[]): number {
  const slug = data.slug;
  y = headingShape(editor, slug, y, heading(data, "process", "processTitle"), 18, "process");

  const fontSize = 12;
  const arrowW = 20;
  const perRow = 4;
  const stepW = (CW - arrowW * (perRow - 1)) / perRow;
  const rowGap = 18;
  const numberH = Math.ceil(fontSize * LINE_HEIGHT);

  for (let start = 0; start < steps.length; start += perRow) {
    const end = Math.min(start + perRow, steps.length);
    const labelH = Math.max(...steps.slice(start, end).map((step) => textHeight(step, fontSize, stepW)));

    for (let i = start; i < end; i++) {
      const x = LEFT_PAD + (i - start) * (stepW + arrowW);
      annotation(editor, slug, `step-${i}-number`, y, String(i + 1).padStart(2, "0"), fontSize, stepW, numberH, x);
      annotation(editor, slug, `step-${i}`, y + numberH, steps[i], fontSize, stepW, labelH, x, [
        bind(workKey(slug, `process.${i}`), steps[i]),
      ]);
      if (i < end - 1) {
        // Arrow sits in the gutter, level with the step number
        annotation(editor, slug, `arrow-${i}`, y, "→", fontSize, arrowW, numberH, x + stepW);
      }
    }
    y += numberH + labelH + rowGap;
  }
  return y - rowGap + SECTION_GAP;
}

function imagePlaceholders(editor: Editor, slug: string, y: number): number {
  editor.createShape({
    type: "image-placeholder", x: LEFT_PAD, y,
    props: { w: 245, h: 170 },
    meta: { componentType: "image-placeholder", variationId: `${slug}-img-a` },
  });
  editor.createShape({
    type: "image-placeholder", x: LEFT_PAD + 265, y,
    props: { w: 245, h: 170 },
    meta: { componentType: "image-placeholder", variationId: `${slug}-img-b` },
  });
  return y + 200;
}

function imageGallery(editor: Editor, data: WorkItem, y: number): number {
  const rows = new Map<number, { image: NonNullable<WorkItem["atAGlanceImages"]>[number]; index: number }[]>();
  for (const [index, image] of (data.atAGlanceImages ?? []).entries()) {
    const row = image.row ?? index;
    const images = rows.get(row) ?? [];
    images.push({ image, index });
    rows.set(row, images);
  }

  for (const images of rows.values()) {
    const gap = 12;
    const availableWidth = CW - gap * (images.length - 1);
    const totalRatio = images.reduce((sum, { image }) => sum + image.width / image.height, 0);
    const h = availableWidth / totalRatio;
    let x = LEFT_PAD;

    for (const { image, index } of images) {
      const w = h * image.width / image.height;
      editor.createShape({
        type: "canvas-image",
        x,
        y,
        props: { w, h, src: image.src, naturalWidth: image.width, altText: image.alt },
        meta: withItem(
          { componentType: "case-study-image", variationId: `${data.slug}-glance-${index}` },
          itemIds.caseStudyImage(data.slug, index)
        ),
      });
      x += w + gap;
    }
    y += h + 12;
  }
  return y - 12 + SECTION_GAP;
}

function footerCta(editor: Editor, data: WorkItem, y: number) {
  editor.createShape({
    type: "hand-drawn-button",
    x: CANVAS_W / 2 - 70,
    y,
    props: { w: 140, h: 36, label: workPageLabels.contactCta },
    meta: withContent(
      { componentType: "button", variationId: `${data.slug}-footer-cta`, href: "/contact" },
      bind(workKey(data.slug, "labels.contactCta"), workPageLabels.contactCta, { prop: "label" })
    ),
  });
}

function annotation(
  editor: Editor, slug: string, vid: string, y: number,
  text: string, fontSize: number, w: number, h: number, x = LEFT_PAD,
  bindings: ContentBinding[] = []
) {
  const meta = { componentType: "annotation", variationId: `${slug}-${vid}` };
  editor.createShape({
    type: "annotation", x, y,
    props: { w, h, text, fontSize, showArrow: false, arrowDirection: "right" },
    meta: bindings.length ? withContent(meta, ...bindings) : meta,
  });
}

let measureCtx: CanvasRenderingContext2D | null | undefined;

/** Pixel width of `text` in Loranthus, or an em-based estimate if the font is not loaded yet. */
function textWidth(text: string, fontSize: number): number {
  if (measureCtx === undefined) {
    measureCtx = typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
  }
  const font = `${fontSize}px Loranthus`;
  if (measureCtx && document.fonts.check(font)) {
    measureCtx.font = font;
    return measureCtx.measureText(text).width;
  }
  return text.length * fontSize * 0.5;
}

/** Greedy word-wrap height of `text` rendered at `fontSize` in a `width` px box. */
function textHeight(text: string, fontSize = 14, width = CW): number {
  let lines = 0;
  for (const raw of text.split("\n")) {
    let line = 1;
    let current = "";
    for (const word of raw.split(/\s+/).filter(Boolean)) {
      const next = current ? `${current} ${word}` : word;
      if (current && textWidth(next, fontSize) > width) {
        line++;
        current = word;
      } else {
        current = next;
      }
    }
    lines += line;
  }
  return Math.ceil(lines * fontSize * LINE_HEIGHT);
}

// ─── Layout: Process-Heavy (Fitpass) ────────────────────────────

function layoutProcessHeavy(editor: Editor, data: WorkItem) {
  const slug = data.slug;
  let y = header(editor, data);
  y = metaRow(editor, slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, slug, y, heading(data, "overview", "overviewTitle"), data.overview, { key: "overview" });
  y = section(editor, slug, y, heading(data, "challenge", "challengeTitle"), data.challenge, { key: "challenge" });

  if (data.processIntro) {
    y = section(editor, slug, y, heading(data, "designProcess"), data.processIntro, { key: "processIntro" });
  }

  y = processTimeline(editor, data, y, data.process);

  y = imagePlaceholders(editor, slug, y);

  y = section(editor, slug, y, heading(data, "approach"), data.approach, { key: "approach" });
  y = bulletList(editor, slug, y, heading(data, "keyContributions"), data.keyContributions, "keyContributions");
  y = section(editor, slug, y, heading(data, "outcome"), data.outcome, { key: "outcome" });
  if (data.showAtAGlance) {
    y = glanceLabel(editor, data, y);
  }
  if (data.learnings) {
    y = section(editor, slug, y, heading(data, "learned"), data.learnings, { key: "learnings" });
  }

  footerCta(editor, data, y);
}

// ─── Layout: Before-After (Abhiloans) ──────────────────────────

function layoutBeforeAfter(editor: Editor, data: WorkItem) {
  const slug = data.slug;
  let y = header(editor, data);
  y = metaRow(editor, slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, slug, y, heading(data, "overview", "overviewTitle"), data.overview, { key: "overview" });

  // Before state
  y = section(editor, slug, y, heading(data, "problem", "challengeTitle"), data.challenge, {
    key: "challenge", labelSize: 20, id: "before",
  });

  // Process
  y = processTimeline(editor, data, y, data.process);

  // After state
  y = section(editor, slug, y, heading(data, "approach"), data.approach, { key: "approach", labelSize: 20, id: "after" });

  if (!data.atAGlanceImages?.length) {
    y = imagePlaceholders(editor, slug, y);
  }

  y = bulletList(editor, slug, y, heading(data, "keyContributions"), data.keyContributions, "keyContributions");
  y = section(editor, slug, y, heading(data, "outcome"), data.outcome, { key: "outcome" });
  if (data.atAGlanceImages?.length) {
    y = imageGallery(editor, data, glanceLabel(editor, data, y));
  }
  if (data.learnings) {
    y = section(editor, slug, y, heading(data, "learned"), data.learnings, { key: "learnings" });
  }

  footerCta(editor, data, y);
}

// ─── Layout: Preview (Ema) ────────────────────────────────────

function layoutPreview(editor: Editor, data: WorkItem) {
  const slug = data.slug;
  let y = header(editor, data);
  y = metaRow(editor, slug, data, y);
  y = heroCard(editor, data, y);
  y = section(editor, slug, y, heading(data, "overview", "overviewTitle"), data.overview, { key: "overview" });

  if (data.previewText) {
    y = paragraphs(editor, slug, y, "project-preview", data.previewText, 14, "previewText") + SECTION_GAP;
  }

  footerCta(editor, data, y);
}

// ─── Layout: Narrative (ZkAGI) ────────────────────────────────

function layoutNarrative(editor: Editor, data: WorkItem) {
  const slug = data.slug;
  let y = header(editor, data);
  y = metaRow(editor, slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, slug, y, heading(data, "overview", "overviewTitle"), data.overview, { key: "overview" });
  y = section(editor, slug, y, heading(data, "challenge", "challengeTitle"), data.challenge, { key: "challenge" });
  y = processTimeline(editor, data, y, data.process);

  y = imagePlaceholders(editor, slug, y);

  y = section(editor, slug, y, heading(data, "approach"), data.approach, { key: "approach" });
  y = bulletList(editor, slug, y, heading(data, "keyContributions"), data.keyContributions, "keyContributions");
  y = section(editor, slug, y, heading(data, "outcome"), data.outcome, { key: "outcome" });
  if (data.learnings) {
    y = section(editor, slug, y, heading(data, "learned"), data.learnings, { key: "learnings" });
  }

  footerCta(editor, data, y);
}

// ─── Layout: Standard (Epic, Super Teacher) ─────────────────────

function layoutStandard(editor: Editor, data: WorkItem) {
  const slug = data.slug;
  let y = header(editor, data);
  y = metaRow(editor, slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, slug, y, heading(data, "overview", "overviewTitle"), data.overview, { key: "overview" });
  y = section(editor, slug, y, heading(data, "challenge", "challengeTitle"), data.challenge, { key: "challenge" });
  y = processTimeline(editor, data, y, data.process);
  if (data.approach) {
    y = section(editor, slug, y, heading(data, "approach"), data.approach, { key: "approach" });
  }
  if (data.keyContributions.length > 0) {
    y = bulletList(editor, slug, y, heading(data, "keyContributions"), data.keyContributions, "keyContributions");
  }

  const researchSections = !data.approach && data.keyContributions.length === 0 && !!data.additionalSections?.length;
  if (researchSections) {
    y = imagePlaceholders(editor, slug, y);
  }

  (data.additionalSections ?? []).forEach((extra, i) => {
    y = section(editor, slug, y, { text: extra.title, key: `additionalSections.${i}.title` }, extra.body, {
      key: `additionalSections.${i}.body`,
    });
  });

  if (!data.showAtAGlance && !researchSections) {
    y = imagePlaceholders(editor, slug, y);
  }

  y = section(editor, slug, y, heading(data, "outcome"), data.outcome, { key: "outcome" });

  if (data.showAtAGlance) {
    y = glanceLabel(editor, data, y);
    y = data.atAGlanceImages?.length
      ? imageGallery(editor, data, y)
      : imagePlaceholders(editor, slug, y);
  }
  if (data.learningPoints) {
    y = bulletList(editor, slug, y, heading(data, "learned"), data.learningPoints, "learningPoints");
  } else if (data.learnings) {
    y = section(editor, slug, y, heading(data, "learned"), data.learnings, { key: "learnings" });
  }

  footerCta(editor, data, y);
}

// ─── Layout: Minimal (Portfolio, Toppr, BirdTab) ────────────────

function layoutMinimal(editor: Editor, data: WorkItem) {
  const slug = data.slug;
  let y = header(editor, data);
  y = metaRow(editor, slug, data, y);

  // Single paragraph overview + challenge combined
  y = section(editor, slug, y, heading(data, "about"), data.overview, { key: "overview" });

  y = heroCard(editor, data, y);

  // Compact approach + contributions
  y = section(editor, slug, y, heading(data, "whatIDid"), data.approach, { key: "approach" });

  // Key contributions as a compact list
  y = bulletList(editor, slug, y, heading(data, "highlights"), data.keyContributions, "keyContributions");

  y = section(editor, slug, y, heading(data, "outcome"), data.outcome, { key: "outcome" });

  footerCta(editor, data, y);
}
