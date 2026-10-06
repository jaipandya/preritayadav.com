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
  opts: { prop?: string; part?: number; prefix?: string } = {}
): ContentBinding {
  const binding: ContentBinding = { key, prop: opts.prop ?? "text", base: hashText(value) };
  if (opts.part !== undefined) binding.part = opts.part;
  if (opts.prefix) binding.prefix = opts.prefix;
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

// ─── Collecting overrides from canvas snapshots ─────────────────

type SnapshotShape = {
  typeName?: string;
  x?: number;
  y?: number;
  props?: Record<string, unknown>;
  meta?: { content?: unknown };
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

function stripPrefix(text: string, prefix?: string): string {
  return prefix && text.startsWith(prefix) ? text.slice(prefix.length) : text;
}

type Slot = { text: string; changed: boolean };
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

  for (const snapshot of snapshots) {
    const snapshotLists = new Map<string, ListField>();

    for (const shape of shapesOf(snapshot)) {
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

  const next = { ...previous };

  for (const [key, parts] of fields) {
    const slots = [...parts.entries()].sort(([a], [b]) => a - b).map(([, s]) => s);
    if (slots.some((s) => s.changed)) next[key] = slots.map((s) => s.text).join("\n\n");
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
