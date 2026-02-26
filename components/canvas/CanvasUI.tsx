"use client";

import { track, useEditor } from "tldraw";

function BrowseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 9V4a1 1 0 0 1 2 0v5" />
      <path d="M7.5 3.5a1 1 0 0 1 2 0V9" />
      <path d="M9.5 4.5a1 1 0 0 1 2 0V9" />
      <path d="M11.5 6a1 1 0 0 1 2 0v3.5a5 5 0 0 1-5 5h-.5a5 5 0 0 1-5-5V7a1 1 0 0 1 2 0v2" />
    </svg>
  );
}

function SelectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 1l0 12 3.5-3.5 3 5 2-1-3-5 4-.5z" />
    </svg>
  );
}

function DrawIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14l1.5-4L12 1.5 14.5 4 6 12.5z" />
      <path d="M3.5 10L6 12.5" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h10" />
      <path d="M8 3v10" />
      <path d="M5.5 13h5" />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l4 4-7 7H3L1 11l9-9z" />
      <path d="M6 6l4 4" />
      <path d="M3 13h10" />
    </svg>
  );
}

const toolItems: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "browse", label: "Browse", icon: <BrowseIcon /> },
  { id: "select", label: "Select", icon: <SelectIcon /> },
  { id: "draw", label: "Draw", icon: <DrawIcon /> },
  { id: "text", label: "Text", icon: <TextIcon /> },
  { id: "eraser", label: "Eraser", icon: <EraserIcon /> },
];

export const CanvasUI = track(function CanvasUI({
  onReset,
}: {
  onReset: () => void;
}) {
  const editor = useEditor();
  const currentTool = editor.getCurrentToolId();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 48,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        pointerEvents: "all",
        display: "flex",
        gap: 4,
        padding: "6px 10px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.95)",
        border: "1.5px solid #1a1a1a",
        fontFamily: "'Loranthus', sans-serif",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {toolItems.map((tool) => (
        <button
          key={tool.id}
          title={tool.label}
          onClick={() => editor.setCurrentTool(tool.id)}
          style={{
            width: 36,
            height: 36,
            border: currentTool === tool.id ? "1.5px solid #1a1a1a" : "1px solid transparent",
            borderRadius: 8,
            background: currentTool === tool.id ? "#f0f0f0" : "transparent",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Loranthus', sans-serif",
          }}
        >
          {tool.icon}
        </button>
      ))}

      <div
        style={{
          width: 1,
          background: "#ddd",
          margin: "4px 4px",
        }}
      />

      <button
        title="Undo"
        onClick={() => editor.undo()}
        style={{
          width: 36,
          height: 36,
          border: "1px solid transparent",
          borderRadius: 8,
          background: "transparent",
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ display: "inline-block", transform: "scaleY(-1)" }}>↩</span>
      </button>
      <button
        title="Redo"
        onClick={() => editor.redo()}
        style={{
          width: 36,
          height: 36,
          border: "1px solid transparent",
          borderRadius: 8,
          background: "transparent",
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ display: "inline-block", transform: "scaleY(-1)" }}>↪</span>
      </button>

      <div
        style={{
          width: 1,
          background: "#ddd",
          margin: "4px 4px",
        }}
      />

      <button
        title="Reset to default"
        onClick={onReset}
        style={{
          height: 36,
          padding: "0 12px",
          border: "1px solid transparent",
          borderRadius: 8,
          background: "transparent",
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "'Loranthus', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Reset
      </button>
    </div>
  );
});
