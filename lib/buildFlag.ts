/**
 * Whether this browser has run the fake build. No React in here: the head script in `ContentGateHead` reads the same
 * key before anything hydrates. It is in localStorage, so a new tab, a shared tab or a later visit all count as built.
 * There is deliberately no way to skip the build: the rendered site "does not exist" until it has run.
 * Falls back to memory when storage throws (private modes), so a build still opens the page on that page view.
 */

export const BUILD_DONE_KEY = "prerita-build-done";

let builtInMemory = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function isBuilt(): boolean {
  if (builtInMemory) return true;
  try {
    return localStorage.getItem(BUILD_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markBuilt() {
  builtInMemory = true;
  try {
    localStorage.setItem(BUILD_DONE_KEY, "1");
  } catch {}
  notify();
}

/** Called when a build finishes here and, through the `storage` event, on changes from other tabs. */
export function subscribeBuildFlag(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === BUILD_DONE_KEY) {
      // Another tab cleared the flag: forget our own memory of it too.
      if (e.key === null || e.newValue === null) builtInMemory = false;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
