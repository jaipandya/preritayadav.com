"use client";

import { useEffect, useState, useCallback } from "react";
import { createTLStore, getSnapshot, loadSnapshot } from "tldraw";
import { customShapeUtils, customBindingUtils } from "@/lib/shapes";
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

  const [store] = useState(() => 
    createTLStore({
      shapeUtils: customShapeUtils,
      bindingUtils: customBindingUtils,
    })
  );
  const [loadingState, setLoadingState] = useState<LoadingState>({
    status: "loading",
  });
  const [needsInitialLayout, setNeedsInitialLayout] = useState(false);

  useEffect(() => {
    const s = store;

    pruneSupersededCanvases(persistenceKey);

    const persisted = localStorage.getItem(persistenceKey);

    if (persisted) {
      try {
        const snapshot = JSON.parse(persisted);
        loadSnapshot(s, snapshot);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoadingState({ status: "ready" });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        console.error("Failed to load persisted snapshot:", msg);
        setNeedsInitialLayout(true);
        setLoadingState({ status: "ready" });
      }
    } else {
      setNeedsInitialLayout(true);
      setLoadingState({ status: "ready" });
    }

    const debouncedSave = debounce(() => {
      const snapshot = getSnapshot(s);
      localStorage.setItem(persistenceKey, JSON.stringify(snapshot));
    }, 500);

    const cleanup = s.listen(debouncedSave);

    return () => {
      cleanup();
      debouncedSave.cancel();
    };
  }, [persistenceKey, store]);

  const reset = useCallback(() => {
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
    // Defer reload so the reset sound (~160ms) has time to play out.
    setTimeout(() => window.location.reload(), 260);
  }, []);

  return { store, loadingState, reset, needsInitialLayout };
}
