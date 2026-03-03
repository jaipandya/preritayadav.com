import type { ReactNode } from "react";

type ToolbarIconButtonProps = {
  title: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  dimmed?: boolean;
  iconOnly?: boolean;
  fontFamily?: string;
};

export function ToolbarIconButton({
  title,
  onClick,
  children,
  active = false,
  dimmed = false,
  iconOnly = true,
  fontFamily = "'Loranthus', sans-serif",
}: ToolbarIconButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: iconOnly ? 36 : "auto",
        height: 36,
        padding: iconOnly ? 0 : "0 12px",
        border: active ? "1.5px solid #1a1a1a" : "1px solid transparent",
        borderRadius: 8,
        background: active ? "#f0f0f0" : "transparent",
        cursor: "pointer",
        fontSize: 13,
        fontFamily,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: dimmed ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}
