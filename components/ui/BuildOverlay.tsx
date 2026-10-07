"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { commitOverridesFromCanvases } from "@/lib/contentOverrides";
import {
  dismissBuild,
  getSnapshot,
  hideBuild,
  openBuild,
  startBuild,
  stopBuild,
  takeTrigger,
  useBuildSession,
  wasBuiltBefore,
  type BuildLine,
  type BuildPhase,
  type BuildSnapshot,
} from "@/lib/buildSession";

const BUILD_LINES: BuildLine[] = [
  { text: "▸ Launching build agent...", delay: 0 },
  { text: "  Agent: prerita-portfolio-builder v0.2", delay: 500 },
  { text: "  Mode: sketch → minimal render", delay: 350 },
  { text: "", delay: 600 },

  { text: "▸ Reading source of truth...", delay: 500 },
  { text: "  Loading content modules from lib/", delay: 350 },
  { text: "  Found landingContent.ts, aboutContent.ts, contactContent.ts, workData.ts", delay: 420 },
  { text: "  Loaded 9 work items, 5 blog posts, 3 outside-work entries", delay: 300 },
  { text: "", delay: 500 },

  { text: "▸ Collecting your canvas edits...", delay: 700 },
  { text: "  Diffing every text shape against its default", delay: 450 },
  { text: "  Keeping only what you changed, in this browser", delay: 380 },
  { text: "  Bullet lists: order, additions and deletions preserved", delay: 340 },
  { text: "  ✓ Edits saved, everything else stays on the defaults", delay: 300 },
  { text: "", delay: 500 },

  { text: "▸ Reading the sketch...", delay: 700 },
  { text: "  Reading tldraw shape tree from createLandingLayout.ts", delay: 550 },
  { text: "  ✓ Hero: greeting, name, two-line subtitle", delay: 280 },
  { text: "  ✓ Featured work: 3 projects, each linked to its case study", delay: 320 },
  { text: "  ✓ Writing: 5 posts with external links", delay: 300 },
  { text: "  ✓ Outside work: travel, mentoring, tinkering", delay: 280 },
  { text: "  ✓ Teams: 8 companies, shown as a quiet grid of logos", delay: 240 },
  { text: "  ✓ Closing line and a way to get in touch", delay: 260 },
  { text: "", delay: 600 },

  { text: "▸ Planning the layout...", delay: 800 },
  { text: "  One column for every page: 540px wide, 24px gutters", delay: 450 },
  { text: "  No header. Navigation lives in a small floating bar", delay: 380 },
  { text: "  Sections separated by space, not by lines or boxes", delay: 350 },
  { text: "  Sketch text becomes real text, so it can be selected and read aloud", delay: 330 },
  { text: "", delay: 400 },

  { text: "▸ Generating design tokens...", delay: 700 },
  { text: "  Selecting typefaces:", delay: 300 },
  { text: '    sans: "Geist" (400, 500, 700), tight tracking on headlines', delay: 420 },
  { text: '    mono: "Geist Mono" (400), for labels and small details', delay: 380 },
  { text: "  Building the grey ramp:", delay: 280 },
  { text: "    --r-text: #1A1A1A", delay: 180 },
  { text: "    --r-body: #666666", delay: 160 },
  { text: "    --r-muted: #737373 (AA contrast on white)", delay: 200 },
  { text: "    --r-wash: #FAFAFA (row hover)", delay: 160 },
  { text: "  Writing rendered.css (scoped to .rendered-root, no Tailwind bleed)", delay: 350 },
  { text: "  Loading fonts through next/font, no layout shift", delay: 300 },
  { text: "", delay: 500 },

  { text: "▸ Writing components...", delay: 700 },
  { text: "  Content.tsx: text, paragraphs and lists that pick up your edits", delay: 450 },
  { text: "  FloatingBar.tsx: Home, Work, About, socials, Let's talk", delay: 320 },
  { text: "  Rows: logo tile, title, one-line description, soft hover, arrow on hover", delay: 300 },
  { text: "  Motion: page settle-in, sliding nav dot, press feedback (CSS only, honours reduced motion)", delay: 320 },
  { text: "  CopyButton.tsx: copy the email address from the contact page", delay: 280 },
  { text: "  Mark.tsx: logo tile with initial fallback", delay: 260 },
  { text: "  Watercolor thumbnails and portrait, painted with OpenCV", delay: 300 },
  { text: "", delay: 400 },

  { text: "▸ Building pages from content modules...", delay: 800 },
  { text: "", delay: 200 },
  { text: "  [1/5] app/rendered/page.tsx", delay: 500 },
  { text: "    Hero, featured work, writing, outside work, teams, closing", delay: 380 },
  { text: "    ✓ Page written", delay: 350 },
  { text: "", delay: 300 },
  { text: "  [2/5] app/rendered/work/page.tsx", delay: 400 },
  { text: "    Main list, then the archive", delay: 280 },
  { text: "    ✓ Page written", delay: 300 },
  { text: "", delay: 250 },
  { text: "  [3/5] app/rendered/work/[slug]/page.tsx", delay: 400 },
  { text: "    Section order follows each case study's layout format", delay: 380 },
  { text: "    Screenshots in a soft grey tray, previous and next case studies", delay: 340 },
  { text: "    ✓ Page written", delay: 320 },
  { text: "", delay: 250 },
  { text: "  [4/5] app/rendered/about/page.tsx", delay: 350 },
  { text: "    Watercolor portrait, story paragraphs, closing note", delay: 280 },
  { text: "    ✓ Page written", delay: 260 },
  { text: "", delay: 200 },
  { text: "  [5/5] app/rendered/contact/page.tsx", delay: 300 },
  { text: "    Email first, then social links", delay: 240 },
  { text: "    ✓ Page written", delay: 260 },
  { text: "", delay: 500 },

  { text: "▸ Wiring the layout...", delay: 600 },
  { text: "  app/rendered/layout.tsx:", delay: 250 },
  { text: "    <main>{children}</main> + <FloatingBar />", delay: 320 },
  { text: "    Content gate: no flash of the old text while your edits load", delay: 340 },
  { text: "    robots: noindex, follow (the sketch is the version search engines index)", delay: 300 },
  { text: "", delay: 400 },

  { text: "▸ Compiling...", delay: 800 },
  { text: "  TypeScript check... ✓ passed", delay: 600 },
  { text: "  Stylesheet... ✓ one file, no unused rules", delay: 400 },
  { text: "  Client JavaScript... ✓ text, nav dot and copy button only, no animation library", delay: 350 },
  { text: "  Font subsetting... ✓ Geist 24 KB, Geist Mono 18 KB", delay: 380 },
  { text: "", delay: 400 },

  { text: "▸ Static generation...", delay: 600 },
  { text: "  ○ /rendered", delay: 200 },
  { text: "  ○ /rendered/work", delay: 180 },
  { text: "  ○ /rendered/about", delay: 160 },
  { text: "  ○ /rendered/contact", delay: 160 },
  { text: "  ● /rendered/work/[slug] (9 pages)", delay: 300 },
  { text: "  ✓ 13 pages generated in 420ms", delay: 400 },
  { text: "", delay: 600 },

  { text: "✓ Build complete. Ready to view.", delay: 500 },
];

const CACHED_LINES: BuildLine[] = [
  { text: "▸ Launching build agent...", delay: 0 },
  { text: "  Agent: prerita-portfolio-builder v0.2", delay: 400 },
  { text: "", delay: 400 },
  { text: "▸ Checking build cache...", delay: 500 },
  { text: "  Found cached build from previous session", delay: 450 },
  { text: "  Validating content modules... ✓ no changes detected", delay: 500 },
  { text: "  Validating component tree... ✓ 13 pages intact", delay: 400 },
  { text: "  Validating design tokens... ✓ rendered.css unchanged", delay: 350 },
  { text: "", delay: 400 },
  { text: "▸ Hydrating from cache...", delay: 500 },
  { text: "  ○ /rendered", delay: 120 },
  { text: "  ○ /rendered/work", delay: 100 },
  { text: "  ○ /rendered/about", delay: 100 },
  { text: "  ○ /rendered/contact", delay: 100 },
  { text: "  ● /rendered/work/[slug] (9 pages)", delay: 200 },
  { text: "", delay: 300 },
  { text: "✓ Cached build restored. Ready to view.", delay: 400 },
];

/** Lines that appear when the user stops a build. Fake, like the build itself. */
const STOP_LINES: BuildLine[] = [
  { text: "^C", delay: 0 },
  { text: "", delay: 200 },
  { text: "▸ Stop requested...", delay: 300 },
  { text: "  Cancelling queued steps", delay: 380 },
  { text: "  Releasing file handles", delay: 340 },
  { text: "  Discarding partial output", delay: 400 },
  { text: "  Your sketch and edits are untouched", delay: 320 },
  { text: "", delay: 250 },
  { text: "■ Build stopped.", delay: 350 },
];

const STATUS_TEXT: Record<BuildPhase, string> = {
  idle: "",
  running: "Building...",
  stopping: "Stopping...",
  stopped: "Stopped",
  done: "Ready",
};

function lineColor(line: string): string | undefined {
  if (line.startsWith("■")) return "#d7857a";
  if (line === "^C") return "#e8e4dc";
  if (line.startsWith("✓ Build") || line.startsWith("✓ 13 pages")) return "#D4A853";
  if (line.startsWith("  ✓")) return "#7a9e6a";
  if (line.startsWith("  →") || line.startsWith("  [")) return "#8a9eb5";
  if (line.startsWith("  font-") || line.startsWith("  palette") || line.startsWith("    --r-") || line.startsWith("    sans:") || line.startsWith("    mono:")) return "#b89a6a";
  if (line.startsWith("$") || line.startsWith("  ○")) return "#706c64";
  if (line.startsWith("▸")) return "#e8e4dc";
  if (line.startsWith("  ƒ") || line.startsWith("  ●")) return "#8a9eb5";
  return undefined;
}

/**
 * The modal. Backdrop clicks do nothing: a running build ends with Stop, or goes on in the background
 * ("Run in background", the red dot or Escape) and comes back through the Build button.
 */
function BuildOverlay({
  snap,
  onVisit,
}: {
  snap: BuildSnapshot;
  onVisit: () => void;
}) {
  const { phase, lines, progress } = snap;
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const live = phase === "running" || phase === "stopping";
  const halted = phase === "stopping" || phase === "stopped";

  // Hide while the build goes on, or close for good once it has ended.
  const leave = useCallback(() => {
    if (live) hideBuild();
    else dismissBuild();
  }, [live]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus the safe button (never Stop: a Space key-up from opening the modal would press it), and again
  // whenever the footer changes.
  useEffect(() => {
    actionRef.current?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        leave();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      // Backdrop clicks do nothing and the page behind is inert, so keep Tab inside the dialog.
      const focusable = Array.from(cardRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)"));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !cardRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !cardRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [leave]);

  return (
    <div
      className="p-4 md:p-6"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={cardRef}
        className="build-card"
        role="dialog"
        aria-modal="true"
        aria-label="Build output"
        style={{
          width: "100%",
          maxWidth: 640,
          background: "#0f0e0c",
          border: "1px solid #2e2c28",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
          color: "#a8a49b",
          fontSize: 12,
          lineHeight: 1.55,
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid #1e1d1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            background: "#141311",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, paddingLeft: 4 }}>
              <button
                className="build-dot"
                onClick={leave}
                aria-label={live ? "Hide build output (the build keeps running)" : "Close build output"}
                title={live ? "Hide (the build keeps running)" : "Close"}
              />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
            </div>
            <span style={{ color: "#706c64", fontSize: 11, marginLeft: 4 }}>
              build: preritayadav.com
            </span>
          </div>
          <span style={{ color: halted ? "#8a4a42" : "#D4A853", fontSize: 11, fontWeight: 600 }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "#1e1d1a", flexShrink: 0 }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: halted ? "#8a4a42" : "linear-gradient(90deg, #D4A853, #B8923F)",
              transition: "width 0.3s ease-out, background 0.3s",
            }}
          />
        </div>

        {/* Terminal output — fixed height, scrolls to bottom */}
        <div
          ref={scrollRef}
          className="build-terminal-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "12px 16px",
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                opacity: line === "" ? 0 : 1,
                height: line === "" ? 6 : "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: lineColor(line),
                fontWeight: line.startsWith("▸") || line.startsWith("✓") || line.startsWith("■") || line === "^C" ? 600 : 400,
              }}
            >
              {line}
            </div>
          ))}
          {live && lines.length > 0 && (
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 14,
                background: "#D4A853",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                animation: "blink 1s step-end infinite",
              }}
            />
          )}
        </div>

        {/* Footer: always there. Stop while building, a disabled spinner while stopping, Close once it has ended. */}
        <div className="build-actions">
          <span className="build-status" data-status={phase}>
            {STATUS_TEXT[phase]}
          </span>
          {phase === "running" && (
            <button className="build-btn build-btn-stop" onClick={() => stopBuild(STOP_LINES)}>
              Stop build
            </button>
          )}
          {phase === "stopping" && (
            <button className="build-btn build-btn-stop" disabled aria-busy="true">
              <span className="build-spinner" aria-hidden="true" />
              Stopping...
            </button>
          )}
          {live && (
            <button ref={actionRef} className="build-btn build-btn-ghost" onClick={hideBuild}>
              Run in background
            </button>
          )}
          {phase === "stopped" && (
            <button ref={actionRef} className="build-btn build-btn-ghost" onClick={dismissBuild}>
              Close
            </button>
          )}
          {phase === "done" && (
            <>
              <button ref={actionRef} className="build-btn build-btn-primary" onClick={onVisit}>
                Visit rendered page →
              </button>
              <button className="build-btn build-btn-ghost" onClick={dismissBuild}>
                Close
              </button>
            </>
          )}
        </div>

        <style>{`
          .build-card {
            height: 100%;
            max-height: 420px;
            color-scheme: dark;
          }
          .build-dot {
            position: relative;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ff5f56;
            border: none;
            padding: 0;
            cursor: pointer;
          }
          /* The dot is 12px; the tap area is not. */
          .build-dot::after { content: ""; position: absolute; inset: -8px; }
          .build-dot:focus-visible { outline: 2px solid #D4A853; outline-offset: 3px; }
          .build-actions {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-top: 1px solid #1e1d1a;
            background: #141311;
          }
          .build-status {
            margin-right: auto;
            font-size: 11px;
            color: #706c64;
          }
          .build-status[data-status="done"] { color: #7a9e6a; }
          .build-status[data-status="stopped"],
          .build-status[data-status="stopping"] { color: #b2776d; }
          .build-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-family: inherit;
            cursor: pointer;
            transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
          }
          .build-btn:focus-visible { outline: 2px solid #D4A853; outline-offset: 2px; }
          .build-btn:disabled { cursor: default; opacity: 0.75; }
          .build-btn-primary {
            background: #D4A853;
            border: 1px solid #B8923F;
            color: #0f0e0c;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 4px;
          }
          .build-btn-ghost {
            background: transparent;
            border: 1px solid #2e2c28;
            color: #a8a49b;
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 4px;
          }
          .build-btn-stop {
            background: transparent;
            border: 1px solid #5a342f;
            color: #e0968b;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 4px;
          }
          .build-spinner {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            border: 2px solid #4a2f2b;
            border-top-color: #e0968b;
            animation: build-spin 0.8s linear infinite;
          }
          @media (hover: hover) {
            .build-btn-primary:hover { background: #E8BC5E; }
            .build-btn-ghost:hover { background: #1e1d1a; color: #d4d0c8; }
            .build-btn-stop:not(:disabled):hover { background: #2a1a18; border-color: #7a443d; }
          }
          @media (prefers-reduced-motion: reduce) {
            .build-spinner { animation-duration: 2.4s; }
          }
          @media (max-width: 640px) {
            .build-card {
              max-height: none;
              font-size: 13px;
              padding-bottom: env(safe-area-inset-bottom);
            }
            .build-dot::after { inset: -14px; }
            .build-terminal-scroll { padding: 12px !important; }
            .build-actions {
              flex-direction: column;
              align-items: stretch;
              gap: 8px;
              padding: 12px;
            }
            .build-status { margin-right: 0; text-align: center; font-size: 12px; }
            .build-btn { min-height: 44px; font-size: 14px; }
            .build-btn-primary { order: 1; }
            .build-btn-ghost { order: 2; margin-left: 0; }
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
          .build-terminal-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .build-terminal-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .build-terminal-scroll::-webkit-scrollbar-thumb {
            background: #2e2c28;
            border-radius: 3px;
          }
          .build-terminal-scroll::-webkit-scrollbar-thumb:hover {
            background: #4a4640;
          }
          .build-terminal-scroll {
            scrollbar-width: thin;
            scrollbar-color: #2e2c28 transparent;
          }
        `}</style>
      </div>
    </div>
  );
}

/**
 * Mounted once per page (in BrowserChrome), because the desktop and phone Build buttons both exist in the DOM.
 * Shows the modal while the session is open and keeps the page's side effects (body class, focus, announcements).
 */
export function BuildOverlayHost() {
  const router = useRouter();
  const pathname = usePathname();
  const snap = useBuildSession();
  const wasOpen = useRef(false);

  // Hides toolbars and the Build button while the modal is up, and gives them back when it is hidden.
  useEffect(() => {
    if (!snap.open) return;
    document.body.classList.add("is-building");
    return () => document.body.classList.remove("is-building");
  }, [snap.open]);

  // Back to the button that opened the modal, once it is visible again.
  useEffect(() => {
    if (wasOpen.current && !snap.open) {
      const el = takeTrigger();
      if (el) requestAnimationFrame(() => el.focus({ preventScroll: true }));
    }
    wasOpen.current = snap.open;
  }, [snap.open]);

  const visit = useCallback(() => {
    // Canvas saves are debounced, so collect again now that the build has run for a few seconds.
    commitOverridesFromCanvases();
    // End the session first, or the modal would be waiting open when the visitor comes back to the sketch.
    dismissBuild();
    router.push(`/rendered${pathname === "/" ? "" : pathname}`);
  }, [router, pathname]);

  // A build that ends while the modal is hidden is announced, since nothing else on screen is read out.
  const announcement = snap.open
    ? ""
    : snap.phase === "done"
    ? "Build ready. Use the Build button to view it."
    : snap.phase === "stopped"
    ? "Build stopped."
    : "";

  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {snap.open && <BuildOverlay snap={snap} onVisit={visit} />}
    </>
  );
}

function BuildSpinner({ size }: { size: number }) {
  // Same box as the icons, so swapping them never changes the button's height.
  return (
    <span style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }} aria-hidden="true">
      <span className="build-button-spinner" />
    </span>
  );
}

function BuildCheck({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="#1a1a1a" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 7.5l3 3 6-6.5" />
    </svg>
  );
}

function buttonText(phase: BuildPhase, progress: number, variant: "floating" | "inline") {
  const pct = `${Math.round(progress)}%`;
  switch (phase) {
    case "running":
      return variant === "floating" ? `Building ${pct}` : pct;
    case "stopping":
      return "Stopping...";
    case "stopped":
      return variant === "floating" ? "Build stopped" : "Stopped";
    case "done":
      return variant === "floating" ? "Build ready" : "Ready";
    default:
      return "Build";
  }
}

function buttonDescription(phase: BuildPhase, progress: number) {
  switch (phase) {
    case "running":
      return `Build running, ${Math.round(progress)} percent. Show build output`;
    case "stopping":
      return "Build is stopping. Show build output";
    case "stopped":
      return "Build stopped. Show build output";
    case "done":
      return "Build ready. Show build output";
    default:
      return "Build high-fidelity version";
  }
}

/**
 * Starts a build, or, while one is running or finished, brings its window back. The label follows the build.
 * The modal itself is `BuildOverlayHost`.
 */
export function BuildButton({
  variant = "floating",
  className = "",
}: {
  variant?: "floating" | "inline";
  className?: string;
}) {
  const snap = useBuildSession();
  const { phase, progress } = snap;
  const idle = phase === "idle";
  const busy = phase === "running" || phase === "stopping";

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const from = e.currentTarget;
      if (getSnapshot().phase !== "idle") {
        openBuild(from);
        return;
      }
      commitOverridesFromCanvases();
      const cached = wasBuiltBefore();
      startBuild(cached ? CACHED_LINES : BUILD_LINES, cached, from);
    },
    [],
  );

  const iconSize = variant === "floating" ? 14 : 12;

  return (
    <button
      className={`build-button ${className}`}
      data-phase={phase}
      data-variant={variant}
      onClick={handleClick}
      aria-label={buttonDescription(phase, progress)}
      title={buttonDescription(phase, progress)}
      style={variant === "floating" ? {
        position: "fixed",
        bottom: 48,
        right: 24,
        zIndex: 600,
        pointerEvents: "auto",
        // Compact while idle. It widens once when a build starts, to fit the longest label ("Build stopped"),
        // and keeps that width until the build is dismissed. Content is left aligned, so changing text moves nothing.
        width: idle ? 90 : 146,
        height: 38,
        boxSizing: "border-box",
        justifyContent: "flex-start",
        whiteSpace: "nowrap",
        alignItems: "center",
        gap: 7,
        fontFamily: "'Loranthus', sans-serif",
        fontSize: 13,
        fontVariantNumeric: "tabular-nums",
        color: "#1a1a1a",
        background: "#fff",
        border: "1.5px solid #1a1a1a",
        borderRadius: 8,
        padding: "0 14px",
        cursor: "pointer",
        transition: "background 0.15s, transform 0.15s, box-shadow 0.15s, width 0.2s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      } : {
        // Same rule: one widening when a build starts (wide enough for "Stopping..."), then no change.
        width: idle ? 60 : 84,
        boxSizing: "border-box",
        justifyContent: "flex-start",
        whiteSpace: "nowrap",
        flexShrink: 0,
        alignItems: "center",
        gap: 5,
        height: "100%",
        padding: "0 8px",
        border: "none",
        borderLeft: "1px solid #1a1a1a",
        background: "#fff",
        color: "#1a1a1a",
        fontSize: 11,
        fontVariantNumeric: "tabular-nums",
        fontFamily: "'Loranthus', sans-serif",
        cursor: "pointer",
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        transition: "background 0.15s, width 0.2s ease",
        pointerEvents: "auto",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f5f5f0";
        if (variant === "floating") {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff";
        if (variant === "floating") {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        }
      }}
    >
      {busy ? (
        <BuildSpinner size={iconSize} />
      ) : phase === "done" ? (
        <BuildCheck size={iconSize} />
      ) : (
        <svg width={iconSize} height={iconSize} viewBox="0 0 14 14" fill="none" stroke="#1a1a1a" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="1.5" y="3" width="11" height="8.5" rx="1" />
          <path d="M4.5 6l2 1.5-2 1.5" />
          <path d="M8 9h2" />
          <path d="M1.5 5.5h11" />
        </svg>
      )}
      <span>{buttonText(phase, progress, variant)}</span>
    </button>
  );
}
