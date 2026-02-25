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
import { wobblyRect } from "@/lib/variationSeed";

type HandDrawnButtonShape = TLShape<"hand-drawn-button">;

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

  override onResize(shape: HandDrawnButtonShape, info: TLResizeInfo<HandDrawnButtonShape>) {
    return resizeBox(shape, info);
  }

  component(shape: HandDrawnButtonShape) {
    const { w, h, label } = shape.props;
    const borderPath = wobblyRect(shape.id, w, h, 2);

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
          {label}
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: HandDrawnButtonShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
