/** The build flag lives in localStorage and survives broken storage. Run with `bun test`. */
import { beforeEach, describe, expect, test } from "bun:test";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() { return map.size; },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, v),
  };
}

const brokenStorage = new Proxy({}, { get() { throw new Error("storage blocked"); } }) as Storage;

async function freshFlag() {
  // A new module instance per test, so the in-memory fallbacks start empty.
  return import(`../lib/buildFlag?${Math.random()}`) as Promise<typeof import("../lib/buildFlag")>;
}

beforeEach(() => {
  const g = globalThis as Record<string, unknown>;
  g.localStorage = memoryStorage();
});

describe("build flag", () => {
  test("starts locked, and a build unlocks it for later visits through localStorage", async () => {
    const flag = await freshFlag();
    expect(flag.isBuilt()).toBe(false);
    flag.markBuilt();
    expect(localStorage.getItem(flag.BUILD_DONE_KEY)).toBe("1");
    expect((await freshFlag()).isBuilt()).toBe(true);
  });

  test("with blocked storage a build still opens the page on this page view", async () => {
    const g = globalThis as Record<string, unknown>;
    g.localStorage = brokenStorage;
    const flag = await freshFlag();
    expect(flag.isBuilt()).toBe(false);
    flag.markBuilt();
    expect(flag.isBuilt()).toBe(true);
  });

  test("listeners hear about a build", async () => {
    const g = globalThis as Record<string, unknown>;
    g.window = { addEventListener() {}, removeEventListener() {} };
    const flag = await freshFlag();
    let calls = 0;
    const off = flag.subscribeBuildFlag(() => calls++);
    flag.markBuilt();
    off();
    flag.markBuilt();
    expect(calls).toBe(1);
    delete g.window;
  });
});
