"use client";

import { track, useEditor } from "tldraw";

const toolItems = [
  { id: "select", label: "Select", icon: "↖" },
  { id: "draw", label: "Draw", icon: "✎" },
  { id: "text", label: "Text", icon: "T" },
  { id: "eraser", label: "Eraser", icon: "◎" },
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
        bottom: 24,
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
        fontFamily: "'Loranthus', cursive",
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
            fontFamily: "'Loranthus', cursive",
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
        ↩
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
        ↪
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
          fontFamily: "'Loranthus', cursive",
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
