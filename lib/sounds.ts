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
type HowlLike = import("howler").Howl;

class SoundManager {
  private _enabled: boolean;
  private _howls: Partial<Record<SoundType, HowlLike>> = {};
  private _lastType = 0;
  private _lastDraw = 0;
  private _configuredHowler = false;

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

  private getHowler() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const howler = require("howler") as typeof import("howler");
    if (!this._configuredHowler) {
      // Disable Howler's global auto-unlock WebAudio path; we use HTML5 audio for reliability on first tap.
      howler.Howler.autoUnlock = false;
      howler.Howler.html5PoolSize = 32;
      this._configuredHowler = true;
    }
    return howler;
  }

  private ensureHowl(type: SoundType): HowlLike {
    if (!this._howls[type]) {
      const { Howl } = this.getHowler();
      this._howls[type] = new Howl({
        src: [`/sounds/${type}.mp3`],
        volume: VOLUMES[type],
        preload: false,
        html5: true,
      });
    }
    return this._howls[type]!;
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
    this.ensureHowl(type).play();
  }
}

export const sounds = new SoundManager();

/** Wraps a click handler to play a sound before the action. */
export function withSound(type: SoundType, fn: () => void): () => void {
  return () => { sounds.play(type); fn(); };
}
