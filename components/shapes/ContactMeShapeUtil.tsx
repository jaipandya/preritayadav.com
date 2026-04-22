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
import { wobblyRect, wobblyCircle, seededRandom } from "@/lib/variationSeed";
import { contactMe } from "@/lib/landingContent";

type ContactMeShape = TLShape<"contact-me">;

const stroke = "#1a1a1a";
const sw = 2;
const BOX = 70;
const PAD = 6;

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

function IconBox({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <svg width={BOX} height={BOX} viewBox={`-${PAD} -${PAD} ${BOX + PAD * 2} ${BOX + PAD * 2}`} overflow="visible">
      {children}
    </svg>
  );
}

function LinkedinIcon({ id }: { id: string }) {
  return (
    <IconBox id={`${id}-li`}>
      <g transform="translate(16, 12)">
        <text x="19" y="34" textAnchor="middle" fontFamily="'Loranthus', sans-serif" fontSize="32" fontWeight="800" fill={stroke}>
          in
        </text>
      </g>
    </IconBox>
  );
}

function TwitterIcon({ id }: { id: string }) {
  return (
    <IconBox id={`${id}-tw`}>
      <g transform="translate(18, 16)">
        <path
          d="M 0 0 L 34 38 M 34 0 L 0 38"
          fill="none" stroke={stroke} strokeWidth={3.5} strokeLinecap="round"
        />
      </g>
    </IconBox>
  );
}

function MediumIcon({ id }: { id: string }) {
  return (
    <IconBox id={`${id}-md`}>
      <g transform="translate(12, 14)">
        {/* Medium "M" logo - three ellipses side by side */}
        <ellipse cx="13" cy="22" rx="12" ry="14" fill="none" stroke={stroke} strokeWidth={sw} />
        <ellipse cx="35" cy="22" rx="7" ry="14" fill="none" stroke={stroke} strokeWidth={sw} />
        <ellipse cx="49" cy="22" rx="3.5" ry="13" fill="none" stroke={stroke} strokeWidth={sw} />
      </g>
    </IconBox>
  );
}

function EmailIcon({ id }: { id: string }) {
  return (
    <IconBox id={`${id}-em`}>
      <g transform="translate(10, 14)">
        <path d={wobblyRect(`${id}-env`, 50, 34, 2)} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <path
          d="M 2 2 L 25 18 L 48 2"
          fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
    </IconBox>
  );
}

function InstagramIcon({ id }: { id: string }) {
  return (
    <IconBox id={`${id}-ig`}>
      <g transform="translate(12, 12)">
        <path d={wobblyRoundedRect(`${id}-igb`, 46, 46, 10, 2)} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <path d={wobblyCircle(`${id}-igc`, 23, 23, 13, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
        <circle cx="38" cy="10" r="3" fill={stroke} />
      </g>
    </IconBox>
  );
}

const ICONS: Record<string, React.FC<{ id: string }>> = {
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  medium: MediumIcon,
  email: EmailIcon,
  instagram: InstagramIcon,
};

function ContactMeComponent({ shape }: { shape: ContactMeShape }) {
  const { w, h } = shape.props;
  const id = shape.id;

  return (
    <HTMLContainer
      style={{
        width: w,
        height: h,
        position: "relative",
        fontFamily: "'Loranthus', sans-serif",
        pointerEvents: "all",
        overflow: "visible",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: stroke }}>
          {contactMe.heading}
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
          {contactMe.links.map((link, i) => {
            const Icon = ICONS[link.icon];
            if (!Icon) return null;
            return (
              <a
                key={link.icon}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  color: stroke,
                  cursor: "pointer",
                }}
              >
                <Icon id={`${id}-ci-${i}`} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </HTMLContainer>
  );
}

export class ContactMeShapeUtil extends ShapeUtil<ContactMeShape> {
  static override type = "contact-me" as const;

  static override props: RecordProps<ContactMeShape> = {
    w: T.number,
    h: T.number,
  };

  getDefaultProps(): ContactMeShape["props"] {
    return {
      w: 520,
      h: 150,
    };
  }

  getGeometry(shape: ContactMeShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: ContactMeShape, info: TLResizeInfo<ContactMeShape>) {
    return resizeBox(shape, info);
  }

  component(shape: ContactMeShape) {
    return <ContactMeComponent shape={shape} />;
  }

  indicator(shape: ContactMeShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
