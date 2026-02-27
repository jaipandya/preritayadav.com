import type { Editor } from "tldraw";
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

  annotation(editor, data.slug, "title", y, data.title, 30, 500, 45);
  y += 50;

  annotation(editor, data.slug, "tagline", y, data.tagline, 15, CW, 30);
  y += 50;

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
    props: { w: CW, h: 160, number: data.number, title: data.company, description: data.tagline, mediaType: data.illustrationType },
    meta: { componentType: "project-card", variationId: `${data.slug}-hero-card` },
  });
  return y + 190;
}

function section(editor: Editor, slug: string, y: number, label: string, text: string): number {
  const sid = label.toLowerCase().replace(/\s+/g, "-");
  annotation(editor, slug, `${sid}-label`, y, label, 18, 300, 28);
  y += 32;
  const h = textHeight(text);
  annotation(editor, slug, sid, y, text, 14, CW, h);
  return y + h + 24;
}

function bulletList(editor: Editor, slug: string, y: number, label: string, items: string[]): number {
  const sid = label.toLowerCase().replace(/\s+/g, "-");
  annotation(editor, slug, `${sid}-label`, y, label, 18, 300, 28);
  y += 35;
  for (let i = 0; i < items.length; i++) {
    annotation(editor, slug, `${sid}-${i}`, y, `· ${items[i]}`, 13, CW, 24, LEFT_PAD);
    y += 28;
  }
  return y + 16;
}

function processTimeline(editor: Editor, slug: string, y: number, steps: string[]): number {
  annotation(editor, slug, "process-label", y, "Process", 18, 200, 28);
  y += 40;

  const stepW = 68;
  const stepGap = 6;
  const perRow = Math.min(steps.length, 4);
  const rows = Math.ceil(steps.length / perRow);

  for (let row = 0; row < rows; row++) {
    const start = row * perRow;
    const end = Math.min(start + perRow, steps.length);
    const count = end - start;
    const rowW = count * stepW + (count - 1) * stepGap;
    const rowX = LEFT_PAD + (CW - rowW) / 2;

    for (let i = start; i < end; i++) {
      const col = i - start;
      const x = rowX + col * (stepW + stepGap);
      annotation(editor, slug, `step-${i}`, y, `${String(i + 1).padStart(2, "0")}\n${steps[i]}`, 10, stepW, 52, x);
      if (col < count - 1) {
        annotation(editor, slug, `arrow-${i}`, y + 16, "→", 12, stepGap, 20, x + stepW);
      }
    }
    y += 70;
  }
  return y + 10;
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

function textHeight(text: string): number {
  const charsPerLine = Math.floor(CW / 7);
  const lines = Math.ceil(text.length / charsPerLine);
  return Math.max(40, lines * 18 + 10);
}

// ─── Layout: Process-Heavy (Fitpass) ────────────────────────────

function layoutProcessHeavy(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, data.slug, y, "Overview", data.overview);
  y = section(editor, data.slug, y, "The Challenge", data.challenge);

  // Expanded process section with descriptions
  annotation(editor, data.slug, "process-heading", y, "Design Process", 20, 300, 32);
  y += 40;
  annotation(editor, data.slug, "process-intro", y,
    "The redesign followed a structured, research-driven process from audit to handoff:", 14, CW, 24);
  y += 36;

  y = processTimeline(editor, data.slug, y, data.process);

  y = imagePlaceholders(editor, data.slug, y);

  y = section(editor, data.slug, y, "Approach", data.approach);
  y = bulletList(editor, data.slug, y, "Key Contributions", data.keyContributions);
  y = section(editor, data.slug, y, "Outcome", data.outcome);

  footerCta(editor, data.slug, y);
}

// ─── Layout: Before-After (Abhiloans) ──────────────────────────

function layoutBeforeAfter(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, data.slug, y, "Overview", data.overview);

  // Before state
  annotation(editor, data.slug, "before-label", y, "The Problem", 20, 300, 32);
  y += 36;
  const challengeH = textHeight(data.challenge);
  annotation(editor, data.slug, "before-text", y, data.challenge, 14, CW, challengeH);
  y += challengeH + 10;

  // Divider arrow
  annotation(editor, data.slug, "transform-arrow", y, "↓  What changed  ↓", 13, CW, 24, LEFT_PAD);
  y += 40;

  // Process
  y = processTimeline(editor, data.slug, y, data.process);

  // After state
  annotation(editor, data.slug, "after-label", y, "The Solution", 20, 300, 32);
  y += 36;
  const approachH = textHeight(data.approach);
  annotation(editor, data.slug, "after-text", y, data.approach, 14, CW, approachH);
  y += approachH + 24;

  y = imagePlaceholders(editor, data.slug, y);

  y = bulletList(editor, data.slug, y, "What I Did", data.keyContributions);
  y = section(editor, data.slug, y, "Impact", data.outcome);

  footerCta(editor, data.slug, y);
}

// ─── Layout: Narrative (Ema, ZkAGI) ────────────────────────────

function layoutNarrative(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  // Story-driven sections
  y = section(editor, data.slug, y, "Context", data.overview);
  y = section(editor, data.slug, y, "The Challenge", data.challenge);

  y = imagePlaceholders(editor, data.slug, y);

  y = section(editor, data.slug, y, "How I Approached It", data.approach);
  y = processTimeline(editor, data.slug, y, data.process);

  // Key decisions framed as narrative
  annotation(editor, data.slug, "decisions-label", y, "Key Decisions & Work", 18, 300, 28);
  y += 35;
  for (let i = 0; i < data.keyContributions.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    annotation(editor, data.slug, `decision-${i}`, y, `${num}  ${data.keyContributions[i]}`, 13, CW, 26, LEFT_PAD);
    y += 30;
  }
  y += 16;

  y = section(editor, data.slug, y, "Impact", data.outcome);

  footerCta(editor, data.slug, y);
}

// ─── Layout: Standard (Epic, Super Teacher) ─────────────────────

function layoutStandard(editor: Editor, data: WorkItem) {
  let y = header(editor, data);
  y = metaRow(editor, data.slug, data, y);
  y = heroCard(editor, data, y);

  y = section(editor, data.slug, y, "Overview", data.overview);
  y = section(editor, data.slug, y, "The Challenge", data.challenge);
  y = processTimeline(editor, data.slug, y, data.process);
  y = section(editor, data.slug, y, "Approach", data.approach);
  y = bulletList(editor, data.slug, y, "Key Contributions", data.keyContributions);

  y = imagePlaceholders(editor, data.slug, y);

  y = section(editor, data.slug, y, "Outcome", data.outcome);

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
  annotation(editor, data.slug, "highlights-label", y, "Highlights", 16, 200, 24);
  y += 30;
  for (let i = 0; i < data.keyContributions.length; i++) {
    annotation(editor, data.slug, `highlight-${i}`, y, `→ ${data.keyContributions[i]}`, 13, CW, 22, LEFT_PAD);
    y += 26;
  }
  y += 20;

  y = section(editor, data.slug, y, "Outcome", data.outcome);

  footerCta(editor, data.slug, y);
}
