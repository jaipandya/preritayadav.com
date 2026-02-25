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
import { seededRandom } from "@/lib/variationSeed";

type AnnotationShape = TLShape<"annotation">;

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

  override onResize(shape: AnnotationShape, info: TLResizeInfo<AnnotationShape>) {
    return resizeBox(shape, info);
  }

  component(shape: AnnotationShape) {
    const { w, h, text, fontSize, showArrow, arrowDirection } = shape.props;
    const id = shape.id;

    const aw = (seededRandom(`${id}-aw`) - 0.5) * 4;
    const ah = (seededRandom(`${id}-ah`) - 0.5) * 4;

    let arrowPath = "";
    if (showArrow) {
      switch (arrowDirection) {
        case "right":
          arrowPath = `M ${w * 0.7} ${h * 0.5 + ah} Q ${w * 0.85 + aw} ${h * 0.3 + ah} ${w} ${h * 0.5} M ${w - 8} ${h * 0.5 - 6} L ${w} ${h * 0.5} L ${w - 8} ${h * 0.5 + 6}`;
          break;
        case "left":
          arrowPath = `M ${w * 0.3} ${h * 0.5 + ah} Q ${w * 0.15 + aw} ${h * 0.3 + ah} 0 ${h * 0.5} M 8 ${h * 0.5 - 6} L 0 ${h * 0.5} L 8 ${h * 0.5 + 6}`;
          break;
        case "down":
          arrowPath = `M ${w * 0.5 + aw} ${h * 0.7} Q ${w * 0.5 + aw} ${h * 0.85} ${w * 0.5} ${h} M ${w * 0.5 - 6} ${h - 8} L ${w * 0.5} ${h} L ${w * 0.5 + 6} ${h - 8}`;
          break;
        case "up":
          arrowPath = `M ${w * 0.5 + aw} ${h * 0.3} Q ${w * 0.5 + aw} ${h * 0.15} ${w * 0.5} 0 M ${w * 0.5 - 6} 8 L ${w * 0.5} 0 L ${w * 0.5 + 6} 8`;
          break;
      }
    }

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
        <div style={{ fontSize, lineHeight: 1.3, whiteSpace: "pre-wrap" }}>
          {text}
        </div>
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

  indicator(shape: AnnotationShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
