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
import { wobblyRect, wobblyLine } from "@/lib/variationSeed";
import { useCallback, useRef, useEffect } from "react";

type ProjectCardShape = TLShape<"project-card">;

function ProjectCardComponent({ shape }: { shape: ProjectCardShape }) {
  const { w, h, number, title, description, mediaType } = shape.props;
  const id = shape.id;
  const borderPath = wobblyRect(id, w, h, 2);
  const isEditing = useIsEditing(id);
  const editor = useEditor();
  const titleRef = useRef<HTMLInputElement>(null);

  const isVideo = mediaType === "video";
  const mediaW = isVideo ? 80 : w - 40;
  const mediaH = isVideo ? 80 : h * 0.5;

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [isEditing]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      editor.updateShape({ id, type: "project-card", props: { title: e.target.value } });
    },
    [editor, id]
  );

  const handleDescChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      editor.updateShape({ id, type: "project-card", props: { description: e.target.value } });
    },
    [editor, id]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") editor.setEditingShape(null);
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
      <svg width={w} height={h} style={{ position: "absolute", top: 0, left: 0 }}>
        <path d={borderPath} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
      </svg>
      <div style={{ padding: "16px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, opacity: 0.5 }}>{number}</span>
          {isEditing ? (
            <input
              ref={titleRef}
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                fontSize: 18,
                fontFamily: "'Loranthus', cursive",
                border: "none",
                outline: "1px dashed #999",
                background: "rgba(255,255,200,0.15)",
                flex: 1,
                padding: "1px 4px",
                color: "#1a1a1a",
              }}
            />
          ) : (
            <span style={{ fontSize: 18 }}>{title}</span>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={description}
            onChange={handleDescChange}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              fontSize: 13,
              fontFamily: "'Loranthus', cursive",
              border: "none",
              outline: "1px dashed #999",
              background: "rgba(255,255,200,0.15)",
              width: "100%",
              resize: "none",
              padding: "2px 4px",
              margin: "4px 0 12px 0",
              color: "#1a1a1a",
              opacity: 0.8,
            }}
            rows={2}
          />
        ) : (
          <p style={{ fontSize: 13, opacity: 0.6, margin: "4px 0 12px 0" }}>
            {description}
          </p>
        )}

        {isVideo ? (
          <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 20 }}>
            <svg width={mediaW} height={mediaH} viewBox="0 0 80 80">
              <circle cx={40} cy={40} r={38} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
              <polygon points="32,24 32,56 58,40" fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
            </svg>
          </div>
        ) : (
          <svg width={mediaW} height={mediaH}>
            <rect x={0} y={0} width={mediaW} height={mediaH} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
            <path d={wobblyLine(`${id}-x1`, 0, 0, mediaW, mediaH, 2)} fill="none" stroke="#1a1a1a" strokeWidth={1} />
            <path d={wobblyLine(`${id}-x2`, mediaW, 0, 0, mediaH, 2)} fill="none" stroke="#1a1a1a" strokeWidth={1} />
          </svg>
        )}
      </div>
    </HTMLContainer>
  );
}

export class ProjectCardShapeUtil extends ShapeUtil<ProjectCardShape> {
  static override type = "project-card" as const;

  static override props: RecordProps<ProjectCardShape> = {
    w: T.number,
    h: T.number,
    number: T.string,
    title: T.string,
    description: T.string,
    mediaType: T.string,
  };

  getDefaultProps(): ProjectCardShape["props"] {
    return {
      w: 540,
      h: 220,
      number: "01",
      title: "Project Name",
      description: "A brief description of the project and its goals.",
      mediaType: "image",
    };
  }

  getGeometry(shape: ProjectCardShape): Geometry2d {
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

  override onResize(shape: ProjectCardShape, info: TLResizeInfo<ProjectCardShape>) {
    return resizeBox(shape, info);
  }

  component(shape: ProjectCardShape) {
    return <ProjectCardComponent shape={shape} />;
  }

  indicator(shape: ProjectCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
