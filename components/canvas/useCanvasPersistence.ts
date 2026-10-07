"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Store } from "@quickdrawjs/core";
import { parseCanvas, type Editor, type LoadedCanvas } from "@/lib/canvas";
import { debounce } from "@/lib/debounce";
import { WIP_STORAGE_PREFIX, clearOverrides } from "@/lib/contentOverrides";

export type LoadingState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; error: string };

/**
 * Layout versions live in the page key (`work-<slug>-v5`, `about-v2`). When a page loads, drop saved canvases
 * of older versions of the same page, so Build never merges text from two different layouts.
 */
function pruneSupersededCanvases(currentKey: string) {
  try {
    const base = currentKey.slice(WIP_STORAGE_PREFIX.length).replace(/-v\d+$/, "");
    const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sameVersionedPage = new RegExp(`^${WIP_STORAGE_PREFIX}${escaped}(-v\\d+)?$`);
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== currentKey && sameVersionedPage.test(key)) stale.push(key);
    }
    stale.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage unavailable: nothing to prune.
  }
}

export function useCanvasPersistence(pageKey: string) {
  const persistenceKey = `${WIP_STORAGE_PREFIX}${pageKey}`;

  const [store] = useState(() => new Store());
  const [loadingState, setLoadingState] = useState<LoadingState>({
    status: "loading",
  });
  const [needsInitialLayout, setNeedsInitialLayout] = useState(false);
  /** Page meta and camera of the saved canvas, handed to the editor when it mounts. */
  const [initial, setInitial] = useState<Pick<LoadedCanvas, "pageMeta" | "camera"> | null>(null);
  const cancelSaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    pruneSupersededCanvases(persistenceKey);

    let loaded: LoadedCanvas | null = null;
    try {
      const persisted = localStorage.getItem(persistenceKey);
      loaded = persisted ? parseCanvas(JSON.parse(persisted)) : null;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("Failed to load persisted snapshot:", msg);
    }

    if (loaded) {
      store.loadSnapshot({ document: { store: Object.fromEntries(loaded.records.map((r) => [r.id, r])) } } as never);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitial({ pageMeta: loaded.pageMeta, camera: loaded.camera });
    } else {
      setNeedsInitialLayout(true);
    }
    setLoadingState({ status: "ready" });
  }, [persistenceKey, store]);

  /** Save the canvas (shapes, page meta, camera) shortly after every change. Returns a cleanup function. */
  const attach = useCallback(
    (editor: Editor) => {
      const save = debounce(() => {
        try {
          localStorage.setItem(persistenceKey, JSON.stringify(editor.getSnapshot()));
        } catch {
          // Storage full or unavailable: the canvas keeps working, edits just are not kept.
        }
      }, 500);
      const off = editor.on("document", save);
      cancelSaveRef.current = save.cancel;
      // A fresh layout is saved too, so Build knows which fields and items it created.
      save();
      return () => {
        off();
        save.cancel();
      };
    },
    [persistenceKey]
  );

  /**
   * Forget every saved edit, then let the caller put the default layout back in the live editor.
   * No page reload, so it is instant. A pending autosave is cancelled first, or it would write the old canvas back.
   */
  const reset = useCallback((applyDefaults: () => void) => {
    cancelSaveRef.current();
    // Clear all prerita-wip-* keys, not just the current page
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(WIP_STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    // Back to defaults everywhere, including the rendered site.
    clearOverrides();
    applyDefaults();
  }, []);

  return { store, initial, loadingState, reset, needsInitialLayout, attach };
}
