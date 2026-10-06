/**
 * Content overrides: layouts bind text to content keys, and Build (collectOverrides) turns canvas edits into overrides.
 * Runs against the real layout creators with a fake editor. Run with `bun test`.
 * See docs/content-overrides.md.
 */
import { describe, expect, mock, test } from "bun:test";
import type { Editor } from "tldraw";

// The layouts only use AssetRecordType from tldraw; skip loading the whole library.
mock.module("tldraw", () => ({ AssetRecordType: { createId: (id: string) => `asset:${id}` } }));

const { createWorkDetailLayout } = await import("../lib/createWorkDetailLayout");
const { createAboutLayout } = await import("../lib/createAboutLayout");
const { createContactLayout } = await import("../lib/createContactLayout");
const { createLandingLayout } = await import("../lib/createLandingLayout");
const { createWorkListingLayout } = await import("../lib/createWorkListingLayout");
const { collectOverrides, parseOverrides, boundKeysOf, BOUND_KEYS_META } = await import("../lib/contentOverrides");
const { workItems } = await import("../lib/workData");

type Binding = { key: string; part?: number; list?: boolean; head?: boolean; prop: string };
type Shape = {
  typeName: "shape";
  type: string;
  x: number;
  y: number;
  props: Record<string, unknown> & { text?: string; label?: string; title?: string; description?: string };
  meta?: { content?: Binding[] };
};
type Fake = { editor: Editor; shapes: Shape[] };

function fakeEditor(): Fake {
  const shapes: Shape[] = [];
  const editor = {
    createShape: (s: Omit<Shape, "typeName">) => shapes.push({ typeName: "shape", ...s }),
    createAssets: () => {},
    getViewportScreenBounds: () => ({ width: 1000 }),
    setCamera: () => {},
  } as unknown as Editor;
  return { editor, shapes };
}

const snapshot = ({ shapes }: Fake) => ({
  document: { store: Object.fromEntries(shapes.map((s, i) => [`shape:${i}`, s])) },
});

/** Snapshot of a canvas whose page remembers the fields its layout created (as WipCanvas records them). */
const snapshotWithKeys = (f: Fake, shapes: Shape[] = f.shapes) => ({
  document: {
    store: {
      "page:page": { typeName: "page", meta: { [BOUND_KEYS_META]: boundKeysOf(f.shapes) } },
      ...Object.fromEntries(shapes.map((s, i) => [`shape:${i}`, s])),
    },
  },
});

const shapesFor = ({ shapes }: Fake, key: string, part?: number) =>
  shapes.filter((s) => s.meta?.content?.some((b) => b.key === key && (part === undefined || b.part === part)));

function only({ shapes }: Fake, key: string, part?: number): Shape {
  const found = shapes.filter((s) => s.meta?.content?.some((b) => b.key === key && (part === undefined || b.part === part)));
  expect(found).toHaveLength(1);
  return found[0];
}

describe("unedited layouts", () => {
  for (const item of workItems) {
    test(`${item.slug}: no overrides`, () => {
      const f = fakeEditor();
      createWorkDetailLayout(f.editor, item.slug);
      expect(f.shapes.some((s) => s.meta?.content)).toBe(true);
      expect(collectOverrides([snapshot(f)])).toEqual({});
    });
  }

  const pages: Array<[string, (e: Editor) => void]> = [
    ["landing", createLandingLayout],
    ["about", createAboutLayout],
    ["contact", createContactLayout],
    ["work listing", createWorkListingLayout],
  ];
  for (const [name, create] of pages) {
    test(`${name}: no overrides`, () => {
      const f = fakeEditor();
      create(f.editor);
      expect(collectOverrides([snapshot(f)])).toEqual({});
    });
  }
});

describe("work page edits", () => {
  const SLUG = "abhiloans-onboarding";
  const item = workItems.find((w) => w.slug === SLUG)!;
  const K = (path: string) => `work.${SLUG}.${path}`;
  const setup = () => {
    const f = fakeEditor();
    createWorkDetailLayout(f.editor, SLUG);
    return f;
  };

  test("scalars, labels, paragraphs, steps and button labels", () => {
    const f = setup();
    const paragraphs = item.challenge.split(/\n+/).map((p) => p.trim()).filter(Boolean);
    only(f, K("challenge"), 1).props.text = "Edited paragraph two.";
    only(f, K("process.0")).props.text = "Edited step";
    only(f, K("role")).props.text = "Staff Designer";
    only(f, K("labels.role")).props.text = "Position";
    only(f, K("labels.contactCta")).props.label = "Hire me";

    expect(collectOverrides([snapshot(f)])).toEqual({
      [K("challenge")]: [paragraphs[0], "Edited paragraph two.", paragraphs[2]].join("\n\n"),
      [K("process.0")]: "Edited step",
      [K("role")]: "Staff Designer",
      [K("labels.role")]: "Position",
      [K("labels.contactCta")]: "Hire me",
    });
  });

  test("reverting to the default removes an override; unseen keys are kept", () => {
    const f = setup();
    const out = collectOverrides([snapshot(f)], { [K("challenge")]: "old", "about.title": "kept" });
    expect(out).toEqual({ "about.title": "kept" });
  });

  describe("bullet list", () => {
    const listKey = K("keyContributions");
    const defaults = item.keyContributions;
    const bullets = (f: Fake) =>
      shapesFor(f, listKey)
        .filter((s) => !s.meta!.content!.find((b) => b.key === listKey)!.head)
        .sort((a, b) => a.y - b.y || a.x - b.x);
    const list = (f: Fake) => collectOverrides([snapshot(f)])[listKey];

    test("one shape per bullet and no override until edited", () => {
      const f = setup();
      expect(bullets(f)).toHaveLength(defaults.length);
      expect(list(f)).toBeUndefined();
    });

    test("edit, then revert", () => {
      const f = setup();
      bullets(f)[2].props.text = "· Edited bullet";
      expect(list(f)).toEqual(defaults.map((d, i) => (i === 2 ? "Edited bullet" : d)));
      bullets(f)[2].props.text = `· ${defaults[2]}`;
      expect(list(f)).toBeUndefined();
    });

    test("delete a bullet", () => {
      const f = setup();
      f.shapes.splice(f.shapes.indexOf(bullets(f)[1]), 1);
      expect(list(f)).toEqual(defaults.filter((_, i) => i !== 1));
    });

    test("duplicate a bullet: tldraw copies meta and offsets x, so the copy follows its source", () => {
      const f = setup();
      const source = bullets(f)[0];
      f.shapes.push({ ...structuredClone(source), x: source.x + 530, props: { ...source.props, text: "· A duplicate" } });
      expect(list(f)).toEqual([defaults[0], "A duplicate", ...defaults.slice(1)]);
    });

    test("Enter inside a bullet adds items", () => {
      const f = setup();
      bullets(f)[0].props.text = "· First\n· Second\nThird";
      expect(list(f)!.slice(0, 3)).toEqual(["First", "Second", "Third"]);
    });

    test("dragging reorders by position", () => {
      const f = setup();
      const all = bullets(f);
      all[0].y = all[all.length - 1].y + 50;
      expect(list(f)).toEqual([...defaults.slice(1), defaults[0]]);
    });

    test("deleting every bullet stores an empty list", () => {
      const f = setup();
      for (const b of bullets(f)) f.shapes.splice(f.shapes.indexOf(b), 1);
      expect(collectOverrides([snapshot(f)], { [listKey]: ["old"] })[listKey]).toEqual([]);
    });
  });
});

describe("other pages", () => {
  test("about outro", () => {
    const f = fakeEditor();
    createAboutLayout(f.editor);
    only(f, "about.outro").props.text = "New outro";
    expect(collectOverrides([snapshot(f)])).toEqual({ "about.outro": "New outro" });
  });

  test("button label prop on the landing page", () => {
    const f = fakeEditor();
    createLandingLayout(f.editor);
    only(f, "landing.hero.cta.label").props.label = "Hire me";
    expect(collectOverrides([snapshot(f)])).toEqual({ "landing.hero.cta.label": "Hire me" });
  });

  test("card tagline shared by a card and its detail page: an edit wins over an unedited copy, in any order", () => {
    const landing = fakeEditor();
    createLandingLayout(landing.editor);
    const card = landing.shapes.find((s) => s.type === "project-card")!;
    const binding = card.meta!.content!.find((b) => b.prop === "description")!;
    card.props.description = "New tagline";

    const detail = fakeEditor();
    createWorkDetailLayout(detail.editor, binding.key.split(".")[1]);

    expect(collectOverrides([snapshot(detail), snapshot(landing)])[binding.key]).toBe("New tagline");
    expect(collectOverrides([snapshot(landing), snapshot(detail)])[binding.key]).toBe("New tagline");
  });

  test("listing card title is one key per card", () => {
    const f = fakeEditor();
    createWorkListingLayout(f.editor);
    const card = f.shapes.find((s) => s.type === "project-card")!;
    const key = card.meta!.content!.find((b) => b.prop === "title")!.key;
    expect(key.startsWith("workListing.cards.")).toBe(true);
    card.props.title = "Renamed";
    expect(collectOverrides([snapshot(f)])[key]).toBe("Renamed");
  });
});

describe("erased text", () => {
  test("erasing a text shape overrides its field with nothing", () => {
    const f = fakeEditor();
    createAboutLayout(f.editor);
    const title = only(f, "about.title");
    const remaining = f.shapes.filter((s) => s !== title);
    expect(collectOverrides([snapshotWithKeys(f, remaining)])).toEqual({ "about.title": "" });
  });

  test("an erased paragraph is dropped from a field split across shapes", () => {
    for (const item of workItems) {
      const f = fakeEditor();
      createWorkDetailLayout(f.editor, item.slug);
      const split = f.shapes.find((s) => s.meta?.content?.some((b) => b.part === 1));
      if (!split) continue;
      const binding = split.meta!.content!.find((b) => b.part === 1)!;
      const first = only(f, binding.key, 0);
      const out = collectOverrides([snapshotWithKeys(f, f.shapes.filter((s) => s !== split))])[binding.key];
      expect(out).toBe(first.props.text);
      return;
    }
    throw new Error("no multi-paragraph field found");
  });

  test("a canvas without recorded fields (saved before this existed) deletes nothing", () => {
    const f = fakeEditor();
    createAboutLayout(f.editor);
    const remaining = f.shapes.filter((s) => s !== only(f, "about.title"));
    expect(collectOverrides([snapshot({ ...f, shapes: remaining })])).toEqual({});
  });

  test("restoring the shape removes the override again", () => {
    const f = fakeEditor();
    createAboutLayout(f.editor);
    const erased = collectOverrides([snapshotWithKeys(f, f.shapes.filter((s) => s !== only(f, "about.title")))]);
    expect(collectOverrides([snapshotWithKeys(f)], erased)).toEqual({});
  });

  test("a field still present on another canvas is not treated as erased", () => {
    const landing = fakeEditor();
    createLandingLayout(landing.editor);
    const card = landing.shapes.find((s) => s.type === "project-card")!;
    const key = card.meta!.content!.find((b) => b.prop === "description")!.key;
    const detail = fakeEditor();
    createWorkDetailLayout(detail.editor, key.split(".")[1]);
    const landingWithoutCard = landing.shapes.filter((s) => s !== card);
    const out = collectOverrides([snapshotWithKeys(landing, landingWithoutCard), snapshotWithKeys(detail)]);
    expect(out[key]).toBeUndefined();
  });
});

describe("parseOverrides", () => {
  test("keeps strings and string arrays, drops everything else", () => {
    const raw = JSON.stringify({ a: "x", b: ["y", "z"], c: 3, d: [1], e: null });
    expect(parseOverrides(raw)).toEqual({ a: "x", b: ["y", "z"] });
    expect(parseOverrides("not json")).toEqual({});
    expect(parseOverrides(null)).toEqual({});
  });
});
