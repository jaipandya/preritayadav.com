"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/ui/TopNav";
import { Footer } from "@/components/ui/Footer";

const BROWSER_MAX_WIDTH = 840;
const MARGIN_Y = 24;
const MARGIN_X = 32;

function pathnameToUrl(pathname: string): string {
  if (pathname === "/") return "preritayadav.com";
  return `preritayadav.com${pathname}`;
}

export function BrowserChrome({ children }: { children: React.ReactNode }) {
  const chromeH = 44;
  const dotR = 5;
  const pathname = usePathname();
  const displayUrl = pathnameToUrl(pathname);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: `${MARGIN_Y}px ${MARGIN_X}px`,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: BROWSER_MAX_WIDTH,
          height: `calc(100dvh - ${MARGIN_Y * 2}px)`,
          display: "flex",
          flexDirection: "column",
          border: "1.5px solid #1a1a1a",
          borderRadius: 6,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* Browser chrome bar */}
        <div
          style={{
            height: chromeH,
            borderBottom: "1.5px solid #1a1a1a",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            pointerEvents: "auto",
            flexShrink: 0,
            fontFamily: "'Loranthus', sans-serif",
          }}
        >
          {/* Left: traffic lights — flex:1 so they mirror the right spacer */}
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <svg width={52} height={chromeH}>
              <circle cx={12} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
              <circle cx={26} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
              <circle cx={40} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
            </svg>
          </div>

          {/* Center: address bar */}
          <div
            style={{
              width: "50%",
              maxWidth: 360,
              minWidth: 0,
              height: 26,
              position: "relative",
              flexShrink: 1,
            }}
          >
            <svg
              width="100%"
              height={26}
              preserveAspectRatio="none"
              viewBox="0 0 360 26"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <rect x={1} y={1} width={358} height={24} rx={4} fill="none" stroke="#1a1a1a" strokeWidth={1} />
            </svg>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: 13,
                padding: "4px 10px",
                opacity: 0.6,
                textAlign: "center",
              }}
            >
              {displayUrl}
            </div>
          </div>

          {/* Right: spacer — flex:1 mirrors the left to keep address bar centered */}
          <div style={{ flex: 1 }} />
        </div>

        {/* Top navigation */}
        <TopNav />

        {/* Canvas viewport */}
        <div style={{ flex: 1, position: "relative", pointerEvents: "auto", overflow: "hidden" }}>
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
