/**
 * Content overrides: carry text edits made on the WIP canvas over to the rendered site.
 *
 * Flow (see docs/content-overrides.md):
 *   1. Layout creators bind each editable text shape to a content key via `withContent`.
 *   2. The canvas persists shapes (and their bindings) in localStorage as before.
 *   3. On Build, `commitOverridesFromCanvases` compares every bound shape with the
 *      default it was created from and writes only the edited fields to
 *      `prerita-content-overrides`.
 *   4. The rendered site reads that key (`useContent`) and falls back to the content
 *      modules in lib/, so other browsers keep seeing the defaults.
 *
 * Keys mirror the property path in the content modules, e.g. `work.fitpass-partner-app.overview`,
 * `work.<slug>.keyContributions` (a list), `about.paragraphs.0`, `landing.hero.name`.
 */

export const CONTENT_OVERRIDES_KEY = "prerita-content-overrides";
export const CONTENT_OVERRIDES_EVENT = "prerita-content-overrides-change";
export const WIP_STORAGE_PREFIX = "prerita-wip-";
/** Page record meta holding the text fields the layout created, so Build can tell which ones were erased. */
export const BOUND_KEYS_META = "boundKeys";
/** Page record meta holding the removable items (cards, rows, images) the layout created, so Build can tell which ones were deleted. */
export const ITEM_KEYS_META = "itemKeys";
/** Override key holding the ids of items deleted on the canvas (a list). The rendered site does not draw them. */
export const HIDDEN_KEY = "hidden";

/** A scalar field is stored as a string, a list field (bullets) as an array of strings. */
export type ContentValue = string | string[];
export type ContentOverrides = Record<string, ContentValue>;

/** Links one text prop of a canvas shape to a field in a content module. Stored in `shape.meta.content`. */
export type ContentBinding = {
  /** Content key, e.g. `about.outro`. */
  key: string;
  /** Shape prop holding the text: `text` (annotation), `label` (button), `title`/`description` (cards). */
  prop: string;
  /** Hash of the default value the shape was created with. Used to detect edits. */
  base: string;
  /** Paragraph index when one field is split across several shapes. */
  part?: number;
  /** Decoration added to the shape text that is not part of the content, e.g. "· " for bullets. */
  prefix?: string;
  /**
   * List field (bullets). Every bullet shape of the list and the list heading share one key. `base` is then the hash of
   * the default array. Items are collected by position (shape `y`), so add, delete and reorder work.
   */
  list?: boolean;
  /** The list heading: marks that the list exists on the canvas (even when every bullet was deleted) but is not an item. */
  head?: boolean;
  /**
   * Deleting the shape must not erase this field: the shape is an item (see `withItem`) and deleting it hides the
   * whole item instead. Needed when the field is shared with other shapes or pages (a card and its case study).
   */
  noErase?: boolean;
};

export function contentKey(...parts: Array<string | number>): string {
  return parts.join(".");
}

export function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Bind a shape prop to a content key. `value` is the content without any `prefix`. */
export function bind(
  key: string,
  value: string,
  opts: { prop?: string; part?: number; prefix?: string; noErase?: boolean } = {}
): ContentBinding {
  const binding: ContentBinding = { key, prop: opts.prop ?? "text", base: hashText(value) };
  if (opts.part !== undefined) binding.part = opts.part;
  if (opts.prefix) binding.prefix = opts.prefix;
  if (opts.noErase) binding.noErase = true;
  return binding;
}

/** Bind a shape to a list field. Pass the full default array; use `head: true` on the heading shape. */
export function bindList(
  key: string,
  defaults: string[],
  opts: { prefix?: string; head?: boolean } = {}
): ContentBinding {
  const binding: ContentBinding = { key, prop: "text", base: hashText(JSON.stringify(defaults)), list: true };
  if (opts.prefix) binding.prefix = opts.prefix;
  if (opts.head) binding.head = true;
  return binding;
}

/** Spread into a shape's `meta` to make its text editable-to-rendered. */
export function withContent<M extends Record<string, unknown>>(meta: M, ...bindings: ContentBinding[]) {
  return bindings.length ? { ...meta, content: bindings.map((b) => ({ ...b })) } : meta;
}

/**
 * Mark a shape as (part of) a removable item that the rendered site draws as a whole: a card, a row, an image.
 * Deleting every shape of an item on the canvas hides the item on the rendered site. `id` mirrors the content key
 * of the item, e.g. `landing.featured.<slug>`, and must be unique to one page.
 */
export function withItem<M extends Record<string, unknown>>(meta: M, id: string) {
  return { ...meta, item: id };
}

/**
 * Ids of the removable items. Layout creators (`withItem`) and rendered pages (`ContentItem`) both build them here,
 * so the two sides cannot drift apart. Each id belongs to exactly one page's canvas.
 */
export const itemIds = {
  featuredWork: (slug: string) => contentKey("landing", "featured", slug),
  blogPost: (index: number) => contentKey("landing", "blogPosts", index),
  outsideWork: (number: string) => contentKey("landing", "outsideWork", number),
  teamLogos: "landing.teamsWorkedWith.logos",
  listingRow: (slug: string) => contentKey("workListing", "rows", slug),
  contactSocials: "contact.socials",
  caseStudyImage: (slug: string, index: number) => contentKey("work", slug, "glance", index),
} as const;

// ─── Reading and writing overrides ──────────────────────────────

export function parseOverrides(raw: string | null): ContentOverrides {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: ContentOverrides = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string") out[k] = v;
      else if (Array.isArray(v) && v.every((item) => typeof item === "string")) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function readOverrides(): ContentOverrides {
  try {
    return parseOverrides(localStorage.getItem(CONTENT_OVERRIDES_KEY));
  } catch {
    return {};
  }
}

export function writeOverrides(overrides: ContentOverrides) {
  try {
    if (Object.keys(overrides).length === 0) localStorage.removeItem(CONTENT_OVERRIDES_KEY);
    else localStorage.setItem(CONTENT_OVERRIDES_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new Event(CONTENT_OVERRIDES_EVENT));
  } catch {
    // Storage unavailable (private mode, quota): the rendered site just shows defaults.
  }
}

export function clearOverrides() {
  writeOverrides({});
}

/** Override for `key`, or `fallback` (the default from the content module). */
export function resolveContent(overrides: ContentOverrides, key: string, fallback: string): string {
  const value = overrides[key];
  return typeof value === "string" ? value : fallback;
}

/** Override list for `key`, or `fallback`. An override can be shorter, longer or empty. */
export function resolveContentList(overrides: ContentOverrides, key: string, fallback: string[]): string[] {
  const value = overrides[key];
  return Array.isArray(value) ? value : fallback;
}

/** Ids of the items deleted on the canvas. */
export function hiddenItems(overrides: ContentOverrides): string[] {
  return resolveContentList(overrides, HIDDEN_KEY, []);
}

// ─── Collecting overrides from canvas snapshots ─────────────────

type SnapshotShape = {
  typeName?: string;
  x?: number;
  y?: number;
  props?: Record<string, unknown>;
  meta?: { content?: unknown; item?: unknown };
};

function shapesOf(snapshot: unknown): SnapshotShape[] {
  const store = (snapshot as { document?: { store?: Record<string, SnapshotShape> } } | null)?.document?.store;
  return store ? Object.values(store).filter((r) => r?.typeName === "shape") : [];
}

function bindingsOf(shape: SnapshotShape): ContentBinding[] {
  const raw = shape.meta?.content;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (b): b is ContentBinding => !!b && typeof b.key === "string" && typeof b.prop === "string" && typeof b.base === "string"
  );
}

/** Text fields (`key` or `key#part`) that the shapes of a freshly created layout bind. List fields are tracked by their heading. */
export function boundKeysOf(shapes: Array<Pick<SnapshotShape, "meta">>): string[] {
  const keys = new Set<string>();
  for (const shape of shapes) {
    for (const b of bindingsOf(shape)) {
      if (!b.list && !b.noErase) keys.add(b.part === undefined ? b.key : `${b.key}#${b.part}`);
    }
  }
  return [...keys];
}

function itemOf(shape: Pick<SnapshotShape, "meta">): string | undefined {
  const id = shape.meta?.item;
  return typeof id === "string" && id ? id : undefined;
}

/** Removable items (`withItem`) that the shapes of a freshly created layout carry. */
export function itemKeysOf(shapes: Array<Pick<SnapshotShape, "meta">>): string[] {
  return [...new Set(shapes.map(itemOf).filter((id): id is string => !!id))];
}

/** Strings the layout recorded in its page record's meta under `metaKey`, across the page records of a snapshot. */
function recordedOf(snapshot: unknown, metaKey: string): string[] {
  const store = (snapshot as { document?: { store?: Record<string, { typeName?: string; meta?: Record<string, unknown> }> } } | null)
    ?.document?.store;
  if (!store) return [];
  return Object.values(store)
    .filter((r) => r?.typeName === "page")
    .flatMap((page) => {
      const keys = page.meta?.[metaKey];
      return Array.isArray(keys) ? keys.filter((k): k is string => typeof k === "string") : [];
    });
}

function stripPrefix(text: string, prefix?: string): string {
  return prefix && text.startsWith(prefix) ? text.slice(prefix.length) : text;
}

type Slot = { text: string; changed: boolean; deleted?: boolean };
type ListEntry = { text: string; x: number; y: number };
type ListField = { base: string; items: ListEntry[] };

/** Items of a list shape: one per line (Enter adds an item), bullet marker and empty lines removed. */
function listItemsOf(text: string, prefix?: string): string[] {
  return text
    .split("\n")
    .map((line) => stripPrefix(line.trim(), prefix?.trim()).trim())
    .filter(Boolean);
}

/**
 * Diff bound shapes in the given tldraw snapshots against their defaults.
 * Fields seen in a snapshot are set when edited and removed when back to default.
 * Fields not seen in any snapshot (page never visited, canvas reset) keep their previous override.
 */
export function collectOverrides(snapshots: unknown[], previous: ContentOverrides = {}): ContentOverrides {
  const fields = new Map<string, Map<number, Slot>>();
  const lists = new Map<string, ListField[]>();
  const expected = new Set<string>();
  const expectedItems = new Set<string>();
  const presentItems = new Set<string>();

  for (const snapshot of snapshots) {
    recordedOf(snapshot, BOUND_KEYS_META).forEach((k) => expected.add(k));
    recordedOf(snapshot, ITEM_KEYS_META).forEach((id) => expectedItems.add(id));
    const snapshotLists = new Map<string, ListField>();

    for (const shape of shapesOf(snapshot)) {
      const item = itemOf(shape);
      if (item) presentItems.add(item);
      for (const b of bindingsOf(shape)) {
        const raw = shape.props?.[b.prop];
        if (typeof raw !== "string") continue;

        if (b.list) {
          const list = snapshotLists.get(b.key) ?? { base: b.base, items: [] };
          if (!b.head) {
            for (const text of listItemsOf(raw, b.prefix)) list.items.push({ text, x: shape.x ?? 0, y: shape.y ?? 0 });
          }
          snapshotLists.set(b.key, list);
          continue;
        }

        const text = stripPrefix(raw, b.prefix);
        const slot: Slot = { text, changed: hashText(text) !== b.base };
        const parts = fields.get(b.key) ?? new Map<number, Slot>();
        const existing = parts.get(b.part ?? 0);
        // When the same field appears on several shapes (e.g. a card and its detail page), an edit wins.
        if (!existing || !(existing.changed && !slot.changed)) parts.set(b.part ?? 0, slot);
        fields.set(b.key, parts);
      }
    }

    for (const [key, list] of snapshotLists) lists.set(key, [...(lists.get(key) ?? []), list]);
  }

  // A text field the layout created that no canvas has any more was erased: the rendered page drops it too.
  for (const entry of expected) {
    const [key, part] = entry.split("#");
    const index = part === undefined ? 0 : Number(part);
    const parts = fields.get(key) ?? new Map<number, Slot>();
    if (!parts.has(index)) parts.set(index, { text: "", changed: true, deleted: true });
    fields.set(key, parts);
  }

  const next = { ...previous };

  // An item the layout created that no canvas has any more was deleted: the rendered page drops it too.
  // Items of pages that were never opened (or reset) are not in expectedItems and keep their previous state.
  const hidden = new Set(hiddenItems(previous));
  for (const id of expectedItems) {
    if (presentItems.has(id)) hidden.delete(id);
    else hidden.add(id);
  }
  if (hidden.size) next[HIDDEN_KEY] = [...hidden];
  else delete next[HIDDEN_KEY];

  for (const [key, parts] of fields) {
    const slots = [...parts.entries()].sort(([a], [b]) => a - b).map(([, s]) => s);
    if (slots.some((s) => s.changed)) next[key] = slots.filter((s) => !s.deleted).map((s) => s.text).join("\n\n");
    else delete next[key];
  }

  for (const [key, candidates] of lists) {
    const resolved = candidates.map((list) => {
      const items = [...list.items].sort((a, b) => a.y - b.y || a.x - b.x).map((item) => item.text);
      return { items, changed: hashText(JSON.stringify(items)) !== list.base };
    });
    // Same rule as scalar fields: an edited copy wins over an unedited one.
    const winner = resolved.find((r) => r.changed) ?? resolved[0];
    if (winner.changed) next[key] = winner.items;
    else delete next[key];
  }

  return next;
}

/** Read every saved WIP canvas from localStorage and store the resulting overrides. Returns how many fields are overridden. */
export function commitOverridesFromCanvases(): number {
  try {
    const snapshots: unknown[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (!storageKey?.startsWith(WIP_STORAGE_PREFIX)) continue;
      try {
        snapshots.push(JSON.parse(localStorage.getItem(storageKey) ?? "null"));
      } catch {
        // Skip corrupt snapshots.
      }
    }
    const next = collectOverrides(snapshots, readOverrides());
    writeOverrides(next);
    return Object.keys(next).length;
  } catch {
    return 0;
  }
}
