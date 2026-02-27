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
import { wobblyRect, wobblyLine, wobblyCircle } from "@/lib/variationSeed";
import { useCallback, useRef } from "react";
import { isNavigable } from "@/lib/canvasMeta";
import { useFocusOnEdit } from "@/lib/useShapeInteraction";

type ProjectCardShape = TLShape<"project-card">;

function ProjectIllustration({ id, mediaType, size }: { id: string; mediaType: string; size: number }) {
  const s = size;
  const stroke = "#1a1a1a";
  const sw = 1.3;

  switch (mediaType) {
    case "fitpass":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Dumbbell / gym icon */}
          <path d={wobblyLine(`${id}-bar`, 20, 40, 60, 40, 1.5)} fill="none" stroke={stroke} strokeWidth={sw + 0.5} />
          <path d={wobblyRect(`${id}-lw`, 12, 16, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(10, 28)" />
          <path d={wobblyRect(`${id}-rw`, 12, 24, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(58, 24)" />
          {/* Dashboard indicator */}
          <path d={wobblyLine(`${id}-d1`, 28, 58, 38, 50, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-d2`, 38, 50, 48, 56, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-d3`, 48, 56, 58, 46, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
        </svg>
      );

    case "abhiloans":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Document / form with checkmarks */}
          <path d={wobblyRect(`${id}-doc`, 40, 50, 2)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(20, 10)" />
          <path d={wobblyLine(`${id}-l1`, 28, 24, 50, 24, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          <path d={wobblyLine(`${id}-l2`, 28, 33, 50, 33, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          <path d={wobblyLine(`${id}-l3`, 28, 42, 42, 42, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          {/* Check mark */}
          <path d={wobblyLine(`${id}-ck1`, 46, 42, 50, 47, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-ck2`, 50, 47, 58, 36, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Arrow pointing right/forward */}
          <path d={wobblyLine(`${id}-ar`, 30, 68, 54, 68, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-arh1`, 48, 63, 54, 68, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-arh2`, 48, 73, 54, 68, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
        </svg>
      );

    case "ema":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Chat bubble */}
          <path d={wobblyRect(`${id}-bubble`, 44, 28, 2)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(18, 8)" />
          <path d={wobblyLine(`${id}-tail`, 32, 36, 26, 46, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Bot/persona face */}
          <path d={wobblyCircle(`${id}-head`, 40, 60, 14, 2)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyCircle(`${id}-eye1`, 35, 58, 2, 0.8)} fill={stroke} stroke="none" />
          <path d={wobblyCircle(`${id}-eye2`, 45, 58, 2, 0.8)} fill={stroke} stroke="none" />
          <path d={wobblyLine(`${id}-mouth`, 36, 65, 44, 65, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Dots in bubble for typing */}
          <circle cx={30} cy={22} r={2} fill={stroke} />
          <circle cx={40} cy={22} r={2} fill={stroke} />
          <circle cx={50} cy={22} r={2} fill={stroke} />
        </svg>
      );

    case "epic":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Open book */}
          <path d={wobblyLine(`${id}-spine`, 40, 16, 40, 64, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-lt`, 12, 20, 40, 16, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-rt`, 40, 16, 68, 20, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-lb`, 12, 60, 40, 64, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-rb`, 40, 64, 68, 60, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-ls`, 12, 20, 12, 60, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-rs`, 68, 20, 68, 60, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Page lines */}
          <path d={wobblyLine(`${id}-pl1`, 18, 30, 35, 29, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={wobblyLine(`${id}-pl2`, 18, 38, 35, 37, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={wobblyLine(`${id}-pl3`, 18, 46, 30, 45, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={wobblyLine(`${id}-pr1`, 45, 29, 62, 30, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={wobblyLine(`${id}-pr2`, 45, 37, 62, 38, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        </svg>
      );

    case "portfolio":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Browser window */}
          <path d={wobblyRect(`${id}-win`, 56, 40, 2)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(12, 14)" />
          <path d={wobblyLine(`${id}-bar`, 12, 24, 68, 24, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          {/* Traffic lights */}
          <circle cx={18} cy={19} r={2} fill={stroke} />
          <circle cx={25} cy={19} r={2} fill={stroke} />
          <circle cx={32} cy={19} r={2} fill={stroke} />
          {/* Pencil / design tool */}
          <path d={wobblyLine(`${id}-pen1`, 48, 62, 62, 48, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-pen2`, 48, 62, 46, 68, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-pen3`, 46, 68, 52, 66, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Wobbly star */}
          <path d={wobblyLine(`${id}-s1`, 26, 60, 28, 55, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          <path d={wobblyLine(`${id}-s2`, 28, 55, 30, 60, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          <path d={wobblyLine(`${id}-s3`, 24, 57, 32, 57, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        </svg>
      );

    case "superteacher":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Rupee / coin */}
          <path d={wobblyCircle(`${id}-coin`, 28, 30, 16, 2)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-r1`, 22, 24, 34, 24, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-r2`, 22, 30, 34, 30, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-r3`, 28, 24, 24, 38, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Checklist */}
          <path d={wobblyRect(`${id}-list`, 28, 36, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(44, 12)" />
          <path d={wobblyLine(`${id}-cl1`, 50, 22, 66, 22, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={wobblyLine(`${id}-cl2`, 50, 30, 66, 30, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={wobblyLine(`${id}-cl3`, 50, 38, 62, 38, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          {/* Bell / reminder */}
          <path d={wobblyCircle(`${id}-bell`, 40, 64, 8, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-clap`, 40, 56, 40, 52, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
        </svg>
      );

    case "zkagi":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Shield / lock (privacy) */}
          <path d={wobblyLine(`${id}-sl`, 28, 16, 28, 50, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-sr`, 52, 16, 52, 50, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-st`, 28, 16, 52, 16, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-sb1`, 28, 50, 40, 60, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-sb2`, 52, 50, 40, 60, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* ZK inside */}
          <path d={wobblyLine(`${id}-z1`, 34, 28, 46, 28, 1)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
          <path d={wobblyLine(`${id}-z2`, 46, 28, 34, 42, 1)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
          <path d={wobblyLine(`${id}-z3`, 34, 42, 46, 42, 1)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
          {/* Network nodes */}
          <circle cx={16} cy={66} r={3} fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx={40} cy={72} r={3} fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx={64} cy={66} r={3} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-n1`, 19, 66, 37, 72, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={wobblyLine(`${id}-n2`, 43, 72, 61, 66, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        </svg>
      );

    case "toppr":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Dashboard / monitor */}
          <path d={wobblyRect(`${id}-screen`, 52, 34, 2)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(14, 10)" />
          {/* Bar chart inside */}
          <path d={wobblyLine(`${id}-b1`, 24, 40, 24, 30, 1)} fill="none" stroke={stroke} strokeWidth={sw + 1} />
          <path d={wobblyLine(`${id}-b2`, 34, 40, 34, 24, 1)} fill="none" stroke={stroke} strokeWidth={sw + 1} />
          <path d={wobblyLine(`${id}-b3`, 44, 40, 44, 32, 1)} fill="none" stroke={stroke} strokeWidth={sw + 1} />
          <path d={wobblyLine(`${id}-b4`, 54, 40, 54, 20, 1)} fill="none" stroke={stroke} strokeWidth={sw + 1} />
          {/* Stand */}
          <path d={wobblyLine(`${id}-stand`, 40, 44, 40, 52, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-base`, 30, 52, 50, 52, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Person */}
          <path d={wobblyCircle(`${id}-head`, 40, 62, 5, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-body`, 40, 67, 40, 76, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-arm1`, 34, 72, 40, 70, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          <path d={wobblyLine(`${id}-arm2`, 46, 72, 40, 70, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        </svg>
      );

    case "birdtab":
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          {/* Bird body */}
          <path d={wobblyCircle(`${id}-body`, 38, 36, 16, 2)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Eye */}
          <path d={wobblyCircle(`${id}-eye`, 44, 32, 2.5, 0.8)} fill={stroke} stroke="none" />
          {/* Beak */}
          <path d={wobblyLine(`${id}-bk1`, 54, 34, 62, 36, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-bk2`, 62, 36, 54, 38, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Wing */}
          <path d={wobblyLine(`${id}-w1`, 28, 34, 20, 44, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-w2`, 20, 44, 34, 42, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Tail */}
          <path d={wobblyLine(`${id}-t1`, 22, 36, 14, 30, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-t2`, 22, 38, 12, 36, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
          {/* Tab / browser hint */}
          <path d={wobblyRect(`${id}-tab`, 36, 14, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} transform="translate(22, 58)" />
          <circle cx={28} cy={63} r={1.5} fill={stroke} />
          <circle cx={33} cy={63} r={1.5} fill={stroke} />
          <circle cx={38} cy={63} r={1.5} fill={stroke} />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 80 80">
          <path d={wobblyCircle(id, 40, 40, 28, 2)} fill="none" stroke={stroke} strokeWidth={sw} />
          <path d={wobblyLine(`${id}-x1`, 24, 24, 56, 56, 2)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          <path d={wobblyLine(`${id}-x2`, 56, 24, 24, 56, 2)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        </svg>
      );
  }
}

function ProjectCardComponent({ shape }: { shape: ProjectCardShape }) {
  const { w, h, number, title, description, mediaType } = shape.props;
  const id = shape.id;
  const borderPath = wobblyRect(id, w, h, 2);
  const isEditing = useIsEditing(id);
  const editor = useEditor();
  const hasLink = isNavigable(shape);
  const titleRef = useRef<HTMLInputElement>(null);

  useFocusOnEdit(isEditing, titleRef);

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
        fontFamily: "'Loranthus', sans-serif",
        pointerEvents: "all",
        cursor: hasLink ? "pointer" : undefined,
        overflow: "hidden",
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
                fontFamily: "'Loranthus', sans-serif",
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
              fontFamily: "'Loranthus', sans-serif",
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

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ProjectIllustration id={id} mediaType={mediaType} size={80} />
        </div>
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
