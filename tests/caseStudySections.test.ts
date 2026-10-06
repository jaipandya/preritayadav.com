/**
 * The rendered case study page must use the same content keys as the WIP canvas, per layout format,
 * otherwise editing a heading on the canvas would not change the rendered page. Run with `bun test`.
 * See docs/rendered-design.md.
 */
import { describe, expect, mock, test } from "bun:test";
import type { Editor } from "tldraw";

mock.module("tldraw", () => ({ AssetRecordType: { createId: (id: string) => `asset:${id}` } }));

const { createWorkDetailLayout } = await import("../lib/createWorkDetailLayout");
const { caseStudySections } = await import("../lib/caseStudySections");
const { workItems } = await import("../lib/workData");

type Binding = { key: string };
type Shape = { meta?: { content?: Binding[] } };

function canvasKeys(slug: string): Set<string> {
  const shapes: Shape[] = [];
  const editor = {
    createShape: (s: Shape) => shapes.push(s),
    createAssets: () => {},
    getViewportScreenBounds: () => ({ width: 1000 }),
    setCamera: () => {},
  } as unknown as Editor;
  createWorkDetailLayout(editor, slug);
  return new Set(shapes.flatMap((s) => s.meta?.content ?? []).map((b) => b.key));
}

/** Keys the page header renders on every case study (not part of the sections list). */
function headerKeys(slug: string) {
  const k = (p: string) => `work.${slug}.${p}`;
  return [
    "labels.back", "company", "title", "tagline",
    "labels.role", "labels.duration", "labels.tools", "role", "duration", "tools",
    "labels.contactCta",
  ].map(k);
}

function sectionKeys(slug: string) {
  const work = workItems.find((w) => w.slug === slug)!;
  const keys: string[] = [];
  for (const s of caseStudySections(work)) {
    if (s.kind === "text") keys.push(...(s.heading ? [s.heading.key] : []), s.body.key);
    if (s.kind === "list") keys.push(s.heading.key, s.list.key);
    if (s.kind === "process") keys.push(s.heading.key, ...s.steps.map((x) => x.key));
    if (s.kind === "gallery") keys.push(s.heading.key);
  }
  return keys;
}

describe("caseStudySections", () => {
  for (const work of workItems) {
    describe(`${work.slug} (${work.layoutFormat})`, () => {
      const canvas = canvasKeys(work.slug);

      test("every key the rendered page uses is a key the canvas binds", () => {
        const rendered = [...headerKeys(work.slug), ...sectionKeys(work.slug)];
        const missing = rendered.filter((key) => !canvas.has(key));
        expect(missing).toEqual([]);
      });

      test("every key the canvas binds is rendered (except the canvas-only summaryTagline and empty glance)", () => {
        const rendered = new Set([...headerKeys(work.slug), ...sectionKeys(work.slug)]);
        const notRendered = [...canvas].filter((key) => !rendered.has(key));
        const allowed = [
          `work.${work.slug}.summaryTagline`,
          // process-heavy shows a heading with no images; the rendered page skips an empty gallery
          `work.${work.slug}.labels.atAGlance`,
        ];
        expect(notRendered.filter((key) => !allowed.includes(key))).toEqual([]);
      });
    });
  }
});
