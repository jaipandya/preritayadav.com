"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const BUILD_LINES: Array<{ text: string; delay: number }> = [
  { text: "▸ Launching build agent...", delay: 0 },
  { text: "  Agent: prerita-portfolio-builder v0.1", delay: 500 },
  { text: "  Mode: sketch → high-fidelity render", delay: 350 },
  { text: "", delay: 600 },
  { text: "▸ Reading source of truth...", delay: 500 },
  { text: "  Loading content modules from lib/", delay: 350 },
  { text: "  Found landingContent.ts, aboutContent.ts, contactContent.ts, workData.ts", delay: 420 },
  { text: "  Loaded 9 work items, 5 blog posts, 3 outside-work entries", delay: 300 },
  { text: "", delay: 500 },

  { text: "▸ Analyzing current sketch layout...", delay: 700 },
  { text: "  Reading tldraw shape tree from createLandingLayout.ts", delay: 550 },
  { text: "  ✓ Hero: greeting + name (h1) + subtitle + CTA button", delay: 280 },
  { text: "  ✓ Featured work: 3 ProjectCard shapes linked to /work/[slug]", delay: 320 },
  { text: "  ✓ Writing section: 5 blog post entries with external hrefs", delay: 300 },
  { text: "  ✓ Testimonial: blockquote shape with kind-words heading", delay: 260 },
  { text: "  ✓ Outside work: 3 OutsideWorkCard shapes (mentoring, travel, tinkering)", delay: 340 },
  { text: "  ✓ Company logos: 8 CompanyLogo shapes in a row", delay: 280 },
  { text: "  ✓ Contact links: 5 ContactMe icon links", delay: 240 },
  { text: "  ✓ Footer: closing text + CTA + navigation links", delay: 260 },
  { text: "  Shape count: 47 shapes across 8 semantic sections", delay: 380 },
  { text: "", delay: 600 },

  { text: "▸ Planning component architecture...", delay: 800 },
  { text: "  Mapping sketch shapes → React components", delay: 450 },
  { text: "  Layout strategy: asymmetric 2-column hero, single-column content", delay: 380 },
  { text: "  Deciding full-bleed vs contained for each section", delay: 350 },
  { text: "", delay: 400 },

  { text: "▸ Scaffolding file structure...", delay: 600 },
  { text: "  mkdir app/rendered/", delay: 120 },
  { text: "  mkdir app/rendered/work/", delay: 100 },
  { text: "  mkdir app/rendered/work/[slug]/", delay: 100 },
  { text: "  mkdir app/rendered/about/", delay: 80 },
  { text: "  mkdir app/rendered/contact/", delay: 80 },
  { text: "  mkdir components/rendered/", delay: 100 },
  { text: "", delay: 400 },

  { text: "▸ Generating design tokens...", delay: 700 },
  { text: "  Selecting typefaces:", delay: 300 },
  { text: '    display: "Playfair Display" — high-contrast serif, italic for headlines', delay: 420 },
  { text: '    body: "Karla" — warm geometric sans, 400-700 weights', delay: 380 },
  { text: "  Building color palette:", delay: 280 },
  { text: "    --r-bg: #0F0E0C (warm near-black)", delay: 200 },
  { text: "    --r-text: #E8E4DC (warm off-white)", delay: 180 },
  { text: "    --r-accent: #D4A853 (aged gold)", delay: 200 },
  { text: "    --r-text-secondary: #A8A49B", delay: 160 },
  { text: "    --r-border: #2E2C28", delay: 140 },
  { text: "  Writing rendered.css (CSS variables, no Tailwind bleed)", delay: 350 },
  { text: "  Adding grain overlay: SVG feTurbulence at 0.03 opacity", delay: 300 },
  { text: "", delay: 500 },

  { text: "▸ Writing components...", delay: 700 },
  { text: "  RenderedNav.tsx — sticky nav, blur backdrop, mobile hamburger", delay: 450 },
  { text: "  RenderedFooter.tsx — 4-link footer, year auto-update", delay: 320 },
  { text: "  SketchToggle.tsx — fixed-position link back to sketch mode", delay: 300 },
  { text: "", delay: 400 },

  { text: "▸ Building pages from content modules...", delay: 800 },
  { text: "", delay: 200 },
  { text: "  [1/5] app/rendered/page.tsx", delay: 500 },
  { text: "    Importing hero, blogPosts, outsideWork, teamsWorkedWith, testimonial...", delay: 380 },
  { text: "    Hero section: 2-column grid, left=text+CTA, right=stat counters", delay: 420 },
  { text: "    Featured work: vertical list with number, company, title, tagline, arrow", delay: 380 },
  { text: "    Testimonial: full-bleed band with giant italic quotation mark", delay: 350 },
  { text: "    Writing: bordered list items with external arrows", delay: 300 },
  { text: "    Outside work: horizontal scroll track with cards", delay: 320 },
  { text: "    Teams: infinite marquee with company names", delay: 280 },
  { text: "    Contact: pill links with SVG icons", delay: 260 },
  { text: "    ✓ Page written — 7 sections, 220 lines", delay: 450 },
  { text: "", delay: 300 },
  { text: "  [2/5] app/rendered/work/page.tsx", delay: 400 },
  { text: "    Importing getMainWork(), getArchivedWork()", delay: 280 },
  { text: "    Two groups: Featured & Recent + Archive", delay: 300 },
  { text: "    ✓ Page written — 2 groups, 106 lines", delay: 350 },
  { text: "", delay: 250 },
  { text: "  [3/5] app/rendered/work/[slug]/page.tsx", delay: 400 },
  { text: "    Dynamic route with getWorkBySlug()", delay: 280 },
  { text: "    Sections: hero, meta grid, overview, challenge, process, approach, contributions, outcome", delay: 420 },
  { text: "    Prev/next navigation between case studies", delay: 300 },
  { text: "    ✓ Page written — 8 sections, 142 lines", delay: 380 },
  { text: "", delay: 250 },
  { text: "  [4/5] app/rendered/about/page.tsx", delay: 350 },
  { text: "    5 story paragraphs + outro + CTA", delay: 280 },
  { text: "    ✓ Page written — 62 lines", delay: 300 },
  { text: "", delay: 200 },
  { text: "  [5/5] app/rendered/contact/page.tsx", delay: 300 },
  { text: "    Email CTA + social link pills", delay: 240 },
  { text: "    ✓ Page written — 48 lines", delay: 280 },
  { text: "", delay: 500 },

  { text: "▸ Configuring animations (motion/react)...", delay: 700 },
  { text: "  Shared variants in lib/renderedAnimations.ts:", delay: 350 },
  { text: "    fadeUp: opacity 0→1, y 24→0, stagger 80ms", delay: 280 },
  { text: "    ease: cubic-bezier(0.22, 1, 0.36, 1)", delay: 240 },
  { text: "  Per-section scroll triggers with viewport: { once: true }", delay: 320 },
  { text: "  Hero: staggered entrance, right column slides from x:30", delay: 300 },
  { text: "  Testimonial band: opacity fade on scroll", delay: 260 },
  { text: "  Work items: hover glow + arrow translate", delay: 240 },
  { text: "  Teams marquee: 30s linear infinite translateX", delay: 260 },
  { text: "", delay: 400 },

  { text: "▸ Writing layout wrapper...", delay: 500 },
  { text: "  app/rendered/layout.tsx:", delay: 250 },
  { text: "    <RenderedNav /> + <main>{children}</main> + <RenderedFooter />", delay: 320 },
  { text: "    Grain overlay div (aria-hidden)", delay: 240 },
  { text: "    SketchToggle fixed bottom-right", delay: 220 },
  { text: "    Canonical: https://preritayadav.com (sketch is primary)", delay: 300 },
  { text: "    robots: noindex, follow", delay: 200 },
  { text: "", delay: 400 },

  { text: "▸ Compiling...", delay: 800 },
  { text: "  TypeScript check... ✓ passed", delay: 600 },
  { text: "  CSS modules... ✓ 14.2 KB (zero namespace conflicts)", delay: 400 },
  { text: "  motion/react tree-shake... ✓ 8.2 KB gzipped", delay: 350 },
  { text: "  Font subsetting... ✓ Playfair Display 42 KB, Karla 28 KB", delay: 380 },
  { text: "", delay: 400 },

  { text: "▸ Static generation...", delay: 600 },
  { text: "  ○ /rendered", delay: 200 },
  { text: "  ○ /rendered/work", delay: 180 },
  { text: "  ○ /rendered/about", delay: 160 },
  { text: "  ○ /rendered/contact", delay: 160 },
  { text: "  ƒ /rendered/work/[slug] — 9 pages", delay: 300 },
  { text: "  ✓ 13 pages generated in 420ms", delay: 400 },
  { text: "", delay: 600 },

  { text: "✓ Build complete. Ready to view.", delay: 500 },
];

const CACHED_LINES: Array<{ text: string; delay: number }> = [
  { text: "▸ Launching build agent...", delay: 0 },
  { text: "  Agent: prerita-portfolio-builder v0.1", delay: 400 },
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
  { text: "  ƒ /rendered/work/[slug] — 9 pages", delay: 200 },
  { text: "", delay: 300 },
  { text: "✓ Cached build restored. Ready to view.", delay: 400 },
];

export function BuildOverlay({
  onComplete,
  onReset,
  cached = false,
}: {
  onComplete: () => void;
  onReset: () => void;
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
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
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          height: 420,
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
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3d3b36" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3d3b36" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3d3b36" }} />
            </div>
            <span style={{ color: "#706c64", fontSize: 11 }}>
              build — preritayadav.com
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
                  : line.startsWith("  font-") || line.startsWith("  palette") || line.startsWith("  grain") || line.startsWith("    --r-") || line.startsWith('    display:') || line.startsWith('    body:')
                  ? "#b89a6a"
                  : line.startsWith("$")
                  ? "#706c64"
                  : line.startsWith("▸")
                  ? "#e8e4dc"
                  : line.startsWith("  ○")
                  ? "#706c64"
                  : line.startsWith("  ƒ")
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
                gap: 16,
                flexWrap: "wrap",
              }}
            >
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
    router.push(renderedPath);
  }, [router, renderedPath]);

  const handleClick = useCallback(() => {
    let cached = false;
    try { cached = sessionStorage.getItem("prerita-build-done") === "1"; } catch {}
    setIsCached(cached);
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
        className={className}
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

      {building && <BuildOverlay onComplete={handleComplete} onReset={handleReset} cached={isCached} />}
    </>
  );
}
