"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createTLStore, getSnapshot, loadSnapshot } from "tldraw";
import { customShapeUtils } from "@/lib/shapes";
import { debounce } from "@/lib/debounce";

export type LoadingState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; error: string };

export function useCanvasPersistence(pageKey: string) {
  const persistenceKey = `prerita-wip-${pageKey}`;

  const [store, setStore] = useState<ReturnType<typeof createTLStore> | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    status: "loading",
  });
  const [needsInitialLayout, setNeedsInitialLayout] = useState(false);

  useEffect(() => {
    const s = createTLStore({ shapeUtils: customShapeUtils });
    setStore(s);

    const persisted = localStorage.getItem(persistenceKey);

    if (persisted) {
      try {
        const snapshot = JSON.parse(persisted);
        loadSnapshot(s, snapshot);
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
  }, [persistenceKey]);

  const reset = useCallback(() => {
    localStorage.removeItem(persistenceKey);
    window.location.reload();
  }, [persistenceKey]);

  return { store, loadingState, reset, needsInitialLayout };
}
