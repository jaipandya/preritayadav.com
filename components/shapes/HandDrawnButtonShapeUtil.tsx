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
  resizeBox,
  useIsEditing,
  useEditor,
} from "tldraw";
import { wobblyRect } from "@/lib/variationSeed";
import { useCallback, useRef, useEffect } from "react";

type HandDrawnButtonShape = TLShape<"hand-drawn-button">;

function ButtonComponent({ shape }: { shape: HandDrawnButtonShape }) {
  const { w, h, label } = shape.props;
  const borderPath = wobblyRect(shape.id, w, h, 2);
  const isEditing = useIsEditing(shape.id);
  const editor = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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

  return (
    <HTMLContainer
      style={{
        width: w,
        height: h,
        position: "relative",
        fontFamily: "'Loranthus', cursive",
        cursor: "pointer",
        pointerEvents: "all",
      }}
    >
      <svg width={w} height={h} style={{ position: "absolute", top: 0, left: 0 }}>
        <path d={borderPath} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
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
              fontFamily: "'Loranthus', cursive",
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
