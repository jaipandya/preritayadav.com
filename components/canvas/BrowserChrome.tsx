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
          {/* Left: traffic lights */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <svg width={52} height={chromeH}>
              <circle cx={12} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
              <circle cx={26} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
              <circle cx={40} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
            </svg>
          </div>

          {/* Address bar — fills remaining space up to the right edge */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              height: 26,
              position: "relative",
              marginLeft: 12,
              border: "1px solid #1a1a1a",
              borderRadius: 4,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: 13,
                padding: "0 10px",
                opacity: 0.6,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {displayUrl}
            </div>
          </div>


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
