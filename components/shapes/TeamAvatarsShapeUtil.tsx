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
import { wobblyCircle, seededRandom } from "@/lib/variationSeed";

type TeamAvatarsShape = TLShape<"team-avatars">;

export class TeamAvatarsShapeUtil extends ShapeUtil<TeamAvatarsShape> {
  static override type = "team-avatars" as const;

  static override props: RecordProps<TeamAvatarsShape> = {
    w: T.number,
    h: T.number,
    title: T.string,
    subtitle: T.string,
    count: T.number,
  };

  getDefaultProps(): TeamAvatarsShape["props"] {
    return {
      w: 540,
      h: 200,
      title: "Worked with amazing folks",
      subtitle: "Designers, developers & product managers",
      count: 7,
    };
  }

  getGeometry(shape: TeamAvatarsShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: TeamAvatarsShape, info: TLResizeInfo<TeamAvatarsShape>) {
    return resizeBox(shape, info);
  }

  component(shape: TeamAvatarsShape) {
    const { w, h, title, subtitle, count } = shape.props;
    const id = shape.id;
    const avatarR = 28;
    const spacing = 68;
    const startX = 40;
    const avatarY = h - avatarR - 30;

    const avatars = Array.from({ length: count }, (_, i) => {
      const cx = startX + i * spacing;
      const cy = avatarY;
      const circlePath = wobblyCircle(`${id}-av-${i}`, cx, cy, avatarR, 2);

      const eyeL = { x: cx - 8 + (seededRandom(`${id}-el-${i}`) - 0.5) * 2, y: cy - 6 };
      const eyeR = { x: cx + 8 + (seededRandom(`${id}-er-${i}`) - 0.5) * 2, y: cy - 6 };
      const mouthY = cy + 8;
      const smile = seededRandom(`${id}-sm-${i}`) > 0.5;

      return (
        <g key={i}>
          <path d={circlePath} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
          <circle cx={eyeL.x} cy={eyeL.y} r={2} fill="#1a1a1a" />
          <circle cx={eyeR.x} cy={eyeR.y} r={2} fill="#1a1a1a" />
          {smile ? (
            <path
              d={`M ${cx - 6} ${mouthY} Q ${cx} ${mouthY + 5} ${cx + 6} ${mouthY}`}
              fill="none" stroke="#1a1a1a" strokeWidth={1}
            />
          ) : (
            <line x1={cx - 5} y1={mouthY} x2={cx + 5} y2={mouthY} stroke="#1a1a1a" strokeWidth={1} />
          )}
        </g>
      );
    });

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
        <div style={{ padding: "12px 20px" }}>
          <div style={{ fontSize: 14, opacity: 0.5, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, opacity: 0.4 }}>{subtitle}</div>
        </div>
        <svg width={w} height={h} style={{ position: "absolute", top: 0, left: 0 }}>
          {avatars}
        </svg>
      </HTMLContainer>
    );
  }

  indicator(shape: TeamAvatarsShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
