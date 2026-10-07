"use client";

import {
  ShapeUtil,
  HTMLContainer,
  type Geometry2d,
  Rectangle2d,
  T,
  type CanvasShape,
  type RecordProps,
  type ResizeInfo,
  resizeBox,
  useEditorValue,
} from "@/lib/canvas";
import { optimizedImageUrl, steppedScreenScale } from "@/lib/canvasAssets";

type CanvasImageShape = CanvasShape<"canvas-image">;

/** URL of a screenshot at the size it shows at this zoom, through the Next.js image optimizer (lib/canvasAssets.ts). */
export function canvasImageUrl(shape: CanvasImageShape, zoom: number, dpr: number) {
  const { src, w, naturalWidth } = shape.props;
  return optimizedImageUrl(src, naturalWidth, steppedScreenScale(zoom * (w / naturalWidth)), dpr);
}

function CanvasImage({ shape }: { shape: CanvasImageShape }) {
  const { w, h, altText } = shape.props;
  // Re-render only when the stepped scale changes, not on every zoom tick.
  const url = useEditorValue(
    (editor) => canvasImageUrl(shape, editor.getZoomLevel(), typeof window === "undefined" ? 1 : window.devicePixelRatio || 1),
    { camera: true }
  );
  return (
    <HTMLContainer style={{ width: w, height: h, position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- already an optimizer URL, sized to the zoom */}
      <img
        src={url}
        alt={altText}
        draggable={false}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </HTMLContainer>
  );
}

/** A case study screenshot. Kept as HTML (not drawn on the Quickdraw canvas) for the optimizer, alt text and placeholder. */
export class CanvasImageShapeUtil extends ShapeUtil<CanvasImageShape> {
  static override type = "canvas-image" as const;

  static override props: RecordProps<CanvasImageShape> = {
    w: T.number,
    h: T.number,
    src: T.string,
    naturalWidth: T.number,
    altText: T.string,
  };

  getDefaultProps(): CanvasImageShape["props"] {
    return { w: 100, h: 100, src: "", naturalWidth: 100, altText: "" };
  }

  getGeometry(shape: CanvasImageShape): Geometry2d {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true });
  }

  override onResize(shape: CanvasImageShape, info: ResizeInfo) {
    return resizeBox(shape, info);
  }

  component(shape: CanvasImageShape) {
    return <CanvasImage shape={shape} />;
  }

  indicator(shape: CanvasImageShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
