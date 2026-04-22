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
import { wobblyCircle, wobblyLine, wobblyRect, seededRandom } from "@/lib/variationSeed";

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

/** Girl working on MacBook with mountains, birds, forest, and river — fine illustration style */
function GirlWithLaptopSketch({ id }: { id: string }) {
  return (
    <g>
      {/* ===== SKY & BACKGROUND ===== */}

      {/* Sun (upper right) */}
      <circle cx={170} cy={16} r={8} fill="none" stroke={stroke} strokeWidth={0.6} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 170 + Math.cos(rad) * 11;
        const y1 = 16 + Math.sin(rad) * 11;
        const x2 = 170 + Math.cos(rad) * 15;
        const y2 = 16 + Math.sin(rad) * 15;
        return <path key={`ray${i}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} fill="none" stroke={stroke} strokeWidth={0.5} />;
      })}

      {/* Birds — graceful curved wings */}
      {[
        { cx: 28, cy: 14, s: 1 },
        { cx: 46, cy: 8, s: 0.8 },
        { cx: 58, cy: 12, s: 0.7 },
        { cx: 128, cy: 6, s: 0.85 },
        { cx: 144, cy: 14, s: 0.65 },
      ].map((b, i) => (
        <path
          key={`bird${i}`}
          d={`M ${b.cx - 5 * b.s} ${b.cy + 2 * b.s} Q ${b.cx - 2 * b.s} ${b.cy - 3 * b.s} ${b.cx} ${b.cy} Q ${b.cx + 2 * b.s} ${b.cy - 3 * b.s} ${b.cx + 5 * b.s} ${b.cy + 2 * b.s}`}
          fill="none" stroke={stroke} strokeWidth={0.6} strokeLinecap="round"
        />
      ))}

      {/* Clouds (soft scalloped shapes) */}
      <path
        d={`M 72 20 Q 76 14,82 16 Q 86 10,92 14 Q 98 10,102 16 Q 108 14,110 20 Z`}
        fill="none" stroke={stroke} strokeWidth={0.5}
      />
      <path
        d={`M 6 28 Q 10 22,16 24 Q 20 18,26 22 Q 30 24,30 28 Z`}
        fill="none" stroke={stroke} strokeWidth={0.5}
      />

      {/* ===== MOUNTAINS (3 overlapping peaks with ridgelines) ===== */}
      {/* Rear peak (tallest) */}
      <path
        d={`M 38 80 Q 52 55,64 38 Q 68 32,72 28 L 80 22 Q 84 28,88 34 Q 100 55,120 80`}
        fill="none" stroke={stroke} strokeWidth={1} strokeLinejoin="round"
      />
      {/* Ridgeline detail */}
      <path d={`M 68 36 Q 74 34,80 22 Q 86 34,92 36`} fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d={`M 60 50 L 66 46 L 72 50`} fill="none" stroke={stroke} strokeWidth={0.4} />

      {/* Left peak */}
      <path
        d={`M 0 80 Q 14 58,28 40 L 36 30 Q 40 36,48 46 Q 56 58,68 80`}
        fill="none" stroke={stroke} strokeWidth={1} strokeLinejoin="round"
      />
      <path d={`M 28 42 Q 32 38,36 30 Q 40 38,44 42`} fill="none" stroke={stroke} strokeWidth={0.5} />

      {/* Right peak */}
      <path
        d={`M 110 80 Q 126 54,140 38 L 148 28 Q 152 34,158 42 Q 168 58,188 80`}
        fill="none" stroke={stroke} strokeWidth={1} strokeLinejoin="round"
      />
      <path d={`M 140 40 Q 144 34,148 28 Q 152 34,156 40`} fill="none" stroke={stroke} strokeWidth={0.5} />

      {/* ===== FOREST (layered conifer silhouettes) ===== */}
      {/* Left forest cluster */}
      {[
        { x: 4, bh: 80, th: 56 },
        { x: 12, bh: 80, th: 50 },
        { x: 20, bh: 80, th: 54 },
        { x: 28, bh: 80, th: 58 },
        { x: 34, bh: 80, th: 62 },
      ].map((t, i) => (
        <g key={`fl${i}`}>
          <path
            d={`M ${t.x} ${t.bh} L ${t.x + 5} ${t.th} L ${t.x + 10} ${t.bh}`}
            fill="none" stroke={stroke} strokeWidth={0.8} strokeLinejoin="round"
          />
          <path
            d={`M ${t.x + 2} ${t.bh - 8} L ${t.x + 5} ${t.th + 6} L ${t.x + 8} ${t.bh - 8}`}
            fill="none" stroke={stroke} strokeWidth={0.4}
          />
          <path d={`M ${t.x + 5} ${t.bh} L ${t.x + 5} ${t.bh + 4}`} fill="none" stroke={stroke} strokeWidth={0.5} />
        </g>
      ))}

      {/* Right forest cluster */}
      {[
        { x: 158, bh: 80, th: 60 },
        { x: 166, bh: 80, th: 52 },
        { x: 174, bh: 80, th: 56 },
        { x: 182, bh: 80, th: 62 },
      ].map((t, i) => (
        <g key={`fr${i}`}>
          <path
            d={`M ${t.x} ${t.bh} L ${t.x + 5} ${t.th} L ${t.x + 10} ${t.bh}`}
            fill="none" stroke={stroke} strokeWidth={0.8} strokeLinejoin="round"
          />
          <path
            d={`M ${t.x + 2} ${t.bh - 8} L ${t.x + 5} ${t.th + 6} L ${t.x + 8} ${t.bh - 8}`}
            fill="none" stroke={stroke} strokeWidth={0.4}
          />
          <path d={`M ${t.x + 5} ${t.bh} L ${t.x + 5} ${t.bh + 4}`} fill="none" stroke={stroke} strokeWidth={0.5} />
        </g>
      ))}

      {/* ===== RIVER (flowing S-curve with banks and ripples) ===== */}
      <path
        d="M 0 86 C 22 80,50 94,80 86 C 110 78,142 94,200 86"
        fill="none" stroke={stroke} strokeWidth={0.8} strokeLinecap="round"
      />
      <path
        d="M 0 92 C 24 86,52 100,82 92 C 112 84,144 100,200 92"
        fill="none" stroke={stroke} strokeWidth={0.8} strokeLinecap="round"
      />
      {/* Ripples */}
      {[32, 62, 96, 130, 164].map((rx, i) => (
        <path key={`rip${i}`} d={`M ${rx} 89 Q ${rx + 3} 87.5 ${rx + 6} 89`} fill="none" stroke={stroke} strokeWidth={0.35} />
      ))}
      {/* River stones */}
      <ellipse cx={48} cy={89} rx={2} ry={1.2} fill="none" stroke={stroke} strokeWidth={0.4} />
      <ellipse cx={118} cy={89} rx={1.5} ry={1} fill="none" stroke={stroke} strokeWidth={0.4} />

      {/* ===== GROUND PLANE ===== */}
      <path d="M 44 96 C 60 94,80 96,100 95 C 120 94,140 96,156 95" fill="none" stroke={stroke} strokeWidth={0.6} />
      {/* Grass tufts */}
      {[52, 66, 74, 126, 138, 148].map((gx, i) => (
        <g key={`gr${i}`}>
          <path d={`M ${gx} 96 Q ${gx + 1} 92 ${gx + 2} 96`} fill="none" stroke={stroke} strokeWidth={0.4} />
          <path d={`M ${gx + 1} 96 Q ${gx + 2.5} 91 ${gx + 3.5} 96`} fill="none" stroke={stroke} strokeWidth={0.4} />
        </g>
      ))}

      {/* ===== GIRL — seated, working on laptop ===== */}

      {/* --- Hair (voluminous, flowing with detail strands) --- */}
      <path
        d={`M 89 103 C 86 96,87 92,92 90 Q 96 88,100 89 Q 104 88,108 90 C 113 92,114 96,111 103`}
        fill="none" stroke={stroke} strokeWidth={1.1} strokeLinecap="round"
      />
      {/* Hair volume — left side flows down */}
      <path
        d="M 89 103 C 86 106,85 110,87 114"
        fill="none" stroke={stroke} strokeWidth={0.9}
      />
      {/* Ponytail — flowing behind to the right */}
      <path
        d={`M 111 100 C 118 96,124 98,122 106 C 120 112,116 116,112 115`}
        fill="none" stroke={stroke} strokeWidth={1}
      />
      {/* Hair texture strands */}
      <path d={`M 115 98 C 119 99,121 103,120 108`} fill="none" stroke={stroke} strokeWidth={0.4} />
      <path d={`M 113 97 C 116 100,118 105,116 110`} fill="none" stroke={stroke} strokeWidth={0.35} />
      {/* Fringe */}
      <path d={`M 92 92 C 94 90,97 91,96 93`} fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d={`M 96 91 C 98 89,101 90,100 92`} fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d={`M 104 91 C 106 89,108 90,107 93`} fill="none" stroke={stroke} strokeWidth={0.5} />

      {/* --- Head --- */}
      <path
        d={wobblyCircle(`${id}-head`, 100, 104, 10, 0.6)}
        fill="none" stroke={stroke} strokeWidth={1.1}
      />

      {/* --- Face details --- */}
      {/* Eyes (closed/serene — curved lines) */}
      <path d={`M 95 103 Q 96.5 101.5 98 103`} fill="none" stroke={stroke} strokeWidth={0.7} strokeLinecap="round" />
      <path d={`M 102 103 Q 103.5 101.5 105 103`} fill="none" stroke={stroke} strokeWidth={0.7} strokeLinecap="round" />
      {/* Eyelashes */}
      <path d={`M 95 103 L 94.5 101.5`} fill="none" stroke={stroke} strokeWidth={0.35} />
      <path d={`M 105 103 L 105.5 101.5`} fill="none" stroke={stroke} strokeWidth={0.35} />
      {/* Nose (subtle) */}
      <path d={`M 100 105 L 99.5 107`} fill="none" stroke={stroke} strokeWidth={0.4} strokeLinecap="round" />
      {/* Gentle smile */}
      <path d={`M 97 109 Q 100 111.5 103 109`} fill="none" stroke={stroke} strokeWidth={0.6} strokeLinecap="round" />
      {/* Tiny cheek blush marks */}
      <path d={`M 93 107 L 95 107`} fill="none" stroke={stroke} strokeWidth={0.3} />
      <path d={`M 105 107 L 107 107`} fill="none" stroke={stroke} strokeWidth={0.3} />

      {/* --- Neck --- */}
      <path d={`M 98 114 L 97.5 118`} fill="none" stroke={stroke} strokeWidth={0.8} />
      <path d={`M 102 114 L 102.5 118`} fill="none" stroke={stroke} strokeWidth={0.8} />

      {/* --- Shoulders & upper body (slight curve for relaxed posture) --- */}
      <path
        d={`M 86 122 C 90 118,96 117,100 118 C 104 117,110 118,114 122`}
        fill="none" stroke={stroke} strokeWidth={1}
      />
      {/* Collar / neckline detail */}
      <path d={`M 95 118 Q 100 121 105 118`} fill="none" stroke={stroke} strokeWidth={0.5} />

      {/* --- Torso (slight taper) --- */}
      <path d={`M 87 122 C 88 130,90 136,92 140`} fill="none" stroke={stroke} strokeWidth={1} />
      <path d={`M 113 122 C 112 130,110 136,108 140`} fill="none" stroke={stroke} strokeWidth={1} />

      {/* --- Arms (curved, elbows bent, hands reaching keyboard) --- */}
      {/* Left arm */}
      <path
        d={`M 87 123 C 82 128,80 132,84 138 L 88 140`}
        fill="none" stroke={stroke} strokeWidth={0.9} strokeLinecap="round"
      />
      {/* Right arm */}
      <path
        d={`M 113 123 C 118 128,120 132,116 138 L 112 140`}
        fill="none" stroke={stroke} strokeWidth={0.9} strokeLinecap="round"
      />
      {/* Hands on keyboard (small ovals) */}
      <ellipse cx={88} cy={140.5} rx={2.5} ry={1.5} fill="none" stroke={stroke} strokeWidth={0.5} />
      <ellipse cx={112} cy={140.5} rx={2.5} ry={1.5} fill="none" stroke={stroke} strokeWidth={0.5} />

      {/* --- Crossed legs --- */}
      {/* Left leg — crosses over to right */}
      <path
        d={`M 92 140 C 88 146,86 150,84 154 L 82 156`}
        fill="none" stroke={stroke} strokeWidth={1}
      />
      {/* Right leg — crosses over to left */}
      <path
        d={`M 108 140 C 112 146,114 150,116 154 L 118 156`}
        fill="none" stroke={stroke} strokeWidth={1}
      />
      {/* Shoes / feet */}
      <path d={`M 82 156 C 79 157,78 158,80 159`} fill="none" stroke={stroke} strokeWidth={0.7} strokeLinecap="round" />
      <path d={`M 118 156 C 121 157,122 158,120 159`} fill="none" stroke={stroke} strokeWidth={0.7} strokeLinecap="round" />

      {/* ===== MACBOOK ===== */}
      {/* Screen — slight angle for perspective feel */}
      <path
        d={`M 84 130 L 85 139 L 115 139 L 116 130 Z`}
        fill="none" stroke={stroke} strokeWidth={1}
      />
      {/* Apple logo hint (small leaf) */}
      <path d={`M 99.5 133 Q 100 131.5 100.5 133 Q 100 134.5 99.5 133`} fill="none" stroke={stroke} strokeWidth={0.4} />
      {/* Screen content — design wireframe lines */}
      <path d={`M 89 132 L 96 132`} fill="none" stroke={stroke} strokeWidth={0.35} />
      <path d={`M 89 134 L 111 134`} fill="none" stroke={stroke} strokeWidth={0.3} />
      <path d={`M 89 136 L 107 136`} fill="none" stroke={stroke} strokeWidth={0.3} />
      {/* Small rect shape on screen (design element) */}
      <rect x={104} y={131} width={6} height={4} rx={0.5} fill="none" stroke={stroke} strokeWidth={0.3} />

      {/* Keyboard base */}
      <path
        d={`M 83 139 L 80 143 L 120 143 L 117 139`}
        fill="none" stroke={stroke} strokeWidth={0.9}
      />
      {/* Trackpad */}
      <rect x={95} y={140} width={10} height={2.5} rx={0.5} fill="none" stroke={stroke} strokeWidth={0.35} />
      {/* Key rows hint */}
      <path d={`M 85 140 L 93 140`} fill="none" stroke={stroke} strokeWidth={0.25} />
      <path d={`M 107 140 L 115 140`} fill="none" stroke={stroke} strokeWidth={0.25} />

      {/* ===== COFFEE MUG ===== */}
      <path
        d={`M 128 148 L 128 156 Q 128 158,130 158 L 136 158 Q 138 158,138 156 L 138 148 Z`}
        fill="none" stroke={stroke} strokeWidth={0.7}
      />
      {/* Handle */}
      <path d={`M 138 150 C 142 150,142 156,138 156`} fill="none" stroke={stroke} strokeWidth={0.6} />
      {/* Steam wisps */}
      <path d={`M 130 147 C 131 144,129 142,131 139`} fill="none" stroke={stroke} strokeWidth={0.35} strokeLinecap="round" />
      <path d={`M 133 146 C 134 143,132 141,134 138`} fill="none" stroke={stroke} strokeWidth={0.35} strokeLinecap="round" />
      <path d={`M 136 147 C 137 144,135 142,137 139`} fill="none" stroke={stroke} strokeWidth={0.35} strokeLinecap="round" />

      {/* ===== GROUND ===== */}
      <path d={wobblyLine(`${id}-gnd`, 54, 160, 146, 160, 0.8)} fill="none" stroke={stroke} strokeWidth={1.2} />

      {/* Small plant beside mug */}
      <path d={`M 148 160 L 148 152`} fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d={`M 148 155 C 144 152,144 149,147 148`} fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d={`M 148 153 C 152 150,153 148,150 147`} fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d={`M 148 157 C 145 155,144 153,146 152`} fill="none" stroke={stroke} strokeWidth={0.4} />
    </g>
  );
}

/** Mentoring scene — group of people silhouettes */
function MentoringSketch({ id }: { id: string }) {
  const heads = [28, 48, 68, 88, 108, 128, 148];
  return (
    <g>
      {heads.map((cx, i) => {
        const headY = 52 + (seededRandom(`${id}-hy${i}`) - 0.5) * 8;
        return (
          <g key={i}>
            <path d={wobblyCircle(`${id}-mh${i}`, cx, headY, 8, 1.2)} fill="none" stroke={stroke} strokeWidth={sw} />
            <path d={wobblyLine(`${id}-mb${i}`, cx, headY + 8, cx, headY + 28, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
            <path d={wobblyLine(`${id}-ml${i}`, cx - 6, headY + 16, cx, headY + 12, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
            <path d={wobblyLine(`${id}-mr${i}`, cx + 6, headY + 16, cx, headY + 12, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          </g>
        );
      })}
      {/* Speech bubble above centre person */}
      <path d={wobblyRect(`${id}-sp`, 28, 16, 1.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} transform="translate(74, 26)" />
      <path d={wobblyLine(`${id}-spt`, 88, 42, 88, 48, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <circle cx={82} cy={32} r={1.2} fill={stroke} />
      <circle cx={88} cy={32} r={1.2} fill={stroke} />
      <circle cx={94} cy={32} r={1.2} fill={stroke} />
      {/* Ground line */}
      <path d={wobblyLine(`${id}-gnd`, 12, 100, 170, 100, 1.5)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
    </g>
  );
}

/** Tinkering / crafting scene */
function TinkeringSketch({ id }: { id: string }) {
  return (
    <g>
      {/* Scissors */}
      <path d={wobblyCircle(`${id}-s1`, 40, 50, 10, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyCircle(`${id}-s2`, 54, 58, 10, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-sb1`, 48, 44, 80, 26, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-sb2`, 62, 52, 80, 26, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} />

      {/* Glue tube */}
      <path d={wobblyRect(`${id}-glue`, 16, 32, 1.5)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(96, 40)" />
      <path d={wobblyRect(`${id}-cap`, 10, 8, 1)} fill="none" stroke={stroke} strokeWidth={sw} transform="translate(99, 34)" />
      {/* Glue drip */}
      <path d={wobblyLine(`${id}-drip`, 104, 72, 104, 80, 0.8)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d={wobblyCircle(`${id}-drop`, 104, 82, 2, 0.6)} fill={stroke} stroke="none" />

      {/* Yarn ball */}
      <path d={wobblyCircle(`${id}-yarn`, 148, 66, 14, 2)} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={wobblyLine(`${id}-y1`, 138, 60, 158, 72, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyLine(`${id}-y2`, 140, 70, 156, 62, 1)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      {/* Yarn trail */}
      <path
        d={`M 162 66 Q ${170 + (seededRandom(`${id}-yt1`) - 0.5) * 3} ${78} ${176 + (seededRandom(`${id}-yt2`) - 0.5) * 3} ${72}`}
        fill="none" stroke={stroke} strokeWidth={sw * 0.7}
      />

      {/* Star / sparkle */}
      <path d={wobblyLine(`${id}-st1`, 70, 80, 72, 72, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d={wobblyLine(`${id}-st2`, 72, 72, 74, 80, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d={wobblyLine(`${id}-st3`, 66, 76, 78, 76, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />

      {/* Ground */}
      <path d={wobblyLine(`${id}-gnd`, 12, 100, 180, 100, 1.5)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
    </g>
  );
}

const ILLUSTRATIONS = {
  bank: BankSketch,
  travel: TravelSketch,
  design: DesignSketch,
  "girl-laptop": GirlWithLaptopSketch,
  mentoring: MentoringSketch,
  tinkering: TinkeringSketch,
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
