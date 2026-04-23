"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  hero,
  blogPosts,
  outsideWork,
  teamsWorkedWith,
  testimonial,
  contactMe,
  footerClosing,
  footerCta,
} from "@/lib/landingContent";
import { getFeaturedWork } from "@/lib/workData";
import { fadeUp, staggerContainer, ease } from "@/lib/renderedAnimations";
const s1 = "#0a0a0a";
const s2 = "#8a8a8a";
const sa = "#0a0a0a";

function HeroIllustration() {
  return (
    <svg width="240" height="200" viewBox="0 0 240 200" fill="none" aria-hidden="true" className="r-hero-illustration">
      {/* Figure — stylised girl at desk */}
      {/* Head */}
      <circle cx="120" cy="50" r="20" stroke={s1} strokeWidth="1.5" />
      {/* Hair */}
      <path d="M100 45 Q100 28 120 28 Q140 28 140 45" stroke={s1} strokeWidth="1.3" fill="none" />
      <path d="M100 44 Q96 50 94 64" stroke={s1} strokeWidth="1.2" fill="none" />
      <path d="M140 44 Q144 50 146 64" stroke={s1} strokeWidth="1.2" fill="none" />
      {/* Body */}
      <path d="M108 70 Q120 74 132 70 L136 110 L104 110 Z" stroke={s1} strokeWidth="1.3" fill="none" />
      {/* Arms on desk */}
      <path d="M108 82 Q96 86 80 90 L78 96" stroke={s1} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M132 82 Q144 86 160 90 L162 96" stroke={s1} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Desk */}
      <line x1="40" y1="110" x2="200" y2="110" stroke={s2} strokeWidth="1.2" />
      {/* Laptop on desk */}
      <rect x="86" y="96" width="68" height="14" rx="2" stroke={s2} strokeWidth="1" />
      <path d="M82 110 L86 96 M154 96 L158 110" stroke={s2} strokeWidth="0.8" />
      {/* Chair back */}
      <path d="M96 74 Q120 80 144 74 Q148 78 148 86 L92 86 Q92 78 96 74 Z" stroke={s2} strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* Decorative elements */}
      {/* Plant */}
      <rect x="180" y="92" width="14" height="18" rx="3" stroke={s2} strokeWidth="1" />
      <path d="M187 92 Q187 80 182 74" stroke={sa} strokeWidth="1" fill="none" />
      <path d="M187 92 Q187 82 192 76" stroke={sa} strokeWidth="1" fill="none" />
      <ellipse cx="181" cy="73" rx="4" ry="3" stroke={sa} strokeWidth="0.8" fill="none" />
      <ellipse cx="193" cy="75" rx="4" ry="3" stroke={sa} strokeWidth="0.8" fill="none" />
      {/* Coffee cup */}
      <rect x="46" y="96" width="14" height="14" rx="2" stroke={s2} strokeWidth="1" />
      <path d="M60 99 Q66 99 66 103 Q66 107 60 107" stroke={s2} strokeWidth="0.8" fill="none" />
      {/* Sparkle */}
      <g transform="translate(56, 42)" opacity="0.6">
        <line x1="4" y1="0" x2="4" y2="8" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="0" y1="4" x2="8" y2="4" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
      </g>
      <g transform="translate(172, 46)" opacity="0.4">
        <line x1="3" y1="0" x2="3" y2="6" stroke={sa} strokeWidth="0.7" strokeLinecap="round" />
        <line x1="0" y1="3" x2="6" y2="3" stroke={sa} strokeWidth="0.7" strokeLinecap="round" />
      </g>
      {/* Legs */}
      <line x1="112" y1="110" x2="108" y2="140" stroke={s1} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="128" y1="110" x2="132" y2="140" stroke={s1} strokeWidth="1.2" strokeLinecap="round" />
      {/* Chair legs */}
      <line x1="100" y1="140" x2="92" y2="156" stroke={s2} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="140" y1="140" x2="148" y2="156" stroke={s2} strokeWidth="0.8" strokeLinecap="round" />
      {/* Chair base */}
      <line x1="88" y1="156" x2="152" y2="156" stroke={s2} strokeWidth="0.8" strokeLinecap="round" />
      {/* Wheels */}
      <circle cx="94" cy="158" r="2" stroke={s2} strokeWidth="0.7" />
      <circle cx="146" cy="158" r="2" stroke={s2} strokeWidth="0.7" />
      <circle cx="120" cy="158" r="2" stroke={s2} strokeWidth="0.7" />
    </svg>
  );
}

function MentoringIllustration() {
  return (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" aria-hidden="true" className="r-outside-illustration">
      {/* Whiteboard */}
      <rect x="10" y="10" width="100" height="65" rx="4" stroke={s1} strokeWidth="1.3" />
      {/* Header bar */}
      <rect x="18" y="18" width="84" height="6" rx="2" fill="var(--r-border)" />
      {/* Card 1 */}
      <rect x="18" y="30" width="36" height="36" rx="3" stroke="var(--r-border)" strokeWidth="0.8" />
      <circle cx="30" cy="40" r="4" stroke={s2} strokeWidth="0.8" />
      <line x1="22" y1="50" x2="50" y2="50" stroke={s2} strokeWidth="0.6" />
      <line x1="22" y1="55" x2="44" y2="55" stroke={s2} strokeWidth="0.6" />
      {/* Arrow */}
      <path d="M58 48 L68 48 M66 45 L69 48 L66 51" stroke={s2} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Card 2 */}
      <rect x="72" y="30" width="30" height="36" rx="3" stroke="var(--r-border)" strokeWidth="0.8" />
      <line x1="78" y1="38" x2="96" y2="38" stroke={s2} strokeWidth="0.6" />
      <line x1="78" y1="44" x2="92" y2="44" stroke={s2} strokeWidth="0.6" />
      <line x1="78" y1="50" x2="96" y2="50" stroke={s2} strokeWidth="0.6" />
      <rect x="78" y="56" width="14" height="4" rx="1" fill={sa} opacity="0.3" />
      {/* Easel legs */}
      <line x1="40" y1="75" x2="36" y2="95" stroke={s2} strokeWidth="1" />
      <line x1="80" y1="75" x2="84" y2="95" stroke={s2} strokeWidth="1" />
      {/* Mentor figure */}
      <circle cx="140" cy="40" r="10" stroke={s1} strokeWidth="1.3" />
      <path d="M130 55 Q140 58 150 55 L152 85 L128 85 Z" stroke={s1} strokeWidth="1.2" fill="none" />
      {/* Pointing arm */}
      <path d="M130 60 Q118 55 112 52" stroke={s1} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Pointer stick */}
      <line x1="112" y1="52" x2="104" y2="48" stroke={s2} strokeWidth="0.8" strokeLinecap="round" />
      {/* Legs */}
      <line x1="135" y1="85" x2="132" y2="115" stroke={s1} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="145" y1="85" x2="148" y2="115" stroke={s1} strokeWidth="1.2" strokeLinecap="round" />
      {/* Student figures */}
      <circle cx="40" cy="108" r="6" stroke={s2} strokeWidth="1" />
      <path d="M34 118 Q40 120 46 118 L47 135 L33 135 Z" stroke={s2} strokeWidth="1" fill="none" />
      <circle cx="80" cy="106" r="6" stroke={s2} strokeWidth="1" />
      <path d="M74 116 Q80 118 86 116 L87 135 L73 135 Z" stroke={s2} strokeWidth="1" fill="none" />
      {/* Raised hand */}
      <line x1="86" y1="116" x2="92" y2="102" stroke={s2} strokeWidth="0.8" strokeLinecap="round" />
      {/* Sparkle */}
      <g transform="translate(164, 22)">
        <line x1="5" y1="0" x2="5" y2="10" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="0" y1="5" x2="10" y2="5" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
      </g>
      {/* Desk line */}
      <line x1="10" y1="135" x2="180" y2="135" stroke={s2} strokeWidth="0.8" />
    </svg>
  );
}

function TravelIllustration() {
  return (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" aria-hidden="true" className="r-outside-illustration">
      {/* Sun */}
      <circle cx="30" cy="28" r="10" stroke={sa} strokeWidth="1.2" />
      <line x1="30" y1="12" x2="30" y2="16" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="18" y2="28" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="42" y1="16" x2="39" y2="19" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="18" y1="16" x2="21" y2="19" stroke={sa} strokeWidth="0.8" strokeLinecap="round" />
      {/* Cloud */}
      <path d="M60 25 Q62 18 68 20 Q74 15 80 22 Q84 26 78 28 Q66 28 60 25 Z" stroke={s2} strokeWidth="0.8" />
      {/* Plane */}
      <path d="M110 32 L126 26 L122 32 L126 38 Z" stroke={s2} strokeWidth="1" />
      <path d="M110 34 Q96 33 82 40" stroke={s2} strokeWidth="0.6" strokeDasharray="3 3" />
      {/* Mountains */}
      <path d="M0 90 L30 58 L50 75 L70 48 L95 72 L115 52 L140 68 L165 56 L190 74 L200 68 L200 90 Z" stroke={s1} strokeWidth="1.2" fill="none" />
      {/* Snow cap */}
      <path d="M63 55 L70 48 L77 55 L74 53 L70 56 L66 53 Z" stroke={s2} strokeWidth="0.8" fill="var(--r-bg-elevated)" />
      {/* Hills */}
      <path d="M0 108 Q50 92 100 106 Q150 92 200 105" stroke={s2} strokeWidth="1" fill="none" />
      {/* Trees */}
      <path d="M28 96 L34 82 L40 96 Z" stroke={s2} strokeWidth="1" />
      <line x1="34" y1="96" x2="34" y2="104" stroke={s2} strokeWidth="1" />
      <path d="M155 100 L160 86 L165 100 Z" stroke={s2} strokeWidth="1" />
      <line x1="160" y1="100" x2="160" y2="108" stroke={s2} strokeWidth="1" />
      {/* Cabin */}
      <rect x="72" y="96" width="16" height="12" rx="1" stroke={s2} strokeWidth="1" />
      <path d="M70 96 L80 86 L90 96" stroke={s2} strokeWidth="1" fill="none" />
      {/* Smoke */}
      <path d="M85 88 Q87 82 85 78 Q83 74 86 70" stroke={s2} strokeWidth="0.6" fill="none" opacity="0.5" />
      {/* Hiker 1 */}
      <circle cx="120" cy="106" r="4" stroke={s1} strokeWidth="1" />
      <line x1="120" y1="110" x2="120" y2="128" stroke={s1} strokeWidth="1" strokeLinecap="round" />
      <line x1="120" y1="128" x2="116" y2="142" stroke={s1} strokeWidth="1" strokeLinecap="round" />
      <line x1="120" y1="128" x2="124" y2="142" stroke={s1} strokeWidth="1" strokeLinecap="round" />
      <line x1="120" y1="116" x2="126" y2="124" stroke={s1} strokeWidth="0.8" strokeLinecap="round" />
      {/* Walking stick */}
      <line x1="126" y1="118" x2="130" y2="140" stroke={s2} strokeWidth="0.7" strokeLinecap="round" />
      {/* Backpack */}
      <rect x="114" y="112" width="6" height="10" rx="1.5" stroke={s2} strokeWidth="0.8" />
      {/* Hiker 2 */}
      <circle cx="145" cy="112" r="3.5" stroke={s2} strokeWidth="1" />
      <line x1="145" y1="116" x2="145" y2="130" stroke={s2} strokeWidth="1" strokeLinecap="round" />
      <line x1="145" y1="130" x2="142" y2="142" stroke={s2} strokeWidth="1" strokeLinecap="round" />
      <line x1="145" y1="130" x2="148" y2="142" stroke={s2} strokeWidth="1" strokeLinecap="round" />
      {/* Suitcase */}
      <rect x="150" y="124" width="6" height="10" rx="1" stroke={s2} strokeWidth="0.7" />
      {/* Ground */}
      <line x1="0" y1="142" x2="200" y2="142" stroke={s2} strokeWidth="0.8" />
      {/* Path */}
      <path d="M20 150 Q60 144 100 148 Q140 152 180 146" stroke={s2} strokeWidth="0.7" strokeDasharray="4 4" />
    </svg>
  );
}

function TinkeringIllustration() {
  return (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" aria-hidden="true" className="r-outside-illustration">
      {/* Open sketchbook */}
      <rect x="10" y="30" width="80" height="64" rx="3" stroke={s1} strokeWidth="1.3" />
      <line x1="50" y1="33" x2="50" y2="91" stroke={s2} strokeWidth="0.6" />
      {/* House sketch on left page */}
      <path d="M22 62 L32 48 L42 62 Z" stroke={s2} strokeWidth="0.9" />
      <rect x="25" y="62" width="14" height="16" rx="1" stroke={s2} strokeWidth="0.9" />
      <rect x="30" y="66" width="4" height="4" rx="0.5" stroke={s2} strokeWidth="0.6" />
      {/* Lines on right page */}
      <line x1="56" y1="44" x2="82" y2="44" stroke={s2} strokeWidth="0.6" />
      <line x1="56" y1="52" x2="78" y2="52" stroke={s2} strokeWidth="0.6" />
      <line x1="56" y1="60" x2="82" y2="60" stroke={s2} strokeWidth="0.6" />
      <line x1="56" y1="68" x2="74" y2="68" stroke={s2} strokeWidth="0.6" />
      {/* Spiral doodle */}
      <path d="M68 38 Q74 34 76 40 Q74 46 68 44 Q64 42 70 42" stroke={s2} strokeWidth="0.6" fill="none" />
      {/* Yarn ball */}
      <circle cx="140" cy="48" r="22" stroke={s1} strokeWidth="1.3" />
      <path d="M120 42 Q140 34 160 48" stroke={s2} strokeWidth="0.6" />
      <path d="M118 52 Q140 44 162 56" stroke={s2} strokeWidth="0.6" />
      <path d="M122 60 Q140 52 158 62" stroke={s2} strokeWidth="0.6" />
      {/* Trailing yarn */}
      <path d="M160 56 Q170 60 168 72 Q166 82 176 86" stroke={s2} strokeWidth="0.8" fill="none" />
      {/* Crochet piece */}
      <rect x="100" y="110" width="24" height="20" rx="2" stroke={s2} strokeWidth="1" />
      <path d="M103 116 Q107 114 111 116 Q115 114 119 116 Q123 114 124 116" stroke={s2} strokeWidth="0.5" fill="none" />
      <path d="M103 122 Q107 120 111 122 Q115 120 119 122 Q123 120 124 122" stroke={s2} strokeWidth="0.5" fill="none" />
      {/* Scissors */}
      <circle cx="148" cy="114" r="6" stroke={s2} strokeWidth="1" />
      <circle cx="160" cy="120" r="6" stroke={s2} strokeWidth="1" />
      <path d="M152 108 L176 96" stroke={s2} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M164 114 L176 96" stroke={s2} strokeWidth="0.9" strokeLinecap="round" />
      {/* Pencil */}
      <g transform="translate(28, 100) rotate(-15)">
        <rect x="0" y="0" width="50" height="5" rx="1" stroke={s2} strokeWidth="0.9" />
        <path d="M50 0 L56 2.5 L50 5 Z" fill={sa} opacity="0.4" stroke="none" />
      </g>
      {/* Glue bottle */}
      <rect x="174" y="104" width="16" height="30" rx="2" stroke={s2} strokeWidth="1" />
      <rect x="178" y="96" width="8" height="8" rx="1" stroke={s2} strokeWidth="0.8" />
      <rect x="178" y="114" width="8" height="8" rx="1" stroke="var(--r-border)" strokeWidth="0.5" />
      {/* Origami crane */}
      <g transform="translate(170, 20)">
        <path d="M0 10 L12 4 L22 8 L16 12 L22 16 L12 14 L0 18 L6 12 Z" stroke={s2} strokeWidth="0.8" />
        <line x1="12" y1="4" x2="12" y2="14" stroke={s2} strokeWidth="0.4" />
      </g>
      {/* Beads */}
      <circle cx="40" cy="140" r="2.5" fill={sa} opacity="0.3" />
      <circle cx="50" cy="142" r="2" stroke={s2} strokeWidth="0.6" />
      <circle cx="60" cy="139" r="2.5" fill={sa} opacity="0.2" />
    </svg>
  );
}

const OUTSIDE_ILLUSTRATIONS: Record<string, React.FC> = {
  mentoring: MentoringIllustration,
  travel: TravelIllustration,
  tinkering: TinkeringIllustration,
};

function CompanyMark({ company }: { company: string }) {
  const slug = company.toLowerCase().replace(/[^a-z0-9]/g, "");
  const LogoSvg = COMPANY_LOGOS[slug];
  if (LogoSvg) return <span className="r-company-mark" aria-label={company} title={company}><LogoSvg /></span>;
  return (
    <span className="r-company-mark" aria-label={company} title={company}>
      {company.charAt(0)}
    </span>
  );
}

function FitpassLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <path d="M8 10 L32 10 L20 32 Z" fill="currentColor" />
      <circle cx="20" cy="17" r="4" fill="var(--r-bg)" />
    </svg>
  );
}

function AbhiloansLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <path d="M5 32 A 17 17 0 1 1 35 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="30" x2="30" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="30" r="2.5" fill="currentColor" />
    </svg>
  );
}

function EmaLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="13" r="5" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="38" textAnchor="middle" fontFamily="var(--r-sans)" fontSize="9" fontWeight="800" fill="currentColor">EMA</text>
    </svg>
  );
}

function EpicLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <text x="20" y="26" textAnchor="middle" fontFamily="var(--r-sans)" fontSize="16" fontWeight="800" fill="currentColor">E!</text>
    </svg>
  );
}

function PersonalLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="14" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M8 36 Q8 24 20 24 Q32 24 32 36" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function SuperTeacherLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <path d="M20 4 L24 16 L36 16 L26 24 L30 36 L20 28 L10 36 L14 24 L4 16 L16 16 Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function ZkagiLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <path d="M8 10 L32 10 L8 32 L32 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function TopprLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="8" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" />
      <path d="M20 14 L20 26 M14 20 L20 14 L26 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PersonalplayLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <polygon points="14,8 32,20 14,32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

const COMPANY_LOGOS: Record<string, React.FC> = {
  fitpass: FitpassLogo,
  abhiloans: AbhiloansLogo,
  ema: EmaLogo,
  epic: EpicLogo,
  personal: PersonalLogo,
  superteacher: SuperTeacherLogo,
  zkagi: ZkagiLogo,
  toppr: TopprLogo,
  personalplay: PersonalplayLogo,
};

function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10L10 4M10 4H5M10 4v5" />
    </svg>
  );
}

function ContactIcon({ type }: { type: string }) {
  const s = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "linkedin":
      return <svg {...s}><rect x="2" y="2" width="12" height="12" rx="2" /><path d="M5.5 7v3.5M5.5 5v.01M8 10.5V8a1.5 1.5 0 013 0v2.5" /></svg>;
    case "twitter":
      return <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><path d="M9.47 6.77L14.18 1.5h-1.12L8.96 6.03 5.87 1.5H2l4.94 7.19L2 14.5h1.12l4.32-5.02 3.45 5.02H14L9.47 6.77Zm-1.53 1.78l-.5-.71L3.4 2.34h1.71l3.22 4.6.5.71 4.17 5.97h-1.71l-3.4-4.87h-.02l.27.7Z" /></svg>;
    case "medium":
      return <svg {...s}><circle cx="5" cy="8" r="3" /><ellipse cx="10" cy="8" rx="1.5" ry="3" /><ellipse cx="13" cy="8" rx="0.5" ry="3" /></svg>;
    case "email":
      return <svg {...s}><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="M2 5l6 4 6-4" /></svg>;
    case "instagram":
      return <svg {...s}><rect x="2" y="2" width="12" height="12" rx="3" /><circle cx="8" cy="8" r="3" /><circle cx="11.5" cy="4.5" r="0.5" fill="currentColor" stroke="none" /></svg>;
    default:
      return null;
  }
}

export default function RenderedHome() {
  const featured = getFeaturedWork();

  const companies = teamsWorkedWith.companyNames;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="r-hero">
        <div className="r-hero-text">
          <motion.span
            className="r-hero-greeting"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {hero.greeting}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            {hero.name}
          </motion.h1>

          <motion.p
            className="r-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            {hero.subtitle.replace("\n", " — ")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease }}
          >
            <Link href="/rendered/contact" className="r-hero-cta">
              {hero.cta.label}
              <ArrowRight />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="r-hero-illustration-wrap"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <HeroIllustration />
        </motion.div>
      </section>

      <hr className="r-divider" />

      {/* ─── FEATURED WORK ─── */}
      <div className="r-container">
        <motion.section
          className="r-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.p className="r-section-label" variants={fadeUp} custom={0}>
            Selected Work
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}>
            Projects I&rsquo;m proud of
          </motion.h2>

          <div className="r-work-list">
            {featured.map((item, i) => (
              <motion.div key={item.slug} variants={fadeUp} custom={i + 2}>
                <Link href={`/rendered/work/${item.slug}`} className="r-work-item">
                  <CompanyMark company={item.company} />
                  <div className="r-work-meta">
                    <span className="r-work-company">{item.company}</span>
                    <span className="r-work-title">{item.title}</span>
                    <span className="r-work-tagline">{item.tagline}</span>
                  </div>
                  <span className="r-work-arrow"><ArrowRight /></span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} custom={featured.length + 2}>
            <Link href="/rendered/work" className="r-work-cta">
              View all work <ArrowRight />
            </Link>
          </motion.div>
        </motion.section>
      </div>

      {/* ─── TESTIMONIAL — full-bleed band ─── */}
      <motion.div
        className="r-testimonial-band"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="r-testimonial-inner">
          <p className="r-section-label">{testimonial.heading}</p>
          <blockquote>{testimonial.quote}</blockquote>
        </div>
      </motion.div>

      {/* ─── WRITING ─── */}
      <div className="r-container">
        <motion.section
          className="r-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.p className="r-section-label" variants={fadeUp} custom={0}>
            Writing &amp; Ideas
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}>
            Things I&rsquo;ve been thinking about
          </motion.h2>

          <div className="r-writing-list">
            {blogPosts.map((post, i) => (
              <motion.a
                key={post.href}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="r-writing-item"
                variants={fadeUp}
                custom={i + 2}
              >
                <div>
                  <h3>{post.title}</h3>
                  <p className="r-writing-desc">{post.description}</p>
                </div>
                <span className="r-writing-arrow"><ExternalArrow /></span>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>

      <hr className="r-divider" />

      {/* ─── OUTSIDE WORK — vertical with illustrations ─── */}
      <div className="r-container">
        <motion.section
          className="r-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.p className="r-section-label" variants={fadeUp} custom={0}>
            Beyond the Screen
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}>{outsideWork.heading}</motion.h2>

          <div className="r-outside-list">
            {outsideWork.items.map((item, i) => {
              const Illustration = OUTSIDE_ILLUSTRATIONS[item.illustration];
              return (
                <motion.div
                  key={item.number}
                  className={`r-outside-item ${i % 2 !== 0 ? "r-outside-item--reverse" : ""}`}
                  variants={fadeUp}
                  custom={i + 2}
                >
                  <div className="r-outside-item-content">
                    <h3>{item.title}</h3>
                    <p className="r-outside-item-subtitle">{item.subtitle}</p>
                    <p className="r-outside-item-desc">{item.description}</p>
                  </div>
                  {Illustration && (
                    <div className="r-outside-item-illustration">
                      <Illustration />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* ─── TEAMS ─── */}
      <div className="r-full-bleed">
        <div className="r-full-bleed-inner" style={{ padding: "56px 40px" }}>
          <p className="r-section-label" style={{ textAlign: "center", marginBottom: 40 }}>
            {teamsWorkedWith.heading}
          </p>
          <div className="r-teams-grid">
            {teamsWorkedWith.companies.map((key, i) => {
              const name = companies[i];
              return (
                <div key={key} className="r-team-logo-cell">
                  <span className="r-team-logo-name">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── CONTACT ─── */}
      <div className="r-container">
        <motion.section
          className="r-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.p className="r-section-label" variants={fadeUp} custom={0}>
            Get in Touch
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}>{contactMe.heading}</motion.h2>

          <motion.div className="r-contact-grid" variants={fadeUp} custom={2}>
            {contactMe.links.map((link) => (
              <a
                key={link.icon}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="r-contact-pill"
              >
                <ContactIcon type={link.icon} />
                {link.label}
              </a>
            ))}
          </motion.div>
        </motion.section>
      </div>

      <hr className="r-divider" />

      {/* ─── CLOSING CTA ─── */}
      <motion.section
        className="r-closing"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease }}
      >
        <h2>{footerClosing}</h2>
        <Link href="/rendered/contact" className="r-hero-cta">
          {footerCta.label}
          <ArrowRight />
        </Link>
      </motion.section>
    </>
  );
}
