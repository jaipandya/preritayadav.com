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
import { wobblyRect, seededRandom } from "@/lib/variationSeed";

type SkillIconShape = TLShape<"skill-icon">;

export class SkillIconShapeUtil extends ShapeUtil<SkillIconShape> {
  static override type = "skill-icon" as const;

  static override props: RecordProps<SkillIconShape> = {
    w: T.number,
    h: T.number,
    icon: T.string,
    label: T.string,
  };

  getDefaultProps(): SkillIconShape["props"] {
    return {
      w: 100,
      h: 120,
      icon: "analytics",
      label: "Analytics",
    };
  }

  getGeometry(shape: SkillIconShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: SkillIconShape, info: TLResizeInfo<SkillIconShape>) {
    return resizeBox(shape, info);
  }

  private renderIcon(icon: string, id: string, size: number) {
    const s = size;
    const wobble = (seed: string) => (seededRandom(`${id}-${seed}`) - 0.5) * 3;

    switch (icon) {
      case "analytics":
        return (
          <g>
            <path
              d={`M 10 ${s - 10} Q ${s * 0.3 + wobble("a1")} ${s * 0.6 + wobble("a2")} ${s * 0.5} ${s * 0.4 + wobble("a3")} Q ${s * 0.7 + wobble("a4")} ${s * 0.2} ${s - 10} ${s * 0.3 + wobble("a5")}`}
              fill="none" stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round"
            />
            <line x1={10} y1={s - 10} x2={s - 10} y2={s - 10} stroke="#1a1a1a" strokeWidth={1.5} />
            <line x1={10} y1={10} x2={10} y2={s - 10} stroke="#1a1a1a" strokeWidth={1.5} />
          </g>
        );
      case "design":
        return (
          <g>
            <circle cx={s / 2} cy={s / 2} r={s * 0.35} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
            <line x1={s / 2} y1={s * 0.15} x2={s / 2} y2={s * 0.85} stroke="#1a1a1a" strokeWidth={1} />
            <line x1={s * 0.15} y1={s / 2} x2={s * 0.85} y2={s / 2} stroke="#1a1a1a" strokeWidth={1} />
            <path
              d={`M ${s / 2} ${s * 0.15 + wobble("d1")} L ${s * 0.85} ${s / 2 + wobble("d2")}`}
              fill="none" stroke="#1a1a1a" strokeWidth={1}
            />
          </g>
        );
      case "content":
        return (
          <g>
            <path
              d={wobblyRect(`${id}-doc`, s * 0.7, s * 0.85, 2)}
              fill="none" stroke="#1a1a1a" strokeWidth={1.5}
              transform={`translate(${s * 0.15}, ${s * 0.075})`}
            />
            {[0.3, 0.45, 0.6, 0.75].map((yFrac, i) => (
              <line
                key={i}
                x1={s * 0.25} y1={s * yFrac}
                x2={s * (0.6 + wobble(`cl${i}`) * 0.02)} y2={s * yFrac}
                stroke="#1a1a1a" strokeWidth={1}
              />
            ))}
          </g>
        );
      case "communication":
        return (
          <g>
            <path
              d={wobblyRect(`${id}-env`, s * 0.8, s * 0.55, 2)}
              fill="none" stroke="#1a1a1a" strokeWidth={1.5}
              transform={`translate(${s * 0.1}, ${s * 0.22})`}
            />
            <path
              d={`M ${s * 0.1} ${s * 0.22} L ${s * 0.5 + wobble("e1")} ${s * 0.55} L ${s * 0.9} ${s * 0.22}`}
              fill="none" stroke="#1a1a1a" strokeWidth={1.5}
            />
          </g>
        );
      default:
        return null;
    }
  }

  component(shape: SkillIconShape) {
    const { w, h, icon, label } = shape.props;
    const iconSize = Math.min(w, h - 30);
    const hasLink = typeof (shape.meta as Record<string, unknown>)?.href === "string";

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          position: "relative",
          fontFamily: "'Loranthus', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "all",
          cursor: hasLink ? "pointer" : undefined,
        }}
      >
        <svg width={iconSize} height={iconSize}>
          {this.renderIcon(icon, shape.id, iconSize)}
        </svg>
        <div style={{ fontSize: 13, marginTop: 4, textAlign: "center" }}>
          {label}
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: SkillIconShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
