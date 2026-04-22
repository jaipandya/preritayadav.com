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
import { wobblyRect, wobblyLine, wobblyCircle, seededRandom } from "@/lib/variationSeed";

type OutsideWorkCardShape = TLShape<"outside-work-card">;

const stroke = "#1a1a1a";
const sw = 1.3;

function MentoringIllustration({ id }: { id: string }) {
  const heads = [14, 30, 46, 62, 78, 94, 110];
  return (
    <svg width="130" height="90" viewBox="0 0 130 90">
      <path d={wobblyRect(`${id}-bdr`, 126, 86, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(2, 2)" />
      {heads.map((cx, i) => {
        const headY = 30 + (seededRandom(`${id}-hy${i}`) - 0.5) * 6;
        return (
          <g key={i}>
            <path d={wobblyCircle(`${id}-mh${i}`, cx, headY, 6, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
            <path d={wobblyLine(`${id}-mb${i}`, cx, headY + 6, cx, headY + 20, 0.8)} fill="none" stroke={stroke} strokeWidth={sw} />
            <path d={wobblyLine(`${id}-ml${i}`, cx - 5, headY + 12, cx, headY + 9, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
            <path d={wobblyLine(`${id}-mr${i}`, cx + 5, headY + 12, cx, headY + 9, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          </g>
        );
      })}
      <path d={wobblyLine(`${id}-gnd`, 6, 72, 124, 72, 1)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
    </svg>
  );
}

function TravelIllustration({ id }: { id: string }) {
  return (
    <svg width="130" height="90" viewBox="0 0 130 90">
      <path d={wobblyRect(`${id}-bdr`, 126, 86, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(2, 2)" />
      {/* Suitcase */}
      <path d={wobblyRect(`${id}-case`, 36, 28, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(16, 36)" />
      <path d={wobblyLine(`${id}-hl`, 26, 36, 26, 28, 0.8)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-ht`, 26, 28, 42, 28, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-hr`, 42, 36, 42, 28, 0.8)} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Stamps / postmarks */}
      <path d={wobblyCircle(`${id}-st1`, 80, 34, 12, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d={wobblyRect(`${id}-st2`, 24, 16, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} transform="translate(96, 26)" />
      <path d={wobblyLine(`${id}-sl1`, 100, 30, 116, 30, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d={wobblyLine(`${id}-sl2`, 100, 35, 114, 35, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      {/* Plane */}
      <path d={wobblyLine(`${id}-pw`, 66, 56, 100, 48, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-pb`, 82, 52, 78, 58, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
      <path d={wobblyLine(`${id}-pt`, 96, 49, 100, 48, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
      {/* Compass */}
      <path d={wobblyCircle(`${id}-comp`, 102, 68, 8, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
      <path d={wobblyLine(`${id}-cn`, 102, 60, 102, 64, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyLine(`${id}-cs`, 102, 72, 102, 76, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
    </svg>
  );
}

function TinkeringIllustration({ id }: { id: string }) {
  return (
    <svg width="130" height="90" viewBox="0 0 130 90">
      {/* Scissors */}
      <path d={wobblyCircle(`${id}-s1`, 24, 36, 7, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyCircle(`${id}-s2`, 34, 42, 7, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-sb1`, 30, 30, 52, 18, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-sb2`, 40, 36, 52, 18, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Glue tube */}
      <path d={wobblyRect(`${id}-glue`, 12, 24, 1)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(56, 30)" />
      <path d={wobblyRect(`${id}-cap`, 8, 6, 0.8)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(58, 25)" />
      <path d={wobblyCircle(`${id}-drip`, 62, 58, 2, 0.5)} fill={stroke} stroke="none" />
      {/* Yarn */}
      <path d={wobblyCircle(`${id}-yarn`, 100, 48, 12, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-y1`, 92, 42, 108, 54, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d={wobblyLine(`${id}-y2`, 94, 52, 106, 44, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      {/* Sparkle */}
      <path d={wobblyLine(`${id}-sp1`, 46, 62, 48, 56, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyLine(`${id}-sp2`, 48, 56, 50, 62, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyLine(`${id}-sp3`, 43, 59, 53, 59, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      {/* Ground */}
      <path d={wobblyLine(`${id}-gnd`, 8, 74, 122, 74, 1)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
    </svg>
  );
}

const OUTSIDE_ILLUSTRATIONS: Record<string, React.FC<{ id: string }>> = {
  mentoring: MentoringIllustration,
  travel: TravelIllustration,
  tinkering: TinkeringIllustration,
};

function OutsideWorkCardComponent({ shape }: { shape: OutsideWorkCardShape }) {
  const { w, h, number, title, subtitle, description, illustration } = shape.props;
  const id = shape.id;
  const Illustration = OUTSIDE_ILLUSTRATIONS[illustration];

  return (
    <HTMLContainer
      style={{
        width: w,
        height: h,
        position: "relative",
        fontFamily: "'Loranthus', sans-serif",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 12, height: "100%" }}>
        <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 300,
              opacity: 0.25,
              lineHeight: 1,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {number}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
              {title}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginBottom: 6, lineHeight: 1.3 }}>
              {subtitle}
            </div>
            <div style={{ fontSize: 12, opacity: 0.55, lineHeight: 1.6 }}>
              {description}
            </div>
          </div>
        </div>
        {Illustration && (
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Illustration id={`${id}-ill`} />
          </div>
        )}
      </div>
    </HTMLContainer>
  );
}

export class OutsideWorkCardShapeUtil extends ShapeUtil<OutsideWorkCardShape> {
  static override type = "outside-work-card" as const;

  static override props: RecordProps<OutsideWorkCardShape> = {
    w: T.number,
    h: T.number,
    number: T.string,
    title: T.string,
    subtitle: T.string,
    description: T.string,
    illustration: T.string,
  };

  getDefaultProps(): OutsideWorkCardShape["props"] {
    return {
      w: 520,
      h: 160,
      number: "1",
      title: "Activity",
      subtitle: "Subtitle",
      description: "Description text.",
      illustration: "mentoring",
    };
  }

  getGeometry(shape: OutsideWorkCardShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: OutsideWorkCardShape, info: TLResizeInfo<OutsideWorkCardShape>) {
    return resizeBox(shape, info);
  }

  component(shape: OutsideWorkCardShape) {
    return <OutsideWorkCardComponent shape={shape} />;
  }

  indicator(shape: OutsideWorkCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
