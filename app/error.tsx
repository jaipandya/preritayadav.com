"use client";

import { BrowserChrome } from "@/components/canvas/BrowserChrome";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <BrowserChrome>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Loranthus', cursive",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 48 }}>Oops!</div>
          <div style={{ fontSize: 18, opacity: 0.7 }}>
            Something broke. Let&apos;s try that again.
          </div>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 28px",
              fontSize: 16,
              fontFamily: "'Loranthus', cursive",
              background: "none",
              border: "1.5px solid #1a1a1a",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </BrowserChrome>
    </div>
  );
}
