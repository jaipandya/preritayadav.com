import { AssetRecordType, type Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera, createBackButton } from "./layoutHelpers";
import { getWorkBySlug, type WorkItem } from "./workData";

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

  createBackButton(editor, LEFT_PAD, y, `${data.slug}-back`, { label: "← Back to work", href: "/work" });
  y += 60;

  annotation(editor, data.slug, "company", y, data.company, 13, 300, 20);
  y += 24;

  const titleHeight = data.title.length > 30 ? 84 : 45;
  annotation(editor, data.slug, "title", y, data.title, 30, 500, titleHeight);
  y += titleHeight + 5;

  const taglineHeight = data.summaryTagline || data.previewText ? textHeight(data.tagline, 15) : 30;
  annotation(editor, data.slug, "tagline", y, data.tagline, 15, CW, taglineHeight);
  y += taglineHeight + 20;

  return y;
}

function metaRow(editor: Editor, slug: string, data: WorkItem, y: number): number {
  const details = [
    { label: "Role", value: data.role },
    { label: "Duration", value: data.duration },
    { label: "Tools", value: data.tools },
  ];
  details.forEach((d, i) => {
    annotation(editor, slug, `meta-${i}`, y, `${d.label}\n${d.value}`, 13, 160, 50, LEFT_PAD + i * 180);
  });
  return y + 80;
}

function heroCard(editor: Editor, data: WorkItem, y: number): number {
  editor.createShape({
    type: "project-card",
    x: LEFT_PAD,
    y,
    props: { w: CW, h: 160, number: data.number, title: data.company, description: data.summaryTagline ?? data.tagline, mediaType: data.illustrationType },
    meta: { componentType: "project-card", variationId: `${data.slug}-hero-card` },
  });
  return y + 190;
}

// Vertical rhythm. Every text block uses these so gaps stay uniform.
const LINE_HEIGHT = 1.2; // matches AnnotationShapeUtil for fontSize <= 24
const LABEL_GAP = 12; // section heading to its first line of body
const PARAGRAPH_GAP = 10; // between paragraphs inside a section
const BULLET_GAP = 6; // between bullet items
const SECTION_GAP = 32; // after a section ends

/** Heading + body paragraphs. Returns y after the block, including SECTION_GAP. */
function section(
  editor: Editor, slug: string, y: number, label: string, text: string,
  labelSize = 18, id = label.toLowerCase().replace(/\s+/g, "-")
): number {
  const labelH = Math.ceil(labelSize * LINE_HEIGHT);
  annotation(editor, slug, `${id}-label`, y, label, labelSize, 300, labelH);
  y += labelH + LABEL_GAP;
  return paragraphs(editor, slug, y, id, text, 14) + SECTION_GAP;
}

/** One annotation per paragraph (any newline starts a new one). Returns y after the last, no trailing gap. */
function paragraphs(editor: Editor, slug: string, y: number, id: string, text: string, fontSize: number): number {
  const parts = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  parts.forEach((part, i) => {
    const h = textHeight(part, fontSize);
    annotation(editor, slug, i === 0 ? id : `${id}-${i}`, y, part, fontSize, CW, h);
    y += h + (i < parts.length - 1 ? PARAGRAPH_GAP : 0);
  });
  return y;
}

function bulletList(editor: Editor, slug: string, y: number, label: string, items: string[]): number {
  const sid = label.toLowerCase().replace(/\s+/g, "-");
  const labelH = Math.ceil(18 * LINE_HEIGHT);
  annotation(editor, slug, `${sid}-label`, y, label, 18, 300, labelH);
  y += labelH + LABEL_GAP;
  items.forEach((item, i) => {
    const text = `· ${item}`;
    const h = textHeight(text, 14);
    annotation(editor, slug, `${sid}-${i}`, y, text, 14, CW, h);
    y += h + (i < items.length - 1 ? BULLET_GAP : 0);
  });
  return y + SECTION_GAP;
}

function glanceLabel(editor: Editor, slug: string, y: number): number {
  const h = Math.ceil(18 * LINE_HEIGHT);
  annotation(editor, slug, "at-a-glance-label", y, "At a glance", 18, 300, h);
  return y + h + LABEL_GAP;
}

function processTimeline(editor: Editor, slug: string, y: number, steps: string[], title = "Process"): number {
  const labelH = Math.ceil(18 * LINE_HEIGHT);
  annotation(editor, slug, "process-label", y, title, 18, 200, labelH);
  y += labelH + LABEL_GAP;

  const fontSize = 12;
  const arrowW = 20;
  const perRow = 4;
  const stepW = (CW - arrowW * (perRow - 1)) / perRow;
  const rowGap = 18;

  for (let start = 0; start < steps.length; start += perRow) {
    const end = Math.min(start + perRow, steps.length);
    const labels = steps.slice(start, end).map((step, i) => `${String(start + i + 1).padStart(2, "0")}\n${step}`);
    const rowH = Math.max(...labels.map((text) => textHeight(text, fontSize, stepW)));

    for (let i = start; i < end; i++) {
      const x = LEFT_PAD + (i - start) * (stepW + arrowW);
      annotation(editor, slug, `step-${i}`, y, labels[i - start], fontSize, stepW, rowH, x);
      if (i < end - 1) {
        // Arrow sits in the gutter, level with the step number
        annotation(editor, slug, `arrow-${i}`, y, "→", fontSize, arrowW, Math.ceil(fontSize * LINE_HEIGHT), x + stepW);
      }
    }
    y += rowH + rowGap;
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
      const assetId = AssetRecordType.createId(`${data.slug}-glance-${index}`);
      editor.createAssets([{
        id: assetId,
        typeName: "asset",
        type: "image",
        props: {
          name: image.src.split("/").pop() ?? image.alt,
          src: image.src,
          w: image.width,
          h: image.height,
          mimeType: "image/webp",
          isAnimated: false,
        },
        meta: {},
      }]);
      const w = h * image.width / image.height;
      editor.createShape({
        type: "image",
        x,
        y,
        props: { w, h, assetId, altText: image.alt },
        meta: { componentType: "case-study-image", variationId: `${data.slug}-glance-${index}` },
      });
      x += w + gap;
    }
    y += h + 12;
  }
  return y - 12 + SECTION_GAP;
}

function footerCta(editor: Editor, slug: string, y: number) {
  editor.createShape({
    type: "hand-drawn-button",
    x: CANVAS_W / 2 - 70,
    y,
    props: { w: 140, h: 36, label: "Contact me" },
    meta: { componentType: "button", variationId: `${slug}-footer-cta`, href: "/contact" },
  });
}

function annotation(
  editor: Editor, slug: string, vid: string, y: number,
  text: string, fontSize: number, w: number, h: number, x = LEFT_PAD
) {
  editor.createShape({
    type: "annotation", x, y,
    props: { w, h, text, fontSize, showArrow: false, arrowDirection: "right" },
    meta: { componentType: "annotation", variationId: `${slug}-${vid}` },
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
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, data.slug, y, "Overview", data.overview);
  y = section(editor, data.slug, y, "The Challenge", data.challenge);

  if (data.processIntro) {
    y = section(editor, data.slug, y, "Design Process", data.processIntro);
  }

  y = processTimeline(editor, data.slug, y, data.process);

  y = imagePlaceholders(editor, data.slug, y);

  y = section(editor, data.slug, y, "Approach", data.approach);
  y = bulletList(editor, data.slug, y, "Key Contributions", data.keyContributions);
  y = section(editor, data.slug, y, "Outcome", data.outcome);
  if (data.showAtAGlance) {
    y = glanceLabel(editor, data.slug, y);
  }
  if (data.learnings) {
    y = section(editor, data.slug, y, "What I learned", data.learnings);
  }

  footerCta(editor, data.slug, y);
}

// ─── Layout: Before-After (Abhiloans) ──────────────────────────

function layoutBeforeAfter(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, data.slug, y, "Overview", data.overview);

  // Before state
  y = section(editor, data.slug, y, data.challengeTitle ?? "The Problem", data.challenge, 20, "before");

  // Process
  y = processTimeline(editor, data.slug, y, data.process);

  // After state
  y = section(editor, data.slug, y, "Approach", data.approach, 20, "after");

  if (!data.atAGlanceImages?.length) {
    y = imagePlaceholders(editor, data.slug, y);
  }

  y = bulletList(editor, data.slug, y, "Key Contributions", data.keyContributions);
  y = section(editor, data.slug, y, "Outcome", data.outcome);
  if (data.atAGlanceImages?.length) {
    y = imageGallery(editor, data, glanceLabel(editor, data.slug, y));
  }
  if (data.learnings) {
    y = section(editor, data.slug, y, "What I learned", data.learnings);
  }

  footerCta(editor, data.slug, y);
}

// ─── Layout: Preview (Ema) ────────────────────────────────────

function layoutPreview(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);
  y = section(editor, data.slug, y, data.overviewTitle ?? "Overview", data.overview);

  if (data.previewText) {
    y = paragraphs(editor, data.slug, y, "project-preview", data.previewText, 14) + SECTION_GAP;
  }

  footerCta(editor, data.slug, y);
}

// ─── Layout: Narrative (ZkAGI) ────────────────────────────────

function layoutNarrative(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, data.slug, y, data.overviewTitle ?? "Overview", data.overview);
  y = section(editor, data.slug, y, "The Challenge", data.challenge);
  y = processTimeline(editor, data.slug, y, data.process, data.processTitle);

  y = imagePlaceholders(editor, data.slug, y);

  y = section(editor, data.slug, y, "Approach", data.approach);
  y = bulletList(editor, data.slug, y, "Key Contributions", data.keyContributions);
  y = section(editor, data.slug, y, "Outcome", data.outcome);
  if (data.learnings) {
    y = section(editor, data.slug, y, "What I learned", data.learnings);
  }

  footerCta(editor, data.slug, y);
}

// ─── Layout: Standard (Epic, Super Teacher) ─────────────────────

function layoutStandard(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, data.slug, y, "Overview", data.overview);
  y = section(editor, data.slug, y, "The Challenge", data.challenge);
  y = processTimeline(editor, data.slug, y, data.process, data.processTitle);
  if (data.approach) {
    y = section(editor, data.slug, y, "Approach", data.approach);
  }
  if (data.keyContributions.length > 0) {
    y = bulletList(editor, data.slug, y, "Key Contributions", data.keyContributions);
  }

  const researchSections = !data.approach && data.keyContributions.length === 0 && !!data.additionalSections?.length;
  if (researchSections) {
    y = imagePlaceholders(editor, data.slug, y);
  }

  for (const extra of data.additionalSections ?? []) {
    y = section(editor, data.slug, y, extra.title, extra.body);
  }

  if (!data.showAtAGlance && !researchSections) {
    y = imagePlaceholders(editor, data.slug, y);
  }

  y = section(editor, data.slug, y, "Outcome", data.outcome);

  if (data.showAtAGlance) {
    y = glanceLabel(editor, data.slug, y);
    y = data.atAGlanceImages?.length
      ? imageGallery(editor, data, y)
      : imagePlaceholders(editor, data.slug, y);
  }
  if (data.learningPoints) {
    y = bulletList(editor, data.slug, y, "What I learned", data.learningPoints);
  } else if (data.learnings) {
    y = section(editor, data.slug, y, "What I learned", data.learnings);
  }

  footerCta(editor, data.slug, y);
}

// ─── Layout: Minimal (Portfolio, Toppr, BirdTab) ────────────────

function layoutMinimal(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);

  // Single paragraph overview + challenge combined
  y = section(editor, data.slug, y, "About", data.overview);

  y = heroCard(editor, data, y);

  // Compact approach + contributions
  y = section(editor, data.slug, y, "What I Did", data.approach);

  // Key contributions as a compact list
  y = bulletList(editor, data.slug, y, "Highlights", data.keyContributions);

  y = section(editor, data.slug, y, "Outcome", data.outcome);

  footerCta(editor, data.slug, y);
}
