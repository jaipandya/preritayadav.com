"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createTLStore, getSnapshot, inlineBase64AssetStore, loadSnapshot, type TLAssetStore } from "tldraw";
import { customShapeUtils, customBindingUtils } from "@/lib/shapes";
import { debounce } from "@/lib/debounce";
import { optimizedImageUrl } from "@/lib/canvasAssets";
import { WIP_STORAGE_PREFIX, clearOverrides } from "@/lib/contentOverrides";

/** Canvas images are shown through the Next.js image optimizer at their on-screen size (see lib/canvasAssets.ts). */
const canvasAssetStore: TLAssetStore = {
  ...inlineBase64AssetStore,
  resolve(asset, ctx) {
    const src = asset.props.src;
    if (!src || asset.type !== "image" || ctx.shouldResolveToOriginal) return src;
    return optimizedImageUrl(src, asset.props.w, ctx.steppedScreenScale, ctx.dpr);
  },
};

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
      assets: canvasAssetStore,
    })
  );
  const [loadingState, setLoadingState] = useState<LoadingState>({
    status: "loading",
  });
  const [needsInitialLayout, setNeedsInitialLayout] = useState(false);
  const cancelSaveRef = useRef<() => void>(() => {});

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
    cancelSaveRef.current = debouncedSave.cancel;

    return () => {
      cleanup();
      debouncedSave.cancel();
    };
  }, [persistenceKey, store]);

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

  return { store, loadingState, reset, needsInitialLayout };
}
