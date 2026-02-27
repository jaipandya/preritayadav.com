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
import { wobblyCircle, wobblyLine, wobblyRect } from "@/lib/variationSeed";

type IllustrationShape = TLShape<"hand-drawn-illustration">;

const stroke = "#1a1a1a";
const sw = 1.3;

/** Bank / finance: classical building with columns */
function BankSketch({ id }: { id: string }) {
  const cols = [58, 100, 142];
  return (
    <g>
      {/* Roof triangle */}
      <path d={wobblyLine(`${id}-rl`, 32, 62, 100, 24, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-rr`, 100, 24, 168, 62, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Roof cap */}
      <path d={wobblyLine(`${id}-cap`, 32, 64, 168, 64, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Columns */}
      {cols.map((cx, i) => (
        <path key={i} d={wobblyLine(`${id}-col${i}`, cx, 66, cx, 118, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      ))}
      {/* Base platform */}
      <path d={wobblyLine(`${id}-base`, 30, 120, 170, 120, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Door */}
      <path d={wobblyRect(`${id}-door`, 22, 32, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} transform="translate(89, 86)" />
      {/* Ground */}
      <path d={wobblyLine(`${id}-gnd`, 18, 130, 182, 130, 1.5)} fill="none" stroke={stroke} strokeWidth={sw + 0.5} />
    </g>
  );
}

/** Travel / backpacking: suitcase with globe */
function TravelSketch({ id }: { id: string }) {
  return (
    <g>
      {/* Suitcase body */}
      <path d={wobblyRect(`${id}-body`, 92, 68, 2)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(54, 44)" />
      {/* Handle */}
      <path d={wobblyLine(`${id}-hl`, 78, 44, 78, 30, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-ht`, 78, 30, 122, 30, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-hr`, 122, 30, 122, 44, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Globe on suitcase */}
      <path d={wobblyCircle(`${id}-globe`, 100, 78, 20, 2)} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Latitude lines */}
      <path d={wobblyLine(`${id}-lat1`, 80, 70, 120, 70, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d={wobblyLine(`${id}-lat2`, 80, 86, 120, 86, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      {/* Longitude */}
      <path d={wobblyLine(`${id}-lon`, 100, 58, 100, 98, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      {/* Ground */}
      <path d={wobblyLine(`${id}-gnd`, 18, 128, 182, 128, 1.5)} fill="none" stroke={stroke} strokeWidth={sw + 0.5} />
    </g>
  );
}

/** Design / craft: open notebook with pen */
function DesignSketch({ id }: { id: string }) {
  return (
    <g>
      {/* Notebook left page */}
      <path d={wobblyRect(`${id}-lp`, 58, 72, 2)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(28, 36)" />
      {/* Notebook right page */}
      <path d={wobblyRect(`${id}-rp`, 58, 72, 2)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(86, 36)" />
      {/* Lines on left page */}
      <path d={wobblyLine(`${id}-ll1`, 34, 54, 80, 54, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d={wobblyLine(`${id}-ll2`, 34, 63, 80, 63, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d={wobblyLine(`${id}-ll3`, 34, 72, 70, 72, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      {/* Small sketch on right page: a simple circle + rect */}
      <path d={wobblyCircle(`${id}-sc`, 116, 68, 12, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
      <path d={wobblyRect(`${id}-sr`, 22, 16, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} transform="translate(103, 85)" />
      {/* Pen (diagonal, to the right of notebook) */}
      <path d={wobblyLine(`${id}-pen1`, 156, 34, 148, 108, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-pen2`, 164, 36, 156, 110, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-pent`, 156, 34, 164, 36, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-penb`, 148, 108, 156, 116, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-pentip`, 156, 116, 152, 124, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
    </g>
  );
}

const ILLUSTRATIONS = {
  bank: BankSketch,
  travel: TravelSketch,
  design: DesignSketch,
} as const;

export type IllustrationScene = keyof typeof ILLUSTRATIONS;

export class HandDrawnIllustrationShapeUtil extends ShapeUtil<IllustrationShape> {
  static override type = "hand-drawn-illustration" as const;

  static override props: RecordProps<IllustrationShape> = {
    w: T.number,
    h: T.number,
    scene: T.string,
  };

  getDefaultProps(): IllustrationShape["props"] {
    return { w: 200, h: 160, scene: "bank" };
  }

  getGeometry(shape: IllustrationShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: IllustrationShape, info: TLResizeInfo<IllustrationShape>) {
    return resizeBox(shape, info);
  }

  component(shape: IllustrationShape) {
    const { w, h, scene } = shape.props;
    const SceneComponent = ILLUSTRATIONS[scene as IllustrationScene] ?? BankSketch;
    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          position: "relative",
          pointerEvents: "none",
        }}
      >
        <svg
          width={w}
          height={h}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMinYMin meet"
          style={{ display: "block" }}
        >
          <SceneComponent id={shape.id} />
        </svg>
      </HTMLContainer>
    );
  }

  indicator(shape: IllustrationShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
