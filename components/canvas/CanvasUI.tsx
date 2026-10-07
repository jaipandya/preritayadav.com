"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { track, useEditor, type ToolId } from "@/lib/canvas";
import { sounds, withSound } from "@/lib/sounds";
import { useSoundEnabled } from "@/lib/useSoundEnabled";
import { ToolbarIconButton } from "@/components/canvas/ToolbarIconButton";
import {
  BrowseIcon,
  DrawIcon,
  EraserIcon,
  RedoIcon,
  ResetIcon,
  SelectIcon,
  SpeakerOffIcon,
  SpeakerOnIcon,
  TextIcon,
  UndoIcon,
} from "@/components/canvas/toolbarIcons";

const toolItems: { id: ToolId; label: string; icon: ReactNode }[] = [
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
  const [soundEnabled, toggleSound] = useSoundEnabled();
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(media.matches);
    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Double-tap is unreliable on a zoomed-out touch canvas, so offer an explicit way into text editing.
  const selected = editor.getOnlySelectedShape();
  const showEdit =
    isTouch &&
    currentTool === "select" &&
    !!selected &&
    editor.canEditShape(selected) &&
    !editor.getEditingShapeId();

  const startEditing = () => {
    if (!selected) return;
    editor.setEditingShape(selected);
  };

  const dividerStyle = {
    width: 1,
    background: "#ddd",
    margin: isMobile ? "4px 2px" : "4px 4px",
  } as const;

  return createPortal(
    <>
      {showEdit && (
        <button
          className="canvas-ui-toolbar"
          onClick={withSound("text-begin", startEditing)}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            bottom: 112,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            pointerEvents: "all",
            height: 40,
            padding: "0 16px",
            borderRadius: 10,
            border: "1.5px solid #1a1a1a",
            background: "#1a1a1a",
            color: "#fff",
            fontFamily: "'Loranthus', sans-serif",
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          Edit text
        </button>
      )}
    <div
      className="canvas-ui-toolbar"
      style={{
        position: "fixed",
        bottom: 48,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        pointerEvents: "all",
        display: "flex",
        gap: isMobile ? 2 : 4,
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
        <ToolbarIconButton
          key={tool.id}
          title={tool.label}
          onClick={withSound("tool", () => editor.setCurrentTool(tool.id))}
          active={currentTool === tool.id}
        >
          {tool.icon}
        </ToolbarIconButton>
      ))}

      <div style={dividerStyle} />

      <ToolbarIconButton
        title="Undo"
        onClick={withSound("undo", () => editor.undo())}
      >
        <UndoIcon />
      </ToolbarIconButton>
      <ToolbarIconButton
        title="Redo"
        onClick={withSound("redo", () => editor.redo())}
      >
        <RedoIcon />
      </ToolbarIconButton>

      <div style={dividerStyle} />

      <ToolbarIconButton
        title="Reset to default"
        onClick={withSound("reset", onReset)}
        iconOnly={isMobile}
      >
        {isMobile ? <ResetIcon /> : "Reset"}
      </ToolbarIconButton>

      <div style={dividerStyle} />

      <ToolbarIconButton
        title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
        onClick={() => {
          if (soundEnabled) {
            // Playing mute before toggle so the sound plays under the still-enabled gate.
            sounds.play("mute");
            toggleSound();
          } else {
            toggleSound();
            sounds.play("unmute");
          }
        }}
        dimmed={!soundEnabled}
      >
        {soundEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </ToolbarIconButton>
    </div>
    </>,
    document.body
  );
});
