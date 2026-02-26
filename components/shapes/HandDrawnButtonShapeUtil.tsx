"use client";

import "@/lib/shapeTypes";
import {
  ShapeUtil,
  HTMLContainer,
  Geometry2d,
  Rectangle2d,
  T,
  type TLShape,
  type RecordProps,
  type TLResizeInfo,
  type TLEventInfo,
  resizeBox,
  useIsEditing,
  useEditor,
} from "tldraw";
import { wobblyRect } from "@/lib/variationSeed";
import { useCallback, useRef, useEffect, useState } from "react";

type HandDrawnButtonShape = TLShape<"hand-drawn-button">;

function ButtonComponent({ shape }: { shape: HandDrawnButtonShape }) {
  const { w, h, label } = shape.props;
  const borderPath = wobblyRect(shape.id, w, h, 2);
  const isEditing = useIsEditing(shape.id);
  const editor = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleEvent = (event: TLEventInfo) => {
      if (event.type !== "pointer") return;
      const tool = editor.getCurrentToolId();
      if (tool !== "browse") {
        setHovered(false);
        setPressed(false);
        return;
      }

      if (event.name === "pointer_move") {
        const pagePoint = editor.screenToPage(event.point);
        const shapesAtPoint = editor.getShapesAtPoint(pagePoint, {
          hitInside: true,
          margin: 0,
        });
        const isOver = shapesAtPoint.some((s) => s.id === shape.id);
        setHovered(isOver);
        if (!isOver) setPressed(false);
      }

      if (event.name === "pointer_down") {
        const pagePoint = editor.screenToPage(event.point);
        const shapesAtPoint = editor.getShapesAtPoint(pagePoint, {
          hitInside: true,
          margin: 0,
        });
        if (shapesAtPoint.some((s) => s.id === shape.id)) {
          setPressed(true);
        }
      }

      if (event.name === "pointer_up") {
        setPressed(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.on("event", handleEvent as any);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.off("event", handleEvent as any);
    };
  }, [editor, shape.id]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      editor.updateShape({
        id: shape.id,
        type: "hand-drawn-button",
        props: { label: e.target.value },
      });
    },
    [editor, shape.id]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        editor.setEditingShape(null);
      }
      e.stopPropagation();
    },
    [editor]
  );

  const fillColor = pressed
    ? "rgba(26, 26, 26, 0.12)"
    : hovered
      ? "rgba(26, 26, 26, 0.06)"
      : "none";
  const strokeWidth = hovered || pressed ? 2 : 1.5;

  return (
    <HTMLContainer
      style={{
        width: w,
        height: h,
        position: "relative",
        fontFamily: "'Loranthus', sans-serif",
        cursor: "pointer",
        pointerEvents: "all",
        transform: pressed ? "scale(0.96)" : "none",
        transition: "transform 0.15s ease",
      }}
    >
      <svg width={w} height={h} style={{ position: "absolute", top: 0, left: 0 }}>
        <path
          d={borderPath}
          fill={fillColor}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          style={{ transition: "fill 0.15s ease, stroke-width 0.15s ease" }}
        />
      </svg>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          fontSize: 15,
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              textAlign: "center",
              width: "90%",
              fontSize: 15,
              fontFamily: "'Loranthus', sans-serif",
              border: "none",
              outline: "1px dashed #999",
              background: "rgba(255,255,200,0.15)",
              padding: "2px 4px",
              color: "#1a1a1a",
            }}
          />
        ) : (
          label
        )}
      </div>
    </HTMLContainer>
  );
}

export class HandDrawnButtonShapeUtil extends ShapeUtil<HandDrawnButtonShape> {
  static override type = "hand-drawn-button" as const;

  static override props: RecordProps<HandDrawnButtonShape> = {
    w: T.number,
    h: T.number,
    label: T.string,
  };

  getDefaultProps(): HandDrawnButtonShape["props"] {
    return {
      w: 140,
      h: 40,
      label: "Click me",
    };
  }

  getGeometry(shape: HandDrawnButtonShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override canEdit() {
    return true;
  }

  override onResize(shape: HandDrawnButtonShape, info: TLResizeInfo<HandDrawnButtonShape>) {
    return resizeBox(shape, info);
  }

  component(shape: HandDrawnButtonShape) {
    return <ButtonComponent shape={shape} />;
  }

  indicator(shape: HandDrawnButtonShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
