import { useSyncExternalStore } from "react";

/**
 * The fake build, kept outside React so it keeps running while the modal is hidden and while the visitor
 * moves between pages of the sketch. Both Build buttons (floating on desktop, inline on phones) and the modal
 * read it with `useBuildSession`. The log lines live in `components/ui/BuildOverlay.tsx` and are passed in.
 */

export type BuildPhase = "idle" | "running" | "stopping" | "stopped" | "done";
export type BuildLine = { text: string; delay: number };

export type BuildSnapshot = {
  phase: BuildPhase;
  /** Whether the modal is showing. A running build can be hidden and keeps going. */
  open: boolean;
  lines: string[];
  progress: number;
  cached: boolean;
};

const IDLE: BuildSnapshot = { phase: "idle", open: false, lines: [], progress: 0, cached: false };
const BUILD_DONE_KEY = "prerita-build-done";

let snapshot: BuildSnapshot = IDLE;
let timers: ReturnType<typeof setTimeout>[] = [];
let trigger: HTMLElement | null = null;
const listeners = new Set<() => void>();

function update(patch: Partial<BuildSnapshot>) {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((listener) => listener());
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

/** Runs `source` line by line, each after its own delay. */
function schedule(source: BuildLine[], onLine: (index: number, line: BuildLine) => void) {
  let at = 0;
  source.forEach((line, i) => {
    at += line.delay;
    timers.push(setTimeout(() => onLine(i, line), at));
  });
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSnapshot = () => snapshot;
export const getServerSnapshot = () => IDLE;

export function useBuildSession(): BuildSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The Build button that opened the modal, so focus can go back to it when the modal is hidden. */
export function takeTrigger(): HTMLElement | null {
  const el = trigger;
  trigger = null;
  return el && el.isConnected ? el : null;
}

export function startBuild(source: BuildLine[], cached: boolean, from: HTMLElement | null) {
  clearTimers();
  trigger = from;
  update({ phase: "running", open: true, lines: [], progress: 0, cached });
  schedule(source, (i, line) => {
    update({
      lines: [...snapshot.lines, line.text],
      progress: Math.min(((i + 1) / source.length) * 100, 100),
    });
    if (i === source.length - 1) {
      if (!cached) {
        try { sessionStorage.setItem(BUILD_DONE_KEY, "1"); } catch {}
      }
      update({ phase: "done" });
    }
  });
}

export function wasBuiltBefore(): boolean {
  try {
    return sessionStorage.getItem(BUILD_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Cancels the queued build lines and plays `stopLines`, then ends in "stopped". */
export function stopBuild(stopLines: BuildLine[]) {
  if (snapshot.phase !== "running") return;
  clearTimers();
  update({ phase: "stopping" });
  schedule(stopLines, (i, line) => {
    update({ lines: [...snapshot.lines, line.text] });
    if (i === stopLines.length - 1) update({ phase: "stopped" });
  });
}

/** Shows the modal again without touching the build. */
export function openBuild(from: HTMLElement | null) {
  if (snapshot.phase === "idle") return;
  trigger = from;
  update({ open: true });
}

/** Hides the modal. A running or stopping build carries on in the background. */
export function hideBuild() {
  update({ open: false });
}

/** Ends the session (stopped or finished builds) and returns to idle. */
export function dismissBuild() {
  clearTimers();
  update({ ...IDLE });
}
