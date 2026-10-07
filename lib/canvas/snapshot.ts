/**
 * What a WIP canvas saves to localStorage, and how it is read back. No DOM or React here, so it is easy to test.
 *
 * Saved shape: `{ format, document: { store: { [id]: record } }, session: { camera } }`. The store holds the Quickdraw
 * records (shapes, image assets) plus one `page` record whose `meta` keeps what the layout created (see
 * `lib/contentOverrides.ts`). `collectOverrides` reads this same envelope.
 *
 * Anything else in storage (a canvas saved by the old tldraw version of the site, corrupt data) is not loaded:
 * the page starts from its default layout and the new save replaces it.
 */
import type { Camera } from "./types";

export const SNAPSHOT_FORMAT = "quickdraw-1";
export const PAGE_RECORD_ID = "page:page";

type StoredRecord = { id: string; typeName: string; [key: string]: unknown };

export type SavedCanvas = {
  format: typeof SNAPSHOT_FORMAT;
  document: { store: Record<string, StoredRecord> };
  session?: { camera?: Camera };
};

export type LoadedCanvas = {
  /** Records for the Quickdraw store (shapes and image assets). */
  records: StoredRecord[];
  pageMeta: Record<string, unknown>;
  camera: Camera | null;
};

export function serializeCanvas(
  records: Iterable<StoredRecord>,
  pageMeta: Record<string, unknown>,
  camera: Camera
): SavedCanvas {
  const store: Record<string, StoredRecord> = {
    [PAGE_RECORD_ID]: { id: PAGE_RECORD_ID, typeName: "page", meta: pageMeta },
  };
  for (const record of records) store[record.id] = record;
  return { format: SNAPSHOT_FORMAT, document: { store }, session: { camera: { ...camera } } };
}

function isCamera(value: unknown): value is Camera {
  const c = value as Camera | null;
  return !!c && [c.x, c.y, c.z].every((n) => typeof n === "number" && Number.isFinite(n)) && c.z > 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** Whether `raw` is a canvas saved in this format (and not, say, by the old tldraw version of the site). */
export function isSavedCanvas(raw: unknown): raw is SavedCanvas {
  return isObject(raw) && raw.format === SNAPSHOT_FORMAT && isObject(raw.document) && isObject(raw.document.store);
}

/**
 * Read a saved canvas. Returns null when there is nothing usable (another format, corrupt data),
 * in which case the page starts from its default layout.
 */
export function parseCanvas(raw: unknown): LoadedCanvas | null {
  return isSavedCanvas(raw) ? readOwn(raw.document.store, raw.session) : null;
}

function readOwn(store: Record<string, unknown>, session: unknown): LoadedCanvas {
  const records: StoredRecord[] = [];
  let pageMeta: Record<string, unknown> = {};
  for (const record of Object.values(store)) {
    if (!isObject(record) || typeof record.id !== "string" || typeof record.typeName !== "string") continue;
    if (record.typeName === "page") {
      if (isObject(record.meta)) pageMeta = record.meta;
      continue;
    }
    if (record.typeName === "shape" && !isValidShape(record)) continue;
    records.push(record as StoredRecord);
  }
  const camera = isObject(session) && isCamera(session.camera) ? session.camera : null;
  return { records, pageMeta, camera };
}

function isValidShape(record: Record<string, unknown>) {
  return (
    typeof record.type === "string" &&
    typeof record.x === "number" &&
    typeof record.y === "number" &&
    isObject(record.props)
  );
}
