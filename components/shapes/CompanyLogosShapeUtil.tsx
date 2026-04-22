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
import { wobblyLine, wobblyRect, wobblyCircle } from "@/lib/variationSeed";

type CompanyLogosShape = TLShape<"company-logos">;

const stroke = "#1a1a1a";

function TopprLogo({ id }: { id: string }) {
  return (
    <svg width="90" height="52" viewBox="0 0 90 52" overflow="visible">
      <text
        x="45" y="32"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="26"
        fontWeight="600"
        fill={stroke}
        style={{ letterSpacing: "0.5px" }}
      >toppr</text>
      <path d={wobblyLine(`${id}-tu`, 10, 38, 80, 38, 0.5)} fill="none" stroke={stroke} strokeWidth={0.7} />
    </svg>
  );
}

function ByjusLogo({ id }: { id: string }) {
  return (
    <svg width="100" height="52" viewBox="0 0 100 52" overflow="visible">
      {/* Tilted B in a square */}
      <g transform="translate(6, 6) rotate(-12, 18, 18)">
        <path d={wobblyRect(`${id}-bsq`, 32, 32, 1)} fill="none" stroke={stroke} strokeWidth={1.2} />
        <text
          x="16" y="25"
          textAnchor="middle"
          fontFamily="'Loranthus', sans-serif"
          fontSize="22"
          fontWeight="700"
          fill={stroke}
        >B</text>
      </g>
      <text
        x="68" y="32"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="16"
        fontWeight="600"
        fill={stroke}
        style={{ letterSpacing: "0.5px" }}
      >YJU&apos;S</text>
    </svg>
  );
}

function EmaLogo({ id }: { id: string }) {
  return (
    <svg width="80" height="52" viewBox="0 0 80 52" overflow="visible">
      <path d={wobblyCircle(`${id}-ec`, 40, 26, 22, 1)} fill="none" stroke={stroke} strokeWidth={0.8} />
      <text
        x="40" y="32"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={stroke}
        style={{ letterSpacing: "2px" }}
      >EMA</text>
    </svg>
  );
}

function TenKDesignersLogo({ id }: { id: string }) {
  return (
    <svg width="100" height="52" viewBox="0 0 100 52" overflow="visible">
      <text
        x="50" y="24"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="24"
        fontWeight="700"
        fill={stroke}
      >10K</text>
      <text
        x="50" y="40"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="13"
        fontWeight="400"
        fill={stroke}
        style={{ letterSpacing: "0.5px" }}
      >designers</text>
      <path d={wobblyLine(`${id}-du`, 10, 44, 90, 44, 0.4)} fill="none" stroke={stroke} strokeWidth={0.5} />
    </svg>
  );
}

function AbhiLoansLogo({ id }: { id: string }) {
  return (
    <svg width="90" height="52" viewBox="0 0 90 52" overflow="visible">
      <text
        x="45" y="24"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={stroke}
      >Abhi</text>
      <text
        x="45" y="42"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="14"
        fontWeight="400"
        fill={stroke}
        style={{ letterSpacing: "0.5px" }}
      >Loans</text>
      <path d={wobblyLine(`${id}-au`, 14, 27, 76, 27, 0.4)} fill="none" stroke={stroke} strokeWidth={0.5} />
    </svg>
  );
}

function ZkAgiLogo({ id }: { id: string }) {
  return (
    <svg width="90" height="52" viewBox="0 0 90 52" overflow="visible">
      <text
        x="45" y="30"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontSize="22"
        fontWeight="700"
        fill={stroke}
        style={{ letterSpacing: "1px" }}
      >ZkAGI</text>
      <path d={wobblyLine(`${id}-zu1`, 8, 36, 82, 36, 0.4)} fill="none" stroke={stroke} strokeWidth={0.6} />
      <circle cx={14} cy={42} r={1.6} fill={stroke} />
      <path d={wobblyLine(`${id}-zn1`, 14, 42, 32, 42, 0.2)} fill="none" stroke={stroke} strokeWidth={0.4} />
      <circle cx={32} cy={42} r={1.6} fill={stroke} />
      <path d={wobblyLine(`${id}-zn2`, 32, 42, 58, 42, 0.2)} fill="none" stroke={stroke} strokeWidth={0.4} />
      <circle cx={58} cy={42} r={1.6} fill={stroke} />
      <path d={wobblyLine(`${id}-zn3`, 58, 42, 76, 42, 0.2)} fill="none" stroke={stroke} strokeWidth={0.4} />
      <circle cx={76} cy={42} r={1.6} fill={stroke} />
    </svg>
  );
}

function FitPassLogo({ id }: { id: string }) {
  return (
    <svg width="100" height="52" viewBox="0 0 100 52" overflow="visible">
      <text
        x="50" y="32"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={stroke}
        style={{ letterSpacing: "2px" }}
      >FITPASS</text>
      <path d={wobblyLine(`${id}-fu`, 6, 38, 94, 38, 0.4)} fill="none" stroke={stroke} strokeWidth={0.7} />
    </svg>
  );
}

function EpicLogo({ id }: { id: string }) {
  return (
    <svg width="80" height="52" viewBox="0 0 80 52" overflow="visible">
      <text
        x="40" y="34"
        textAnchor="middle"
        fontFamily="'Loranthus', sans-serif"
        fontSize="28"
        fontWeight="700"
        fill={stroke}
      >epic!</text>
      <path d={wobblyLine(`${id}-eu`, 8, 40, 72, 40, 0.4)} fill="none" stroke={stroke} strokeWidth={0.6} />
    </svg>
  );
}

const LOGOS: Record<string, React.FC<{ id: string }>> = {
  toppr: TopprLogo,
  byjus: ByjusLogo,
  ema: EmaLogo,
  "10kdesigners": TenKDesignersLogo,
  abhiloans: AbhiLoansLogo,
  zkagi: ZkAgiLogo,
  fitpass: FitPassLogo,
  epic: EpicLogo,
};

function CompanyLogosComponent({ shape }: { shape: CompanyLogosShape }) {
  const { w, h, companies } = shape.props;
  const id = shape.id;
  const companyList = companies.split(",").filter(Boolean);

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "1fr 1fr",
          gap: "12px 8px",
          height: "100%",
          padding: "4px 0",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {companyList.map((company, i) => {
          const Logo = LOGOS[company.trim()];
          if (!Logo) return null;
          return (
            <div
              key={company}
              style={{
                opacity: 0.7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo id={`${id}-logo-${i}`} />
            </div>
          );
        })}
      </div>
    </HTMLContainer>
  );
}

export class CompanyLogosShapeUtil extends ShapeUtil<CompanyLogosShape> {
  static override type = "company-logos" as const;

  static override props: RecordProps<CompanyLogosShape> = {
    w: T.number,
    h: T.number,
    companies: T.string,
  };

  getDefaultProps(): CompanyLogosShape["props"] {
    return {
      w: 520,
      h: 160,
      companies: "toppr,byjus,ema,10kdesigners,abhiloans,zkagi,fitpass,epic",
    };
  }

  getGeometry(shape: CompanyLogosShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: CompanyLogosShape, info: TLResizeInfo<CompanyLogosShape>) {
    return resizeBox(shape, info);
  }

  component(shape: CompanyLogosShape) {
    return <CompanyLogosComponent shape={shape} />;
  }

  indicator(shape: CompanyLogosShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
