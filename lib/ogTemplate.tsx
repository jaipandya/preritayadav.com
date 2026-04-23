import type { ReactNode } from "react";
import { wobblyRect, wobblyLine, wobblyCircle } from "./variationSeed";

const INK = "#1a1a1a";
const PAPER = "#fdfcf6";
const DIM = "rgba(26,26,26,0.6)";
const SUBTLE = "rgba(26,26,26,0.38)";
const GHOST = "rgba(26,26,26,0.08)";

export const OG_SIZE = { width: 1200, height: 630 } as const;

type OgOptions = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  url: string;
  seed: string;
  doodle?: ReactNode;
};

const W = OG_SIZE.width;
const H = OG_SIZE.height;

function ArrowAnnotation({ seed }: { seed: string }) {
  return (
    <svg width={120} height={40} viewBox="0 0 120 40" style={{ display: "flex" }}>
      <path
        d={wobblyLine(`${seed}-arrL`, 4, 20, 104, 20, 3)}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        opacity={0.7}
      />
      <path
        d="M 94 12 L 108 20 L 94 28"
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </svg>
  );
}

function TitleUnderline({ seed, width }: { seed: string; width: number }) {
  return (
    <svg width={width} height={24} viewBox={`0 0 ${width} 24`} style={{ display: "flex", marginTop: -4 }}>
      <path
        d={wobblyLine(`${seed}-ul1`, 4, 12, width - 4, 12, 10)}
        fill="none"
        stroke={INK}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={wobblyLine(`${seed}-ul2`, 10, 18, width - 30, 18, 6)}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.4}
      />
    </svg>
  );
}

export function OgTemplate({
  eyebrow,
  title,
  subtitle,
  url,
  seed,
  doodle,
}: OgOptions) {
  const frameInset = 44;
  const frameW = W - frameInset * 2;
  const frameH = H - frameInset * 2;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: PAPER,
      }}
    >
      {/* Decorative frame + corner flourish */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Paper shadow offset */}
        <g transform={`translate(${frameInset + 6}, ${frameInset + 6})`}>
          <path
            d={wobblyRect(`${seed}-shadow`, frameW, frameH, 4)}
            fill="none"
            stroke={GHOST}
            strokeWidth={2}
          />
        </g>
        {/* Main wobbly border */}
        <g transform={`translate(${frameInset}, ${frameInset})`}>
          <path
            d={wobblyRect(`${seed}-frame`, frameW, frameH, 9)}
            fill="none"
            stroke={INK}
            strokeWidth={3.5}
          />
        </g>

        {/* Tick marks on top-left corner (like a canvas ruler) */}
        <g transform={`translate(${frameInset + 40}, ${frameInset - 10})`}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M ${i * 18} 0 L ${i * 18} ${i % 2 === 0 ? 8 : 5}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.5}
              opacity={0.35}
            />
          ))}
        </g>

        {/* Starburst/sparkle in bottom-right */}
        <g transform={`translate(${W - 170}, ${H - 150})`}>
          <path
            d={wobblyLine(`${seed}-sb1`, 30, 0, 30, 60, 1.5)}
            fill="none"
            stroke={INK}
            strokeWidth={2.2}
            opacity={0.7}
          />
          <path
            d={wobblyLine(`${seed}-sb2`, 0, 30, 60, 30, 1.5)}
            fill="none"
            stroke={INK}
            strokeWidth={2.2}
            opacity={0.7}
          />
          <path
            d={wobblyLine(`${seed}-sb3`, 10, 10, 50, 50, 1.2)}
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
            opacity={0.55}
          />
          <path
            d={wobblyLine(`${seed}-sb4`, 50, 10, 10, 50, 1.2)}
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
            opacity={0.55}
          />
          <path
            d={wobblyCircle(`${seed}-sb5`, 30, 30, 3, 1)}
            fill={INK}
            stroke="none"
          />
        </g>

        {/* Dashed URL rail above footer */}
        <path
          d={`M ${frameInset + 80} ${H - 110} L ${frameInset + 320} ${H - 110}`}
          fill="none"
          stroke={SUBTLE}
          strokeWidth={1.5}
          strokeDasharray="4 8"
        />
      </svg>

      {/* Foreground content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "120px 130px 100px 130px",
          boxSizing: "border-box",
        }}
      >
        {eyebrow && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 44,
            }}
          >
            <div
              style={{
                fontSize: 26,
                color: DIM,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 600,
              }}
            >
              {eyebrow}
            </div>
            <ArrowAnnotation seed={`${seed}-eyebrow`} />
          </div>
        )}

        <div
          style={{
            fontSize: title.length > 28 ? 76 : 88,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.04,
            maxWidth: 940,
            display: "flex",
          }}
        >
          {title}
        </div>

        <TitleUnderline
          seed={seed}
          width={Math.min(940, Math.max(280, title.length * 30))}
        />

        {subtitle && (
          <div
            style={{
              fontSize: 32,
              color: DIM,
              lineHeight: 1.38,
              maxWidth: 880,
              marginTop: 28,
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div
          style={{
            fontSize: 22,
            color: SUBTLE,
            letterSpacing: "0.06em",
            display: "flex",
          }}
        >
          {url}
        </div>
      </div>

      {/* Top-right doodle slot */}
      {doodle && (
        <div
          style={{
            position: "absolute",
            top: 110,
            right: 140,
            display: "flex",
          }}
        >
          {doodle}
        </div>
      )}
    </div>
  );
}

export function SpeechBubbleDoodle({ seed }: { seed: string }) {
  return (
    <svg width={180} height={140} viewBox="0 0 180 140">
      <path
        d={wobblyRect(`${seed}-sb`, 160, 90, 3)}
        fill="none"
        stroke={INK}
        strokeWidth={3}
        transform="translate(6, 6)"
      />
      <path
        d="M 40 96 L 30 126 L 70 96 Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d={wobblyLine(`${seed}-l1`, 26, 36, 144, 36, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        opacity={0.7}
      />
      <path
        d={wobblyLine(`${seed}-l2`, 26, 56, 120, 56, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        opacity={0.5}
      />
      <path
        d={wobblyLine(`${seed}-l3`, 26, 76, 100, 76, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        opacity={0.35}
      />
    </svg>
  );
}

export function FaceDoodle({ seed }: { seed: string }) {
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <path
        d={wobblyCircle(`${seed}-face`, 70, 70, 50, 4)}
        fill="none"
        stroke={INK}
        strokeWidth={3}
      />
      <path
        d={wobblyCircle(`${seed}-eye1`, 54, 60, 3, 1)}
        fill={INK}
        stroke="none"
      />
      <path
        d={wobblyCircle(`${seed}-eye2`, 88, 60, 3, 1)}
        fill={INK}
        stroke="none"
      />
      <path
        d="M 50 82 Q 70 100 92 82"
        fill="none"
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Hair squiggle */}
      <path
        d="M 38 36 Q 46 22 58 28 Q 70 16 86 28 Q 100 22 108 38"
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EnvelopeDoodle({ seed }: { seed: string }) {
  return (
    <svg width={180} height={120} viewBox="0 0 180 120">
      <path
        d={wobblyRect(`${seed}-env`, 160, 100, 3)}
        fill="none"
        stroke={INK}
        strokeWidth={3}
        transform="translate(10, 10)"
      />
      <path
        d="M 14 16 L 90 70 L 166 16"
        fill="none"
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={wobblyLine(`${seed}-stamp`, 138, 20, 160, 20, 1.5)}
        fill="none"
        stroke={INK}
        strokeWidth={1.5}
        opacity={0.5}
      />
    </svg>
  );
}

export function StackedPapersDoodle({ seed }: { seed: string }) {
  return (
    <svg width={180} height={160} viewBox="0 0 180 160">
      {/* Back sheet */}
      <path
        d={wobblyRect(`${seed}-p1`, 120, 140, 3)}
        fill={PAPER}
        stroke={INK}
        strokeWidth={2.5}
        transform="translate(40, 10) rotate(-4 60 70)"
      />
      {/* Middle sheet */}
      <path
        d={wobblyRect(`${seed}-p2`, 120, 140, 3)}
        fill={PAPER}
        stroke={INK}
        strokeWidth={2.5}
        transform="translate(28, 14) rotate(3 60 70)"
      />
      {/* Front sheet */}
      <path
        d={wobblyRect(`${seed}-p3`, 120, 140, 3)}
        fill={PAPER}
        stroke={INK}
        strokeWidth={3}
        transform="translate(20, 6)"
      />
      {/* Lines on front sheet */}
      <path
        d={wobblyLine(`${seed}-fl1`, 36, 36, 124, 36, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        opacity={0.7}
      />
      <path
        d={wobblyLine(`${seed}-fl2`, 36, 58, 100, 58, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        opacity={0.5}
      />
      <path
        d={wobblyLine(`${seed}-fl3`, 36, 80, 116, 80, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        opacity={0.5}
      />
      <path
        d={wobblyLine(`${seed}-fl4`, 36, 102, 90, 102, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        opacity={0.35}
      />
      <path
        d={wobblyRect(`${seed}-btn`, 40, 12, 1.5)}
        fill={INK}
        stroke="none"
        transform="translate(36, 122)"
      />
    </svg>
  );
}

export function PencilDoodle({ seed }: { seed: string }) {
  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      <g transform="rotate(-30 90 90)">
        {/* Body */}
        <path
          d={wobblyRect(`${seed}-body`, 110, 20, 2)}
          fill="none"
          stroke={INK}
          strokeWidth={3}
          transform="translate(30, 80)"
        />
        {/* Tip */}
        <path
          d="M 140 80 L 164 90 L 140 100 Z"
          fill={INK}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Eraser */}
        <path
          d={wobblyRect(`${seed}-eraser`, 14, 20, 1.5)}
          fill={INK}
          stroke={INK}
          strokeWidth={2}
          transform="translate(16, 80)"
        />
        {/* Band */}
        <path
          d={wobblyLine(`${seed}-band1`, 34, 80, 34, 100, 0.8)}
          fill="none"
          stroke={INK}
          strokeWidth={2}
        />
      </g>
      {/* Spark line */}
      <path
        d={wobblyLine(`${seed}-spark`, 40, 40, 60, 60, 2)}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        opacity={0.4}
      />
    </svg>
  );
}
