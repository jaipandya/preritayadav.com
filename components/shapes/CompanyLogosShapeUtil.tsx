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

type CompanyLogosShape = TLShape<"company-logos">;

const stroke = "#1a1a1a";
const sw = 2.2;
const BOX = 100;
const PAD = 8;

function wobblyRoundedRect(id: string, w: number, h: number, r: number, wobble = 3): string {
  const s = (seed: string) => (seededRandom(seed) - 0.5) * wobble;
  const tl = r + s(`${id}-tlr`);
  const tr = r + s(`${id}-trr`);
  const br = r + s(`${id}-brr`);
  const bl = r + s(`${id}-blr`);
  return [
    `M ${tl + s(`${id}-s0`)} ${s(`${id}-s1`)}`,
    `L ${w - tr + s(`${id}-s2`)} ${s(`${id}-s3`)}`,
    `Q ${w + s(`${id}-s4`)} ${s(`${id}-s5`)} ${w + s(`${id}-s6`)} ${tr + s(`${id}-s7`)}`,
    `L ${w + s(`${id}-s8`)} ${h - br + s(`${id}-s9`)}`,
    `Q ${w + s(`${id}-s10`)} ${h + s(`${id}-s11`)} ${w - br + s(`${id}-s12`)} ${h + s(`${id}-s13`)}`,
    `L ${bl + s(`${id}-s14`)} ${h + s(`${id}-s15`)}`,
    `Q ${s(`${id}-s16`)} ${h + s(`${id}-s17`)} ${s(`${id}-s18`)} ${h - bl + s(`${id}-s19`)}`,
    `L ${s(`${id}-s20`)} ${tl + s(`${id}-s21`)}`,
    `Q ${s(`${id}-s22`)} ${s(`${id}-s23`)} ${tl + s(`${id}-s24`)} ${s(`${id}-s25`)}`,
    `Z`,
  ].join(" ");
}

function LogoBox({ id, children, showBorder = true }: { id: string; children: React.ReactNode; showBorder?: boolean }) {
  return (
    <svg width={BOX} height={BOX} viewBox={`-${PAD} -${PAD} ${BOX + PAD * 2} ${BOX + PAD * 2}`} overflow="visible">
      {showBorder && (
        <path
          d={wobblyRoundedRect(`${id}-box`, BOX, BOX, 12, 3)}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {children}
    </svg>
  );
}

function TopprLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-toppr`} showBorder={false}>
      <g transform="translate(28, 10)">
        <path
          d={wobblyRoundedRect(`${id}-ta`, 34, 34, 8, 2)}
          fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"
        />
        <path
          d="M 17 10 L 17 26 M 10 17 L 17 10 L 24 17"
          fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
      <text x="45" y="68" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="18" fontWeight="700" fill={stroke}>
        toppr
      </text>
    </LogoBox>
  );
}

function ByjusLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-byjus`} showBorder={false}>
      <text x="45" y="28" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="16" fontWeight="800" fill={stroke} style={{ letterSpacing: "1px" }}>
        BYJU&apos;S
      </text>
      <text x="45" y="62" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="36" fontWeight="800" fill={stroke}>
        B
      </text>
    </LogoBox>
  );
}

function EmaLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-ema`} showBorder={false}>
      <path d={wobblyCircle(`${id}-ec`, 45, 36, 20, 2)} fill="none" stroke={stroke} strokeWidth={sw} />
      <circle cx={52} cy={30} r={7} fill="none" stroke={stroke} strokeWidth={sw} />
      <text x="45" y="78" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="18" fontWeight="700" fill={stroke}>
        Ema
      </text>
    </LogoBox>
  );
}

function TenKDesignersLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-10k`} showBorder={false}>
      <text x="45" y="42" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="30" fontWeight="800" fill={stroke}>
        10k
      </text>
      <text x="45" y="64" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="12" fontWeight="700" fill={stroke} style={{ letterSpacing: "3px" }}>
        DESIGNERS
      </text>
    </LogoBox>
  );
}

function AbhiLoansLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-abhi`} showBorder={false}>
      <g transform="translate(15, 2)">
        {/* Gauge arc */}
        <path d="M 5 42 A 28 28 0 1 1 55 42" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* Tick marks around the arc */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const angle = Math.PI + (i / 8) * Math.PI;
          const cx = 30, cy = 40;
          const x1 = cx + Math.cos(angle) * 26;
          const y1 = cy + Math.sin(angle) * 26;
          const x2 = cx + Math.cos(angle) * 21;
          const y2 = cy + Math.sin(angle) * 21;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />;
        })}
        {/* Needle pointing upper-right */}
        <line x1="30" y1="40" x2="46" y2="18" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
        {/* Center hub */}
        <circle cx="30" cy="40" r="3.5" fill={stroke} />
        {/* "A" letter at top of gauge */}
        <text x="30" y="28" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="14" fontWeight="800" fill={stroke}>
          A
        </text>
      </g>
      <text x="30" y="70" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="18" fontWeight="800" fill={stroke}>
        abhi
      </text>
      <text x="70" y="70" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="12" fontWeight="800" fill={stroke} style={{ letterSpacing: "1px" }}>
        LOANS
      </text>
    </LogoBox>
  );
}

function ZkAgiLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-zk`} showBorder={false}>
      {/* Diagonal hatching lines */}
      <g transform="translate(16, 8)">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={i}
            x1={4 + i * 7} y1={2}
            x2={0 + i * 7} y2={28}
            stroke={stroke} strokeWidth={1.5} strokeLinecap="round"
          />
        ))}
      </g>
      {/* Z letter */}
      <g transform="translate(28, 12)">
        <path d="M 5 4 L 30 4 L 5 26 L 30 26" fill="none" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="45" y="62" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="11" fontWeight="700" fill={stroke} style={{ letterSpacing: "1.5px" }}>
        zkAGI
      </text>
    </LogoBox>
  );
}

function FitPassLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-fp`} showBorder={false}>
      {/* Inverted triangle with dumbbell - matching FITPASS brand */}
      <g transform="translate(25, 4)">
        {/* Signal waves at top */}
        <path d="M 14 0 Q 20 -6 26 0" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
        <path d="M 10 3 Q 20 -8 30 3" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
        {/* Inverted triangle */}
        <path d="M 4 10 L 36 10 L 20 38 Z" fill={stroke} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        {/* Eye in the triangle */}
        <circle cx="20" cy="19" r="5" fill="none" stroke="white" strokeWidth={1.8} />
        <circle cx="20" cy="19" r="2" fill="white" />
      </g>
      <text x="45" y="68" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="15" fontWeight="800" fill={stroke} style={{ letterSpacing: "3px" }}>
        FITPASS
      </text>
      <text x="88" y="62" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="9" fontWeight="700" fill={stroke}>
        ®
      </text>
    </LogoBox>
  );
}

function EpicLogo({ id }: { id: string }) {
  return (
    <LogoBox id={`${id}-epic`} showBorder={false}>
      <text x="50" y="55" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="24" fontWeight="700" fill={stroke}>
        epic!
      </text>
    </LogoBox>
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
        overflow: "visible",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px 16px",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {companyList.map((company, i) => {
          const Logo = LOGOS[company.trim()];
          if (!Logo) return null;
          return (
            <div key={company} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      h: 260,
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
