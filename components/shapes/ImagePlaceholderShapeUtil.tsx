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

type ImagePlaceholderShape = TLShape<"image-placeholder">;

export class ImagePlaceholderShapeUtil extends ShapeUtil<ImagePlaceholderShape> {
  static override type = "image-placeholder" as const;

  static override props: RecordProps<ImagePlaceholderShape> = {
    w: T.number,
    h: T.number,
  };

  getDefaultProps(): ImagePlaceholderShape["props"] {
    return {
      w: 500,
      h: 200,
    };
  }

  getGeometry(shape: ImagePlaceholderShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: ImagePlaceholderShape, info: TLResizeInfo<ImagePlaceholderShape>) {
    return resizeBox(shape, info);
  }

  component(shape: ImagePlaceholderShape) {
    const { w, h } = shape.props;
    const id = shape.id;
    const borderPath = wobblyRect(id, w, h, 2);
    const diag1 = wobblyLine(`${id}-d1`, 0, 0, w, h, 3);
    const diag2 = wobblyLine(`${id}-d2`, w, 0, 0, h, 3);

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          position: "relative",
          pointerEvents: "all",
        }}
      >
        <svg width={w} height={h}>
          <path d={borderPath} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
          <path d={diag1} fill="none" stroke="#1a1a1a" strokeWidth={1} opacity={0.5} />
          <path d={diag2} fill="none" stroke="#1a1a1a" strokeWidth={1} opacity={0.5} />
        </svg>
      </HTMLContainer>
    );
  }

  indicator(shape: ImagePlaceholderShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
