"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { BuildOverlayHost, runBuild } from "@/components/ui/BuildOverlay";
import { isBuilt, subscribeBuildFlag } from "@/lib/buildFlag";
import { dismissBuild, getSnapshot, openBuild, subscribe, useBuildSession } from "@/lib/buildSession";
import { buildGate } from "@/lib/renderedChrome";

/** The class the head script (ContentGateHead) adds before paint, and this component keeps in step afterwards. */
const PENDING_CLASS = "build-pending";

/** The gate is up while the build has not run, and while a build started here is still around (until it is dismissed). */
function gateIsUp() {
  return !isBuilt() || getSnapshot().phase !== "idle";
}

/**
 * Stands in for the page on /rendered until the fake build has run in this browser. The page behind it is hidden
 * by CSS (`.build-pending`, rendered.css), never removed: the server HTML is always the full page, so there is
 * no hydration mismatch and no flash, and it stays `noindex` anyway. See docs/rendered-design.md 4.6.
 */
export function BuildGate() {
  const pathname = usePathname();
  const snap = useBuildSession();
  const sketchPath = pathname.replace(/^\/rendered/, "") || "/";

  // Reads the browser state directly instead of through a hook: during hydration a hook returns the server's
  // answer, which would drop the class for a frame before the real one arrives.
  useLayoutEffect(() => {
    const root = document.documentElement;
    let wasUp = false;
    const sync = () => {
      const up = gateIsUp();
      root.classList.toggle(PENDING_CLASS, up);
      // Hand focus to the page the gate was standing in for.
      if (!up && wasUp) document.getElementById("main")?.focus({ preventScroll: true });
      wasUp = up;
    };
    sync();
    const offFlag = subscribeBuildFlag(sync);
    const offSession = subscribe(sync);
    return () => {
      offFlag();
      offSession();
      root.classList.remove(PENDING_CLASS);
    };
  }, []);

  const busy = snap.phase === "running" || snap.phase === "stopping";
  const ready = snap.phase === "done";
  const pct = Math.round(snap.progress);

  return (
    <section className="r-gate" aria-labelledby="r-gate-title">
      <div className="r-gate-card">
        {busy ? (
          <>
            <p className="r-label">{pct}%</p>
            <h1 className="r-gate-title" id="r-gate-title">{buildGate.building.title}</h1>
            <div
              className="r-gate-progress"
              role="progressbar"
              aria-label={buildGate.building.progressLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            >
              <div style={{ width: `${snap.progress}%` }} />
            </div>
            <div className="r-gate-actions">
              <button
                type="button"
                className="r-btn r-gate-btn"
                onClick={(e) => openBuild(e.currentTarget)}
              >
                {buildGate.building.show}
              </button>
            </div>
          </>
        ) : ready ? (
          <>
            <h1 className="r-gate-title" id="r-gate-title" style={{ marginTop: 0 }}>{buildGate.ready.title}</h1>
            <p className="r-gate-body">{buildGate.ready.body}</p>
            <div className="r-gate-actions">
              <button type="button" className="r-btn r-gate-btn" onClick={dismissBuild}>
                {buildGate.ready.open}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="r-label">{buildGate.label}</p>
            <h1 className="r-gate-title" id="r-gate-title">{buildGate.title}</h1>
            <p className="r-gate-body">{buildGate.body}</p>
            <div className="r-gate-actions">
              <button
                type="button"
                className="r-btn r-gate-btn"
                onClick={(e) => runBuild(e.currentTarget)}
              >
                {buildGate.build}
              </button>
              <Link href={sketchPath} className="r-gate-link">
                {buildGate.sketch}
              </Link>
            </div>
          </>
        )}
      </div>
      <BuildOverlayHost />
    </section>
  );
}
