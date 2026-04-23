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
import { wobblyRect, wobblyLine, wobblyCircle } from "@/lib/variationSeed";

type OutsideWorkCardShape = TLShape<"outside-work-card">;

const stroke = "#1a1a1a";
const sw = 1.3;

function MentoringIllustration({ id }: { id: string }) {
  return (
    <svg width="130" height="90" viewBox="0 0 130 90">
      <path d={wobblyRect(`${id}-bdr`, 126, 86, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(2, 2)" />

      {/* Whiteboard with UI wireframe */}
      <g transform="translate(8, 8)">
        <path d={wobblyRect(`${id}-wb`, 58, 32, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
        {/* Header bar */}
        <path d={wobblyRect(`${id}-wbh`, 48, 3, 0.3)} fill={stroke} stroke="none" transform="translate(5, 4)" />
        {/* Card 1 with avatar + lines */}
        <path d={wobblyRect(`${id}-wbc1`, 18, 18, 0.4)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(5, 10)" />
        <path d={wobblyCircle(`${id}-wbi1`, 10, 16, 2, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d={wobblyLine(`${id}-wbl1`, 7, 21, 21, 21, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyLine(`${id}-wbl2`, 7, 24, 18, 24, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        {/* Arrow pointing right */}
        <path d="M 24 19 L 32 19 M 30 17 L 32 19 L 30 21" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
        {/* Card 2 with content lines + button */}
        <path d={wobblyRect(`${id}-wbc2`, 18, 18, 0.4)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(35, 10)" />
        <path d={wobblyLine(`${id}-wbl3`, 38, 14, 50, 14, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyLine(`${id}-wbl4`, 38, 17, 48, 17, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyLine(`${id}-wbl5`, 38, 20, 50, 20, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyRect(`${id}-wbbt`, 10, 3, 0.3)} fill={stroke} stroke="none" transform="translate(39, 24)" />
      </g>
      {/* Easel leg */}
      <path d={wobblyLine(`${id}-el1`, 24, 40, 22, 52, 0.4)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyLine(`${id}-el2`, 50, 40, 52, 52, 0.4)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />

      {/* Sparkle / idea */}
      <g transform="translate(74, 8)">
        <path d="M 4 0 L 5 3 L 8 4 L 5 5 L 4 8 L 3 5 L 0 4 L 3 3 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      </g>

      {/* Mentor figure — standing right of board, pointing */}
      <g transform="translate(76, 20)">
        {/* Head */}
        <path d={wobblyCircle(`${id}-mh`, 10, 6, 4.5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw} />
        {/* Hair tuft */}
        <path d="M 6 3 Q 8 0 12 1 Q 14 2 14 4" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        {/* Body/torso */}
        <path d="M 5 12 Q 10 13 15 12 L 16 26 L 4 26 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        {/* Pointing arm to board */}
        <path d={wobblyLine(`${id}-marm1`, 6, 13, -8, 10, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        {/* Pointer stick */}
        <path d="M -8 10 L -14 8" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        {/* Other arm down */}
        <path d={wobblyLine(`${id}-marm2`, 15, 14, 20, 24, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        {/* Legs */}
        <path d={wobblyLine(`${id}-mlg1`, 7, 26, 5, 40, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        <path d={wobblyLine(`${id}-mlg2`, 13, 26, 15, 40, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
      </g>

      {/* Clock on wall top-right */}
      <g transform="translate(108, 10)">
        <path d={wobblyCircle(`${id}-clk`, 6, 6, 5, 0.4)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d={wobblyLine(`${id}-clm`, 6, 6, 6, 3, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d={wobblyLine(`${id}-clh`, 6, 6, 9, 6, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d={wobblyCircle(`${id}-clc`, 6, 6, 0.4, 0.1)} fill={stroke} stroke="none" />
      </g>

      {/* Desk surface */}
      <path d={wobblyLine(`${id}-desk`, 4, 68, 126, 68, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />

      {/* Student 1 — attentive with laptop */}
      <g transform="translate(10, 50)">
        <path d={wobblyCircle(`${id}-s1h`, 6, 4, 3.5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        <path d="M 2 9 Q 6 10 10 9 L 11 18 L 1 18 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        {/* Laptop (triangle screen + base) */}
        <path d="M -1 24 L 13 24 L 11 18 L 1 18 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d={wobblyLine(`${id}-s1k`, -1, 24, 13, 24, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      </g>

      {/* Student 2 — hand raised */}
      <g transform="translate(40, 48)">
        <path d={wobblyCircle(`${id}-s2h`, 6, 4, 3.5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        {/* Raised hand */}
        <path d="M 10 9 L 14 0" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d={wobblyCircle(`${id}-s2hd`, 14, -1, 1, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d="M 2 9 Q 6 10 10 9 L 11 20 L 1 20 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d="M -1 26 L 13 26 L 11 20 L 1 20 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      </g>

      {/* Student 3 — taking notes */}
      <g transform="translate(70, 50)">
        <path d={wobblyCircle(`${id}-s3h`, 6, 4, 3.5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        {/* Bun / hair */}
        <path d={wobblyCircle(`${id}-s3hr`, 9, 2, 1.5, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d="M 2 9 Q 6 10 10 9 L 11 18 L 1 18 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        {/* Notebook on desk */}
        <path d={wobblyRect(`${id}-s3n`, 12, 5, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} transform="translate(0, 18)" />
        <path d={wobblyLine(`${id}-s3nl1`, 2, 20, 10, 20, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
        <path d={wobblyLine(`${id}-s3nl2`, 2, 22, 8, 22, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
        {/* Pen arm */}
        <path d={wobblyLine(`${id}-s3pa`, 10, 12, 14, 18, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      </g>

      {/* Student 4 — laptop */}
      <g transform="translate(100, 50)">
        <path d={wobblyCircle(`${id}-s4h`, 6, 4, 3.5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        <path d="M 2 9 Q 6 10 10 9 L 11 18 L 1 18 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d="M -1 24 L 13 24 L 11 18 L 1 18 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d={wobblyLine(`${id}-s4k`, -1, 24, 13, 24, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      </g>

      {/* Potted plant bottom-right */}
      <g transform="translate(115, 72)">
        <path d={wobblyRect(`${id}-pot`, 8, 6, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d="M 4 0 Q 1 -4 3 -6 M 4 0 Q 7 -4 5 -6 M 4 0 Q 4 -5 4 -8" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      </g>

      {/* Ground */}
      <path d={wobblyLine(`${id}-gnd`, 4, 82, 126, 82, 1)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />
    </svg>
  );
}

function TravelIllustration({ id }: { id: string }) {
  return (
    <svg width="130" height="90" viewBox="0 0 130 90">
      <path d={wobblyRect(`${id}-bdr`, 126, 86, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(2, 2)" />

      {/* Sun with rays */}
      <path d={wobblyCircle(`${id}-sun`, 18, 18, 5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
      <path d={wobblyLine(`${id}-sr1`, 18, 7, 18, 10, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d={wobblyLine(`${id}-sr2`, 7, 18, 10, 18, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d={wobblyLine(`${id}-sr3`, 26, 10, 24, 12, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d={wobblyLine(`${id}-sr4`, 10, 10, 12, 12, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d={wobblyLine(`${id}-sr5`, 26, 26, 24, 24, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />

      {/* Clouds */}
      <path d="M 36 16 Q 38 12 42 13 Q 46 10 50 14 Q 52 17 48 18 Q 40 18 36 16 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d="M 82 11 Q 84 8 88 9 Q 92 7 96 10 Q 98 13 94 13 Q 86 13 82 11 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />

      {/* Plane with dashed contrail */}
      <path d="M 64 23 L 76 19 L 72 23 L 76 27 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d="M 64 23 L 72 23" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d="M 63 25 Q 52 24 42 28 Q 32 32 24 29" fill="none" stroke={stroke} strokeWidth={sw * 0.4} strokeDasharray="2 2" />

      {/* Birds */}
      <path d="M 102 22 Q 104 20 106 22 Q 108 20 110 22" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d="M 114 28 Q 115 27 116 28 Q 117 27 118 28" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />

      {/* Back mountain range with snow caps */}
      <path d="M 4 54 L 20 38 L 30 47 L 40 34 L 52 48 L 64 32 L 78 46 L 90 40 L 106 52 L 124 44 L 124 54 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.9} />
      {/* Snow cap on biggest peak */}
      <path d="M 58 37 L 64 32 L 70 37 L 67 36 L 64 38 L 61 36 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      <path d="M 37 38 L 40 34 L 43 38 L 41 37 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />

      {/* Rolling hill (front) */}
      <path d="M 2 66 Q 30 56 60 64 Q 90 56 126 65" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />

      {/* Pine trees */}
      <path d="M 16 60 L 20 50 L 24 60 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyLine(`${id}-tk1`, 20, 60, 20, 63, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d="M 102 62 L 106 52 L 110 62 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyLine(`${id}-tk2`, 106, 62, 106, 65, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d="M 114 60 L 117 52 L 120 60 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />

      {/* Tiny cabin with smoke */}
      <path d={wobblyRect(`${id}-cabin`, 10, 6, 0.4)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} transform="translate(32, 58)" />
      <path d="M 32 58 L 37 53 L 42 58 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d="M 40 55 Q 42 52 41 50 Q 40 48 42 46" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />

      {/* Ground */}
      <path d={wobblyLine(`${id}-gnd`, 4, 76, 126, 76, 1)} fill="none" stroke={stroke} strokeWidth={sw + 0.3} />

      {/* Winding road dashes */}
      <path d="M 14 82 Q 40 74 62 80 Q 84 86 110 80" fill="none" stroke={stroke} strokeWidth={sw * 0.6} strokeDasharray="3 3" />

      {/* Signpost */}
      <path d={wobblyLine(`${id}-spp`, 50, 68, 50, 76, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d="M 50 68 L 60 68 L 62 70 L 60 72 L 50 72 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />

      {/* Hiker 1 — walking forward with backpack */}
      <g transform="translate(28, 66)">
        {/* Head */}
        <path d={wobblyCircle(`${id}-h1h`, 0, 0, 2.2, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        {/* Hat brim */}
        <path d="M -3 -1.5 L 3 -1.5" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        {/* Backpack */}
        <path d={wobblyRect(`${id}-h1bp`, 3, 5, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(-4, 2.5)" />
        {/* Body */}
        <path d={wobblyLine(`${id}-h1bd`, 0, 2, 0, 10, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        {/* Walking stick */}
        <path d="M 3 3 L 5 13" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        {/* Swinging arm */}
        <path d={wobblyLine(`${id}-h1a`, 0, 4, 3, 8, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
        {/* Legs mid-stride */}
        <path d={wobblyLine(`${id}-h1l1`, 0, 10, -2, 16, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d={wobblyLine(`${id}-h1l2`, 0, 10, 3, 16, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      </g>

      {/* Hiker 2 — following behind, with rolling suitcase */}
      <g transform="translate(70, 72)">
        {/* Head */}
        <path d={wobblyCircle(`${id}-h2h`, 0, 0, 2, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        {/* Hair */}
        <path d="M -2 -1.5 Q 0 -3 2 -1.5" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        {/* Body */}
        <path d={wobblyLine(`${id}-h2bd`, 0, 2, 0, 9, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        {/* Arm holding suitcase handle */}
        <path d={wobblyLine(`${id}-h2a`, 0, 4, 4, 6, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
        {/* Free arm swinging */}
        <path d={wobblyLine(`${id}-h2a2`, 0, 4, -2, 8, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        {/* Rolling suitcase */}
        <path d={wobblyRect(`${id}-h2case`, 4, 6, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} transform="translate(4, 6)" />
        <path d="M 4 6 L 4 4 L 7 4 L 7 6" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        {/* Legs */}
        <path d={wobblyLine(`${id}-h2l1`, 0, 9, -1, 14, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d={wobblyLine(`${id}-h2l2`, 0, 9, 2, 14, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
      </g>
    </svg>
  );
}

function TinkeringIllustration({ id }: { id: string }) {
  const rulerTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <svg width="130" height="90" viewBox="0 0 130 90">
      <path d={wobblyRect(`${id}-bdr`, 126, 86, 1.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(2, 2)" />

      {/* Ruler strip across top */}
      <path d={wobblyRect(`${id}-ruler`, 108, 6, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(11, 8)" />
      {rulerTicks.map((i) => (
        <path
          key={i}
          d={`M ${16 + i * 11} 8 L ${16 + i * 11} ${i % 2 === 0 ? 12 : 10.5}`}
          fill="none"
          stroke={stroke}
          strokeWidth={sw * 0.4}
        />
      ))}

      {/* Open sketchbook — left */}
      <g transform="translate(8, 22)">
        <path d={wobblyRect(`${id}-sb`, 44, 38, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
        {/* Spine/fold */}
        <path d={wobblyLine(`${id}-sbf`, 22, 2, 22, 36, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        {/* Little house sketch on left page */}
        <path d="M 6 22 L 12 14 L 18 22 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
        <path d="M 8 22 L 8 30 L 16 30 L 16 22" fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
        <path d={wobblyRect(`${id}-sbw`, 2, 2, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} transform="translate(11, 24)" />
        {/* Doodle spiral + text lines on right page */}
        <path d="M 32 10 Q 36 8 38 12 Q 36 16 32 14 Q 30 12 34 12" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyLine(`${id}-dl1`, 26, 20, 40, 20, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyLine(`${id}-dl2`, 26, 24, 38, 24, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyLine(`${id}-dl3`, 26, 28, 40, 28, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d={wobblyLine(`${id}-dl4`, 26, 32, 35, 32, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
      </g>

      {/* Pencil lying across sketchbook corner */}
      <g transform="translate(38, 62) rotate(-18)">
        <path d={wobblyRect(`${id}-pnl`, 26, 3, 0.4)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d="M 26 0 L 30 1.5 L 26 3 Z" fill={stroke} stroke="none" />
        <path d={wobblyLine(`${id}-pnlt`, 0, 0, 0, 3, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d={wobblyLine(`${id}-pnlb`, 6, 0, 6, 3, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
      </g>

      {/* Yarn ball — top right */}
      <g transform="translate(78, 22)">
        <path d={wobblyCircle(`${id}-yarn`, 13, 13, 11, 1)} fill="none" stroke={stroke} strokeWidth={sw} />
        {/* Yarn wrap strands */}
        <path d="M 3 10 Q 13 6 23 13" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d="M 2 16 Q 13 11 24 17" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d="M 4 20 Q 13 16 22 20" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d="M 7 5 Q 13 13 19 22" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        <path d="M 19 5 Q 13 13 7 21" fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
        {/* Trailing yarn strand */}
        <path d="M 23 17 Q 30 19 28 24 Q 26 29 32 30" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
      </g>

      {/* Crochet hook — angled */}
      <g transform="translate(112, 53) rotate(30)">
        <path d={wobblyLine(`${id}-hook`, 0, 0, 14, 0, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d="M 0 0 Q -3 -1 -3 1 Q -2 2.5 -1 1.8" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d={wobblyCircle(`${id}-hkg`, 10, 0, 1.2, 0.2)} fill={stroke} stroke="none" />
      </g>

      {/* Mini knitted square (crochet piece) */}
      <g transform="translate(60, 66)">
        <path d={wobblyRect(`${id}-knit`, 14, 12, 0.6)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
        {/* Knit stitch texture */}
        <path d="M 2 3 Q 4 2 6 3 Q 8 2 10 3 Q 12 2 14 3" fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
        <path d="M 2 6 Q 4 5 6 6 Q 8 5 10 6 Q 12 5 14 6" fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
        <path d="M 2 9 Q 4 8 6 9 Q 8 8 10 9 Q 12 8 14 9" fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
      </g>

      {/* Scissors laying down */}
      <g transform="translate(76, 58)">
        <path d={wobblyCircle(`${id}-sc1`, 4, 10, 3.5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        <path d={wobblyCircle(`${id}-sc2`, 10, 14, 3.5, 0.5)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        {/* Blades */}
        <path d="M 7 7 L 24 -2 L 22 2 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        <path d="M 12 11 L 24 -2 L 22 2 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        {/* Pivot */}
        <path d={wobblyCircle(`${id}-scp`, 10, 8, 0.8, 0.2)} fill={stroke} stroke="none" />
      </g>

      {/* Glue bottle with drip */}
      <g transform="translate(104, 62)">
        <path d={wobblyRect(`${id}-gl`, 10, 18, 0.7)} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
        <path d={wobblyRect(`${id}-glc`, 5, 4, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} transform="translate(2.5, -4)" />
        <path d="M 5 -5 L 5 -7" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        {/* Label rect */}
        <path d={wobblyRect(`${id}-glb`, 6, 6, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.4} transform="translate(2, 5)" />
        <path d={wobblyLine(`${id}-gll1`, 3.5, 7.5, 6.5, 7.5, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
        <path d={wobblyLine(`${id}-gll2`, 3.5, 9, 7.5, 9, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
      </g>

      {/* Origami paper crane — top right corner */}
      <g transform="translate(108, 14)">
        <path d="M 0 6 L 8 2 L 14 5 L 10 7 L 14 10 L 8 9 L 0 11 L 4 7 Z" fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d="M 8 2 L 8 9" fill="none" stroke={stroke} strokeWidth={sw * 0.3} />
      </g>

      {/* Scattered beads */}
      <path d={wobblyCircle(`${id}-bd1`, 20, 82, 1.4, 0.3)} fill={stroke} stroke="none" />
      <path d={wobblyCircle(`${id}-bd2`, 26, 84, 1.1, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
      <path d={wobblyCircle(`${id}-bd3`, 32, 81, 1.2, 0.3)} fill={stroke} stroke="none" />
      <path d={wobblyCircle(`${id}-bd4`, 48, 83, 1, 0.3)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />

      {/* Sewing pin */}
      <g transform="translate(92, 78) rotate(-20)">
        <path d={wobblyLine(`${id}-pnln`, 0, 0, 14, 0, 0.2)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
        <path d={wobblyCircle(`${id}-pnhd`, 0, 0, 1.3, 0.2)} fill={stroke} stroke="none" />
      </g>
    </svg>
  );
}

const OUTSIDE_ILLUSTRATIONS: Record<string, React.FC<{ id: string }>> = {
  mentoring: MentoringIllustration,
  travel: TravelIllustration,
  tinkering: TinkeringIllustration,
};

function OutsideWorkCardComponent({ shape }: { shape: OutsideWorkCardShape }) {
  const { w, h, number, title, subtitle, description, illustration } = shape.props;
  const id = shape.id;
  const Illustration = OUTSIDE_ILLUSTRATIONS[illustration];

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
      <div style={{ display: "flex", gap: 12, height: "100%" }}>
        <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 300,
              opacity: 0.25,
              lineHeight: 1,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {number}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
              {title}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginBottom: 6, lineHeight: 1.3 }}>
              {subtitle}
            </div>
            <div style={{ fontSize: 12, opacity: 0.55, lineHeight: 1.6 }}>
              {description}
            </div>
          </div>
        </div>
        {Illustration && (
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Illustration id={`${id}-ill`} />
          </div>
        )}
      </div>
    </HTMLContainer>
  );
}

export class OutsideWorkCardShapeUtil extends ShapeUtil<OutsideWorkCardShape> {
  static override type = "outside-work-card" as const;

  static override props: RecordProps<OutsideWorkCardShape> = {
    w: T.number,
    h: T.number,
    number: T.string,
    title: T.string,
    subtitle: T.string,
    description: T.string,
    illustration: T.string,
  };

  getDefaultProps(): OutsideWorkCardShape["props"] {
    return {
      w: 520,
      h: 160,
      number: "1",
      title: "Activity",
      subtitle: "Subtitle",
      description: "Description text.",
      illustration: "mentoring",
    };
  }

  getGeometry(shape: OutsideWorkCardShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override onResize(shape: OutsideWorkCardShape, info: TLResizeInfo<OutsideWorkCardShape>) {
    return resizeBox(shape, info);
  }

  component(shape: OutsideWorkCardShape) {
    return <OutsideWorkCardComponent shape={shape} />;
  }

  indicator(shape: OutsideWorkCardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
