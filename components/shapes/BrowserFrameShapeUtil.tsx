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

type BrowserFrameShape = TLShape<"browser-frame">;

export class BrowserFrameShapeUtil extends ShapeUtil<BrowserFrameShape> {
  static override type = "browser-frame" as const;

  static override props: RecordProps<BrowserFrameShape> = {
    w: T.number,
    h: T.number,
    url: T.string,
    contentType: T.string,
    src: T.string,
  };

  getDefaultProps(): BrowserFrameShape["props"] {
    return {
      w: 500,
      h: 350,
      url: "https://example.com",
      contentType: "placeholder",
      src: "",
    };
  }

  getGeometry(shape: BrowserFrameShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: BrowserFrameShape, info: TLResizeInfo<BrowserFrameShape>) {
    return resizeBox(shape, info);
  }

  component(shape: BrowserFrameShape) {
    const { w, h, url, contentType, src } = shape.props;
    const id = shape.id;
    const chromeH = 36;
    const borderPath = wobblyRect(id, w, h, 2);
    const urlBarPath = wobblyRect(`${id}-url`, w - 100, 22, 1);

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          position: "relative",
          fontFamily: "'Loranthus', sans-serif",
          pointerEvents: "all",
        }}
      >
        <svg width={w} height={h} style={{ position: "absolute", top: 0, left: 0 }}>
          <path d={borderPath} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
          <line x1={0} y1={chromeH} x2={w} y2={chromeH} stroke="#1a1a1a" strokeWidth={1} />
          <circle cx={16} cy={chromeH / 2} r={4} fill="none" stroke="#1a1a1a" strokeWidth={1} />
          <circle cx={30} cy={chromeH / 2} r={4} fill="none" stroke="#1a1a1a" strokeWidth={1} />
          <circle cx={44} cy={chromeH / 2} r={4} fill="none" stroke="#1a1a1a" strokeWidth={1} />
        </svg>

        <div
          style={{
            position: "absolute",
            top: (chromeH - 22) / 2,
            left: 64,
            width: w - 100,
            height: 22,
          }}
        >
          <svg width={w - 100} height={22} style={{ position: "absolute", top: 0, left: 0 }}>
            <path d={urlBarPath} fill="none" stroke="#1a1a1a" strokeWidth={1} />
          </svg>
          <div style={{ position: "relative", zIndex: 1, fontSize: 11, padding: "3px 8px", opacity: 0.5 }}>
            {url}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: chromeH + 1,
            left: 1,
            width: w - 2,
            height: h - chromeH - 2,
            overflow: "hidden",
          }}
        >
          {contentType === "image" && src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          {contentType === "video" && src && (
            <video src={src} style={{ width: "100%", height: "100%" }} controls muted />
          )}
          {contentType === "iframe" && src && (
            <iframe src={src} style={{ width: "100%", height: "100%", border: "none" }} title="Preview" />
          )}
          {contentType === "placeholder" && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.3,
                fontSize: 14,
              }}
            >
              Content preview
            </div>
          )}
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: BrowserFrameShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
