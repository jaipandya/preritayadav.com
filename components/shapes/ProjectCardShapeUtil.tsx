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
} from "tldraw";
import { wobblyRect, wobblyLine } from "@/lib/variationSeed";

type ProjectCardShape = TLShape<"project-card">;

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

  override onResize(shape: ProjectCardShape, info: TLResizeInfo<ProjectCardShape>) {
    return resizeBox(shape, info);
  }

  component(shape: ProjectCardShape) {
    const { w, h, number, title, description, mediaType } = shape.props;
    const id = shape.id;
    const borderPath = wobblyRect(id, w, h, 2);

    const isVideo = mediaType === "video";
    const mediaW = isVideo ? 80 : w - 40;
    const mediaH = isVideo ? 80 : h * 0.5;

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
        <svg
          width={w}
          height={h}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path d={borderPath} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
        </svg>
        <div style={{ padding: "16px 20px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, opacity: 0.5 }}>{number}</span>
            <span style={{ fontSize: 18 }}>{title}</span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.6, margin: "4px 0 12px 0" }}>
            {description}
          </p>

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

  indicator(shape: ProjectCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
