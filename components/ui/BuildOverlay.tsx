"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { commitOverridesFromCanvases } from "@/lib/contentOverrides";

const BUILD_LINES: Array<{ text: string; delay: number }> = [
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
  { text: "  ✓ Outside work: mentoring, travel, tinkering", delay: 280 },
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
  { text: "  Rows: logo tile, title, one-line description, soft hover", delay: 300 },
  { text: "  Mark.tsx: logo tile with initial fallback", delay: 260 },
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
  { text: "    Portrait, story paragraphs, closing note", delay: 280 },
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
  { text: "    Canonical: https://preritayadav.com (sketch is primary)", delay: 300 },
  { text: "    robots: noindex, follow", delay: 200 },
  { text: "", delay: 400 },

  { text: "▸ Compiling...", delay: 800 },
  { text: "  TypeScript check... ✓ passed", delay: 600 },
  { text: "  Stylesheet... ✓ one file, no unused rules", delay: 400 },
  { text: "  Client JavaScript... ✓ text components only, no animation library", delay: 350 },
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

const CACHED_LINES: Array<{ text: string; delay: number }> = [
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

export function BuildOverlay({
  onComplete,
  onReset,
  onClose,
  cached = false,
}: {
  onComplete: () => void;
  onReset: () => void;
  onClose: () => void;
  cached?: boolean;
}) {
  const [done, setDone] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const source = cached ? CACHED_LINES : BUILD_LINES;
    let totalDelay = 0;
    const totalLines = source.length;
    const timers: ReturnType<typeof setTimeout>[] = [];

    source.forEach((line, i) => {
      totalDelay += line.delay;
      const timer = setTimeout(() => {
        if (!mountedRef.current) return;
        setLines((prev) => [...prev, line.text]);
        setProgress(Math.min(((i + 1) / totalLines) * 100, 100));

        if (i === totalLines - 1) {
          if (!cached) {
            try { sessionStorage.setItem("prerita-build-done", "1"); } catch {}
          }
          setDone(true);
        }
      }, totalDelay);
      timers.push(timer);
    });

    return () => {
      mountedRef.current = false;
      timers.forEach(clearTimeout);
    };
  }, [cached]);

  useEffect(() => {
    document.body.classList.add("is-building");
    return () => document.body.classList.remove("is-building");
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

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
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close modal"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          color: "#fff",
          cursor: "pointer",
          zIndex: 10,
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.4)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          height: "100%",
          maxHeight: 420,
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
                onClick={onClose}
                aria-label="Close build output"
                style={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: "50%", 
                  background: "#ff5f56",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }} 
              />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
            </div>
            <span style={{ color: "#706c64", fontSize: 11, marginLeft: 4 }}>
              build: preritayadav.com
            </span>
          </div>
          <span style={{ color: "#D4A853", fontSize: 11, fontWeight: 600 }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "#1e1d1a", flexShrink: 0 }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #D4A853, #B8923F)",
              transition: "width 0.3s ease-out",
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
                color: line.startsWith("✓ Build") || line.startsWith("✓ 13 pages")
                  ? "#D4A853"
                  : line.startsWith("  ✓")
                  ? "#7a9e6a"
                  : line.startsWith("  →") || line.startsWith("  [")
                  ? "#8a9eb5"
                  : line.startsWith("  font-") || line.startsWith("  palette") || line.startsWith("    --r-") || line.startsWith('    sans:') || line.startsWith('    mono:')
                  ? "#b89a6a"
                  : line.startsWith("$")
                  ? "#706c64"
                  : line.startsWith("▸")
                  ? "#e8e4dc"
                  : line.startsWith("  ○")
                  ? "#706c64"
                  : line.startsWith("  ƒ") || line.startsWith("  ●")
                  ? "#8a9eb5"
                  : undefined,
                fontWeight: line.startsWith("▸") || line.startsWith("✓") ? 600 : 400,
              }}
            >
              {line}
            </div>
          ))}
          {lines.length > 0 && !lines[lines.length - 1]?.startsWith("✓") && (
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
          {done && (
            <div
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid #1e1d1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                  }}
                  style={{
                    background: "#D4A853",
                    border: "1px solid #B8923F",
                    color: "#0f0e0c",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "6px 12px",
                    borderRadius: 4,
                    fontFamily: "inherit",
                    transition: "background 0.15s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E8BC5E";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#D4A853";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Visit rendered page →
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReset();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#706c64",
                    fontSize: 11,
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "inherit",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#a8a49b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#706c64";
                  }}
                >
                  Rebuild without cache
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #2e2c28",
                  color: "#a8a49b",
                  fontSize: 11,
                  cursor: "pointer",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontFamily: "inherit",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1e1d1a";
                  e.currentTarget.style.color = "#d4d0c8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#a8a49b";
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <style>{`
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

export function BuildButton({ 
  variant = "floating",
  className = ""
}: { 
  variant?: "floating" | "inline",
  className?: string
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [building, setBuilding] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const renderedPath = `/rendered${pathname === "/" ? "" : pathname}`;

  const handleComplete = useCallback(() => {
    // Canvas saves are debounced, so collect again now that the build has run for a few seconds.
    commitOverridesFromCanvases();
    router.push(renderedPath);
  }, [router, renderedPath]);

  const handleClick = useCallback(() => {
    let cached = false;
    try { cached = sessionStorage.getItem("prerita-build-done") === "1"; } catch {}
    setIsCached(cached);
    commitOverridesFromCanvases();
    setBuilding(true);
  }, []);

  const handleReset = useCallback(() => {
    try { sessionStorage.removeItem("prerita-build-done"); } catch {}
    setBuilding(false);
    setIsCached(false);
    setTimeout(() => {
      setBuilding(true);
    }, 100);
  }, []);

  return (
    <>
      <button
        className={`build-button ${className}`}
        onClick={handleClick}
        style={variant === "floating" ? {
          position: "fixed",
          bottom: 48,
          right: 24,
          zIndex: 600,
          pointerEvents: "auto",
          alignItems: "center",
          gap: 7,
          fontFamily: "'Loranthus', sans-serif",
          fontSize: 13,
          color: "#1a1a1a",
          background: "#fff",
          border: "1.5px solid #1a1a1a",
          borderRadius: 8,
          padding: "8px 16px",
          cursor: "pointer",
          transition: "background 0.15s, transform 0.15s, box-shadow 0.15s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        } : {
          alignItems: "center",
          gap: 5,
          height: "100%",
          padding: "0 8px",
          border: "none",
          borderLeft: "1px solid #1a1a1a",
          background: "#fff",
          color: "#1a1a1a",
          fontSize: 11,
          fontFamily: "'Loranthus', sans-serif",
          cursor: "pointer",
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          transition: "background 0.15s",
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => {
          if (variant === "floating") {
            e.currentTarget.style.background = "#f5f5f0";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
          } else {
            e.currentTarget.style.background = "#f5f5f0";
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "floating") {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
          } else {
            e.currentTarget.style.background = "#fff";
          }
        }}
        title="Build high-fidelity version"
      >
        <svg width={variant === "floating" ? 14 : 12} height={variant === "floating" ? 14 : 12} viewBox="0 0 14 14" fill="none" stroke="#1a1a1a" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
          <rect x="1.5" y="3" width="11" height="8.5" rx="1" />
          <path d="M4.5 6l2 1.5-2 1.5" />
          <path d="M8 9h2" />
          <path d="M1.5 5.5h11" />
        </svg>
        Build
      </button>

      {building && <BuildOverlay onComplete={handleComplete} onReset={handleReset} onClose={() => setBuilding(false)} cached={isCached} />}
    </>
  );
}
