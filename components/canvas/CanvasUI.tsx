"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { track, useEditor } from "tldraw";
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

const toolItems: { id: string; label: string; icon: ReactNode }[] = [
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

  const dividerStyle = {
    width: 1,
    background: "#ddd",
    margin: isMobile ? "4px 2px" : "4px 4px",
  } as const;

  return createPortal(
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
    </div>,
    document.body
  );
});
