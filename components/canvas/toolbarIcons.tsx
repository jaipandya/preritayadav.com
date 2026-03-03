import type { CSSProperties, ReactNode } from "react";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const baseStyle: CSSProperties = {
  display: "block",
};

function IconFrame({
  children,
  size = 16,
  color = "#1a1a1a",
  strokeWidth = 1.3,
  viewBox = "0 0 16 16",
}: IconProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={baseStyle}
    >
      {children}
    </svg>
  );
}

export function BrowseIcon() {
  return (
    <IconFrame strokeWidth={1.2}>
      <path d="M5.5 9V4a1 1 0 0 1 2 0v5" />
      <path d="M7.5 3.5a1 1 0 0 1 2 0V9" />
      <path d="M9.5 4.5a1 1 0 0 1 2 0V9" />
      <path d="M11.5 6a1 1 0 0 1 2 0v3.5a5 5 0 0 1-5 5h-.5a5 5 0 0 1-5-5V7a1 1 0 0 1 2 0v2" />
    </IconFrame>
  );
}

export function SelectIcon() {
  return (
    <IconFrame>
      <path d="M4 1l0 12 3.5-3.5 3 5 2-1-3-5 4-.5z" />
    </IconFrame>
  );
}

export function DrawIcon() {
  return (
    <IconFrame>
      <path d="M2 14l1.5-4L12 1.5 14.5 4 6 12.5z" />
      <path d="M3.5 10L6 12.5" />
    </IconFrame>
  );
}

export function TextIcon() {
  return (
    <IconFrame strokeWidth={1.5}>
      <path d="M3 3h10" />
      <path d="M8 3v10" />
      <path d="M5.5 13h5" />
    </IconFrame>
  );
}

export function EraserIcon() {
  return (
    <IconFrame>
      <path d="M10 2l4 4-7 7H3L1 11l9-9z" />
      <path d="M6 6l4 4" />
      <path d="M3 13h10" />
    </IconFrame>
  );
}

export function SpeakerOnIcon() {
  return (
    <IconFrame>
      <path d="M3 6H1v4h2l4 3V3L3 6z" />
      <path d="M11 5a4 4 0 0 1 0 6" />
      <path d="M13.5 2.5a7 7 0 0 1 0 11" />
    </IconFrame>
  );
}

export function SpeakerOffIcon() {
  return (
    <IconFrame>
      <path d="M3 6H1v4h2l4 3V3L3 6z" />
      <path d="M13 6l-3 4" />
      <path d="M10 6l3 4" />
    </IconFrame>
  );
}

export function ResetIcon() {
  return (
    <IconFrame viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M3 2v6h6" />
      <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
    </IconFrame>
  );
}

export function UndoIcon() {
  return (
    <IconFrame viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h11a4 4 0 1 1 0 8h-1" />
    </IconFrame>
  );
}

export function RedoIcon() {
  return (
    <IconFrame viewBox="0 0 24 24" strokeWidth={2}>
      <path d="m15 14 5-5-5-5" />
      <path d="M20 9H9a4 4 0 1 0 0 8h1" />
    </IconFrame>
  );
}
