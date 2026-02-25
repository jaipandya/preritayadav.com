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
import { seededRandom } from "@/lib/variationSeed";
import { useCallback, useRef, useEffect, useState } from "react";
import type { TLEventInfo } from "tldraw";
import { isNavigable } from "@/lib/canvasMeta";

type AnnotationShape = TLShape<"annotation">;

function AnnotationComponent({ shape }: { shape: AnnotationShape }) {
  const { w, h, text, fontSize, showArrow, arrowDirection } = shape.props;
  const id = shape.id;
  const isEditing = useIsEditing(id);
  const editor = useEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasLink = isNavigable(shape);
  const [hovered, setHovered] = useState(false);

  // Track hover via tldraw's event system for linked annotations
  useEffect(() => {
    if (!hasLink) return;
    const handleEvent = (event: TLEventInfo) => {
      if (event.type !== "pointer") return;
      if (event.name === "pointer_move") {
        const pagePoint = editor.screenToPage(event.point);
        const shapesAtPoint = editor.getShapesAtPoint(pagePoint, {
          hitInside: true,
          margin: 0,
        });
        setHovered(shapesAtPoint.some((s) => s.id === shape.id));
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.on("event", handleEvent as any);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.off("event", handleEvent as any);
    };
  }, [editor, shape.id, hasLink]);

  const aw = (seededRandom(`${id}-aw`) - 0.5) * 4;
  const ah = (seededRandom(`${id}-ah`) - 0.5) * 4;

  const dynamicLineHeight = fontSize > 36 ? 1.6 : fontSize > 24 ? 1.4 : 1.2;

  // Estimate text width to position inline arrows after the text
  const charW = fontSize * 0.55;
  const firstLine = text.split("\n")[0];
  const textEndX = Math.min(firstLine.length * charW + 8, w * 0.85);

  let arrowPath = "";
  if (showArrow) {
    switch (arrowDirection) {
      case "right":
        arrowPath = `M ${w * 0.7} ${h * 0.5 + ah} Q ${w * 0.85 + aw} ${h * 0.3 + ah} ${w} ${h * 0.5} M ${w - 8} ${h * 0.5 - 6} L ${w} ${h * 0.5} L ${w - 8} ${h * 0.5 + 6}`;
        break;
      case "left":
        arrowPath = `M ${w * 0.3} ${h * 0.5 + ah} Q ${w * 0.15 + aw} ${h * 0.3 + ah} 0 ${h * 0.5} M 8 ${h * 0.5 - 6} L 0 ${h * 0.5} L 8 ${h * 0.5 + 6}`;
        break;
      case "down": {
        const ax = textEndX + aw;
        const midY = fontSize * 0.5;
        arrowPath = `M ${ax} ${midY} Q ${ax + 6} ${midY + (h - midY) * 0.5} ${ax} ${h} M ${ax - 6} ${h - 8} L ${ax} ${h} L ${ax + 6} ${h - 8}`;
        break;
      }
      case "up":
        arrowPath = `M ${w * 0.5 + aw} ${h * 0.3} Q ${w * 0.5 + aw} ${h * 0.15} ${w * 0.5} 0 M ${w * 0.5 - 6} 8 L ${w * 0.5} 0 L ${w * 0.5 + 6} 8`;
        break;
    }
  }

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      editor.updateShape({
        id,
        type: "annotation",
        props: { text: e.target.value },
      });
    },
    [editor, id]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
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
        pointerEvents: "all",
      }}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            height: "100%",
            fontSize,
            lineHeight: dynamicLineHeight,
            fontFamily: "'Loranthus', cursive",
            border: "none",
            outline: "1px dashed #999",
            background: "rgba(255,255,200,0.15)",
            resize: "none",
            padding: 0,
            margin: 0,
            whiteSpace: "pre-wrap",
            color: "#1a1a1a",
          }}
        />
      ) : (
        <div
          style={{
            fontSize,
            lineHeight: dynamicLineHeight,
            whiteSpace: "pre-wrap",
            ...(hasLink
              ? {
                  cursor: "pointer",
                  textDecoration: hovered ? "underline" : "none",
                  textUnderlineOffset: 3,
                  transition: "text-decoration 0.15s ease",
                }
              : {}),
          }}
        >
          {text}
        </div>
      )}
      {showArrow && (
        <svg
          width={w}
          height={h}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <path d={arrowPath} fill="none" stroke="#1a1a1a" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )}
    </HTMLContainer>
  );
}

export class AnnotationShapeUtil extends ShapeUtil<AnnotationShape> {
  static override type = "annotation" as const;

  static override props: RecordProps<AnnotationShape> = {
    w: T.number,
    h: T.number,
    text: T.string,
    fontSize: T.number,
    showArrow: T.boolean,
    arrowDirection: T.string,
  };

  getDefaultProps(): AnnotationShape["props"] {
    return {
      w: 300,
      h: 40,
      text: "Annotation",
      fontSize: 20,
      showArrow: false,
      arrowDirection: "right",
    };
  }

  getGeometry(shape: AnnotationShape): Geometry2d {
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

  override onResize(shape: AnnotationShape, info: TLResizeInfo<AnnotationShape>) {
    return resizeBox(shape, info);
  }

  component(shape: AnnotationShape) {
    return <AnnotationComponent shape={shape} />;
  }

  indicator(shape: AnnotationShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
