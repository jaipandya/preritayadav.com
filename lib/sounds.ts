// Fire-and-forget singleton. Safe from React and non-React code alike.
type SoundType = "click" | "navigate" | "menu-open" | "menu-item" | "type" | "draw" | "erase" | "select";

const VOLUMES: Record<SoundType, number> = {
  click: 0.35,
  navigate: 0.45,
  "menu-open": 0.40,
  "menu-item": 0.30,
  type: 0.25,
  draw: 0.40,
  erase: 0.35,
  select: 0.40,
};

const STORAGE_KEY = "sounds-enabled";

class SoundManager {
  private _enabled: boolean;
  private _howls: Partial<Record<SoundType, { play(): number }>> = {};
  private _lastType = 0;
  private _lastDraw = 0;

  constructor() {
    this._enabled = true;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) this._enabled = stored === "true";
    }
  }

  get enabled() { return this._enabled; }

  toggle() {
    this._enabled = !this._enabled;
    if (typeof window !== "undefined")
      localStorage.setItem(STORAGE_KEY, String(this._enabled));
    return this._enabled;
  }

  preloadAll() {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Howl } = require("howler") as typeof import("howler");
    const types: SoundType[] = ["click", "navigate", "menu-open", "menu-item", "type", "draw", "erase", "select"];
    for (const type of types) {
      if (!this._howls[type]) {
        this._howls[type] = new Howl({ src: [`/sounds/${type}.mp3`], volume: VOLUMES[type], preload: true });
      }
    }
  }

  play(type: SoundType) {
    if (!this._enabled || typeof window === "undefined") return;
    if (type === "type") {
      const now = Date.now();
      if (now - this._lastType < 60) return;
      this._lastType = now;
    }
    if (type === "draw" || type === "erase") {
      const now = Date.now();
      if (now - this._lastDraw < 120) return;
      this._lastDraw = now;
    }
    if (!this._howls[type]) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Howl } = require("howler") as typeof import("howler");
      this._howls[type] = new Howl({ src: [`/sounds/${type}.mp3`], volume: VOLUMES[type], preload: true });
    }
    this._howls[type]!.play();
  }
}

export const sounds = new SoundManager();

/** Wraps a click handler to play a sound before the action. */
export function withSound(type: SoundType, fn: () => void): () => void {
  return () => { sounds.play(type); fn(); };
}
