"use client";

import { useSyncExternalStore } from "react";
import {
  CONTENT_OVERRIDES_EVENT,
  CONTENT_OVERRIDES_KEY,
  parseOverrides,
  resolveContent,
  resolveContentList,
  type ContentOverrides,
} from "./contentOverrides";

const EMPTY: ContentOverrides = {};
let cachedRaw: string | null | undefined;
let cachedValue: ContentOverrides = EMPTY;

function getSnapshot(): ContentOverrides {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CONTENT_OVERRIDES_KEY);
  } catch {}
  // useSyncExternalStore needs a stable reference while nothing changed.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = raw ? parseOverrides(raw) : EMPTY;
  }
  return cachedValue;
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === CONTENT_OVERRIDES_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CONTENT_OVERRIDES_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CONTENT_OVERRIDES_EVENT, onChange);
  };
}

/** All overrides saved in this browser. Empty on the server and during hydration, so SSR output is the defaults. */
export function useContentOverrides(): ContentOverrides {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** Text for `key`: the visitor's override if there is one, otherwise `fallback` from the content module. */
export function useContent(key: string, fallback: string): string {
  return resolveContent(useContentOverrides(), key, fallback);
}

/** List for `key` (e.g. bullets): the visitor's override, which can be shorter or longer, otherwise `fallback`. */
export function useContentList(key: string, fallback: string[]): string[] {
  return resolveContentList(useContentOverrides(), key, fallback);
}

const noopSubscribe = () => () => {};

/**
 * False on the server and during hydration, true once the client has read the overrides.
 * Flips in the same render pass as `useContent`, so revealing content on `ready` never shows defaults first.
 */
export function useContentReady(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
