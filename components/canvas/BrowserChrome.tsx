"use client";

export function BrowserChrome({ children }: { children: React.ReactNode }) {
  const chromeH = 44;
  const dotR = 5;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
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
          gap: 8,
          pointerEvents: "auto",
          position: "relative",
          zIndex: 501,
          fontFamily: "'Loranthus', cursive",
        }}
      >
        <svg width={52} height={chromeH} style={{ flexShrink: 0 }}>
          <circle cx={12} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
          <circle cx={26} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
          <circle cx={40} cy={chromeH / 2} r={dotR} fill="none" stroke="#1a1a1a" strokeWidth={1.2} />
        </svg>

        <div
          style={{
            flex: 1,
            maxWidth: 420,
            height: 26,
            position: "relative",
            marginLeft: 12,
          }}
        >
          <svg
            width="100%"
            height={26}
            preserveAspectRatio="none"
            viewBox="0 0 420 26"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <rect x={1} y={1} width={418} height={24} rx={4} fill="none" stroke="#1a1a1a" strokeWidth={1} />
          </svg>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              fontSize: 13,
              padding: "4px 10px",
              opacity: 0.6,
            }}
          >
            preritayadav.com
          </div>
        </div>

        <div style={{ marginLeft: "auto", fontSize: 13, opacity: 0.5 }}>
          Login
        </div>
      </div>

      {/* Canvas viewport - pass-through pointer events */}
      <div style={{ flex: 1, position: "relative", pointerEvents: "auto" }}>
        {children}
      </div>

      {/* Border frame lines - decorative only */}
      <div
        style={{
          position: "fixed",
          top: chromeH,
          left: 0,
          bottom: 0,
          width: 1.5,
          background: "#1a1a1a",
          pointerEvents: "none",
          zIndex: 502,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: chromeH,
          right: 0,
          bottom: 0,
          width: 1.5,
          background: "#1a1a1a",
          pointerEvents: "none",
          zIndex: 502,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1.5,
          background: "#1a1a1a",
          pointerEvents: "none",
          zIndex: 502,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 1.5,
          background: "#1a1a1a",
          zIndex: 503,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
