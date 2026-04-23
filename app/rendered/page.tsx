"use client";

import Image from "next/image";
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

type IllustrationProps = {
  className?: string;
};

const INK = "#121212";
const MID = "#8b8b8b";
const WASH = "#f1f0ec";
const PAPER = "var(--r-bg)";
const SKIN = "#f4d9c9";
const BLUSH = "#eeb7b0";
const HAIR = "#181818";
const GOLD = "#f1d36d";
const SAGE = "#c9d8c0";
const SKY = "#d9e6ef";
const ROSE = "#e4c4cb";
const DENIM = "#c8d3ed";

const HERO_ILLUSTRATION = {
  src: "/rendered/generated/hero-notion-avatar.png",
  width: 1448,
  height: 1086,
};

const OUTSIDE_IMAGE_ILLUSTRATIONS = {
  mentoring: {
    src: "/rendered/generated/outside-mentoring-avatar.png",
    width: 1448,
    height: 1086,
  },
  travel: {
    src: "/rendered/generated/outside-travel-avatar.png",
    width: 1448,
    height: 1086,
  },
  tinkering: {
    src: "/rendered/generated/outside-tinkering-avatar.png",
    width: 1448,
    height: 1086,
  },
} as const;

function HeroIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M44 176C60 132 92 92 140 86C184 80 224 108 252 154C258 164 270 176 286 180V206H64C50 206 40 194 44 176Z" fill={WASH} stroke="none" />
      <circle cx="258" cy="52" r="24" fill={ROSE} />
      <circle cx="72" cy="62" r="20" fill={SKY} />
      <rect x="216" y="28" width="64" height="84" rx="18" fill={PAPER} stroke={MID} strokeWidth="2" />
      <path d="M232 54H264" stroke={MID} strokeWidth="2" />
      <path d="M232 68H258" stroke={MID} strokeWidth="2" />
      <path d="M232 82H266" stroke={MID} strokeWidth="2" />
      <rect x="38" y="48" width="58" height="38" rx="14" fill={PAPER} stroke={MID} strokeWidth="2" />
      <path d="M54 66H82" stroke={MID} strokeWidth="2" />
      <path d="M54 78H74" stroke={MID} strokeWidth="2" />
      <rect x="56" y="162" width="214" height="22" rx="11" fill={PAPER} stroke={INK} strokeWidth="2.2" />
      <rect x="146" y="132" width="72" height="30" rx="10" fill={PAPER} stroke={INK} strokeWidth="2.2" />
      <path d="M158 144H204" stroke={MID} strokeWidth="2" />
      <path d="M158 154H194" stroke={MID} strokeWidth="2" />
      <path d="M94 170C90 152 90 132 100 118" stroke={INK} strokeWidth="2.2" />
      <path d="M154 170C156 150 156 134 148 122" stroke={INK} strokeWidth="2.2" />
      <path d="M108 92C96 102 92 118 96 132C98 138 102 142 108 146H144C154 140 160 128 160 114C160 98 150 86 136 80L108 92Z" fill={GOLD} stroke={INK} strokeWidth="2.2" />
      <ellipse cx="124" cy="88" rx="28" ry="26" fill={SKIN} stroke={INK} strokeWidth="2.2" />
      <path d="M98 84C102 60 132 52 148 72C152 78 154 88 150 96C144 88 136 82 126 80C118 78 108 78 98 84Z" fill={HAIR} stroke={INK} strokeWidth="2" />
      <circle cx="115" cy="90" r="2.4" fill={INK} stroke="none" />
      <circle cx="131" cy="90" r="2.4" fill={INK} stroke="none" />
      <path d="M118 102C122 106 126 106 130 102" stroke={INK} strokeWidth="1.8" />
      <circle cx="106" cy="98" r="3" fill={BLUSH} stroke="none" opacity="0.85" />
      <circle cx="140" cy="98" r="3" fill={BLUSH} stroke="none" opacity="0.85" />
      <path d="M102 120C118 126 132 128 146 126" stroke={INK} strokeWidth="2.2" />
      <path d="M146 132C136 142 126 150 116 158" stroke={INK} strokeWidth="2.2" />
      <path d="M100 128C114 136 126 142 146 146" stroke={INK} strokeWidth="2.2" />
      <path d="M114 160L108 182" stroke={INK} strokeWidth="2.2" />
      <path d="M132 160L138 182" stroke={INK} strokeWidth="2.2" />
      <path d="M238 152V130" stroke={INK} strokeWidth="2" />
      <path d="M238 130C232 124 230 116 232 108" stroke={INK} strokeWidth="1.8" />
      <path d="M238 130C244 124 246 116 244 108" stroke={INK} strokeWidth="1.8" />
      <rect x="228" y="152" width="20" height="18" rx="5" fill={SAGE} stroke={INK} strokeWidth="2" />
      <rect x="68" y="150" width="18" height="20" rx="5" fill={ROSE} stroke={INK} strokeWidth="2" />
      <path d="M86 154C92 154 94 164 88 166" stroke={INK} strokeWidth="1.8" />
      <path d="M50 36V48" stroke={INK} strokeWidth="2" />
      <path d="M44 42H56" stroke={INK} strokeWidth="2" />
      <path d="M254 126V138" stroke={INK} strokeWidth="2" />
      <path d="M248 132H260" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

function MentoringIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 178C46 140 92 120 138 122C184 124 222 146 266 182V208H34C20 208 12 194 20 178Z" fill={WASH} stroke="none" />
      <rect x="28" y="38" width="132" height="94" rx="20" fill={PAPER} stroke={INK} strokeWidth="2.2" />
      <path d="M48 60H140" stroke={MID} strokeWidth="2" />
      <rect x="50" y="76" width="40" height="30" rx="10" fill={SKY} stroke={MID} strokeWidth="1.8" />
      <circle cx="62" cy="88" r="5" fill={PAPER} stroke={MID} strokeWidth="1.4" />
      <path d="M100 84H128" stroke={MID} strokeWidth="1.8" />
      <path d="M100 96H136" stroke={MID} strokeWidth="1.8" />
      <path d="M70 146V178" stroke={MID} strokeWidth="2" />
      <path d="M122 146V178" stroke={MID} strokeWidth="2" />
      <ellipse cx="228" cy="74" rx="26" ry="24" fill={SKIN} stroke={INK} strokeWidth="2.2" />
      <path d="M202 72C204 54 224 48 238 52C250 56 258 66 252 84C246 76 240 72 228 70C220 68 212 68 202 72Z" fill={HAIR} stroke={INK} strokeWidth="2" />
      <circle cx="220" cy="78" r="2.4" fill={INK} stroke="none" />
      <circle cx="236" cy="78" r="2.4" fill={INK} stroke="none" />
      <path d="M222 90C226 94 230 94 234 90" stroke={INK} strokeWidth="1.8" />
      <circle cx="212" cy="86" r="3" fill={BLUSH} stroke="none" />
      <circle cx="244" cy="86" r="3" fill={BLUSH} stroke="none" />
      <path d="M204 102C214 98 238 98 250 106V142C238 150 218 150 204 140V102Z" fill={DENIM} stroke={INK} strokeWidth="2.2" />
      <path d="M206 114L184 100" stroke={INK} strokeWidth="2.2" />
      <path d="M184 100L154 94" stroke={INK} strokeWidth="2.2" />
      <path d="M248 116L266 128" stroke={INK} strokeWidth="2.2" />
      <path d="M220 142L212 182" stroke={INK} strokeWidth="2.2" />
      <path d="M236 142L242 182" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="102" cy="162" rx="18" ry="16" fill={SKIN} stroke={INK} strokeWidth="2" />
      <path d="M84 158C88 146 106 140 120 150C122 152 122 156 120 166C114 158 108 156 102 156C96 156 90 156 84 158Z" fill={HAIR} stroke={INK} strokeWidth="1.8" />
      <path d="M88 176C94 170 110 170 118 176V200C110 204 96 204 88 200V176Z" fill={ROSE} stroke={INK} strokeWidth="2" />
      <circle cx="144" cy="168" r="15" fill={SKIN} stroke={INK} strokeWidth="2" />
      <path d="M129 164C132 152 148 148 160 156C162 158 162 162 160 170C154 164 150 162 144 162C138 162 134 162 129 164Z" fill={HAIR} stroke={INK} strokeWidth="1.8" />
      <path d="M132 180C140 174 150 174 158 180V202C150 206 140 206 132 202V180Z" fill={SAGE} stroke={INK} strokeWidth="2" />
      <path d="M152 182L166 160" stroke={INK} strokeWidth="2" />
      <path d="M266 48V60" stroke={INK} strokeWidth="2" />
      <path d="M260 54H272" stroke={INK} strokeWidth="2" />
      <path d="M30 206H282" stroke={MID} strokeWidth="2" />
    </svg>
  );
}

function TravelIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 186C54 144 106 132 152 140C198 148 232 170 278 182V208H34C22 208 14 196 22 186Z" fill={WASH} stroke="none" />
      <circle cx="54" cy="52" r="18" fill={GOLD} stroke={INK} strokeWidth="2" />
      <path d="M48 24V34" stroke={MID} strokeWidth="1.8" />
      <path d="M30 42H40" stroke={MID} strokeWidth="1.8" />
      <path d="M68 36L74 30" stroke={MID} strokeWidth="1.8" />
      <path d="M102 52C116 38 134 36 148 46" stroke={MID} strokeWidth="2" />
      <path d="M220 52L244 44L238 54L244 64Z" stroke={INK} strokeWidth="2" />
      <path d="M220 56C200 58 180 68 164 82" stroke={MID} strokeWidth="1.8" strokeDasharray="6 6" />
      <path d="M26 160C58 116 90 92 126 86C168 80 204 94 242 124" stroke={SAGE} strokeWidth="8" />
      <path d="M26 176C74 152 128 150 172 162C208 172 240 172 286 164" stroke={SKY} strokeWidth="8" />
      <ellipse cx="214" cy="132" rx="24" ry="22" fill={SKIN} stroke={INK} strokeWidth="2.2" />
      <path d="M192 128C196 110 216 104 230 108C242 112 248 122 244 138C236 130 226 126 214 126C208 126 200 126 192 128Z" fill={HAIR} stroke={INK} strokeWidth="2" />
      <circle cx="206" cy="136" r="2.4" fill={INK} stroke="none" />
      <circle cx="220" cy="136" r="2.4" fill={INK} stroke="none" />
      <path d="M208 148C212 152 216 152 220 148" stroke={INK} strokeWidth="1.8" />
      <path d="M194 160C206 154 224 154 238 162V194C224 202 206 202 194 194V160Z" fill={DENIM} stroke={INK} strokeWidth="2.2" />
      <path d="M194 170L178 178" stroke={INK} strokeWidth="2.2" />
      <path d="M238 172L254 180" stroke={INK} strokeWidth="2.2" />
      <path d="M208 194L198 208" stroke={INK} strokeWidth="2.2" />
      <path d="M226 194L236 208" stroke={INK} strokeWidth="2.2" />
      <path d="M178 178L172 206" stroke={INK} strokeWidth="2" />
      <rect x="182" y="156" width="18" height="22" rx="6" fill={SAGE} stroke={INK} strokeWidth="2" />
      <ellipse cx="248" cy="164" rx="17" ry="15" fill={SKIN} stroke={INK} strokeWidth="2" />
      <path d="M232 160C236 148 250 144 262 152C264 154 264 158 262 168C256 162 252 160 248 160C242 160 238 160 232 160Z" fill={HAIR} stroke={INK} strokeWidth="1.8" />
      <path d="M236 176C242 170 252 170 260 176V196C252 202 242 202 236 196V176Z" fill={ROSE} stroke={INK} strokeWidth="2" />
      <rect x="262" y="172" width="18" height="24" rx="6" fill={PAPER} stroke={INK} strokeWidth="2" />
      <path d="M30 208H286" stroke={MID} strokeWidth="2" />
    </svg>
  );
}

function TinkeringIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M34 186C58 152 98 136 140 136C184 136 220 150 270 180V208H48C34 208 26 196 34 186Z" fill={WASH} stroke="none" />
      <rect x="28" y="50" width="94" height="70" rx="18" fill={PAPER} stroke={INK} strokeWidth="2.2" />
      <path d="M74 54V116" stroke={MID} strokeWidth="1.8" />
      <path d="M48 84L62 70L76 84" stroke={MID} strokeWidth="1.8" />
      <rect x="54" y="84" width="18" height="20" rx="5" fill={SKY} stroke={MID} strokeWidth="1.8" />
      <path d="M88 74H108" stroke={MID} strokeWidth="1.8" />
      <path d="M88 86H102" stroke={MID} strokeWidth="1.8" />
      <path d="M88 98H110" stroke={MID} strokeWidth="1.8" />
      <circle cx="214" cy="80" r="20" fill={ROSE} stroke={INK} strokeWidth="2.2" />
      <path d="M196 76C204 68 222 68 232 80" stroke={INK} strokeWidth="1.8" />
      <path d="M194 88C206 80 222 82 232 94" stroke={INK} strokeWidth="1.8" />
      <path d="M198 100C208 94 220 94 230 104" stroke={INK} strokeWidth="1.8" />
      <path d="M232 102C246 112 248 126 240 144" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="148" cy="152" rx="24" ry="22" fill={SKIN} stroke={INK} strokeWidth="2.2" />
      <path d="M124 146C130 128 150 124 164 132C170 136 172 146 166 160C160 152 152 148 144 148C136 148 130 148 124 146Z" fill={HAIR} stroke={INK} strokeWidth="2" />
      <circle cx="140" cy="154" r="2.4" fill={INK} stroke="none" />
      <circle cx="154" cy="154" r="2.4" fill={INK} stroke="none" />
      <path d="M142 166C146 170 150 170 154 166" stroke={INK} strokeWidth="1.8" />
      <path d="M124 176C136 170 156 170 170 178V202C156 210 136 210 124 202V176Z" fill={GOLD} stroke={INK} strokeWidth="2.2" />
      <path d="M124 184L104 172" stroke={INK} strokeWidth="2.2" />
      <path d="M170 186L188 176" stroke={INK} strokeWidth="2.2" />
      <path d="M138 202L128 212" stroke={INK} strokeWidth="2.2" />
      <path d="M156 202L166 212" stroke={INK} strokeWidth="2.2" />
      <rect x="88" y="148" width="34" height="28" rx="10" fill={SKY} stroke={INK} strokeWidth="2" />
      <path d="M96 160H112" stroke={MID} strokeWidth="1.8" />
      <path d="M180 148L198 166" stroke={INK} strokeWidth="2" />
      <path d="M196 146L178 166" stroke={INK} strokeWidth="2" />
      <circle cx="176" cy="144" r="6" fill={PAPER} stroke={INK} strokeWidth="2" />
      <circle cx="202" cy="144" r="6" fill={PAPER} stroke={INK} strokeWidth="2" />
      <rect x="220" y="150" width="22" height="34" rx="7" fill={SAGE} stroke={INK} strokeWidth="2" />
      <rect x="224" y="140" width="14" height="12" rx="5" fill={PAPER} stroke={INK} strokeWidth="1.8" />
      <path d="M44 182H86" stroke={MID} strokeWidth="2" />
      <path d="M44 30V42" stroke={INK} strokeWidth="2" />
      <path d="M38 36H50" stroke={INK} strokeWidth="2" />
      <path d="M258 56V68" stroke={INK} strokeWidth="2" />
      <path d="M252 62H264" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

const OUTSIDE_ILLUSTRATIONS = {
  mentoring: MentoringIllustration,
  travel: TravelIllustration,
  tinkering: TinkeringIllustration,
} as const;

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
          <div className="r-hero-image-frame">
            <Image
              src={HERO_ILLUSTRATION.src}
              alt=""
              aria-hidden="true"
              width={HERO_ILLUSTRATION.width}
              height={HERO_ILLUSTRATION.height}
              priority
              sizes="(max-width: 768px) 100vw, 340px"
              className="r-hero-illustration"
            />
          </div>
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
              const imageIllustration =
                OUTSIDE_IMAGE_ILLUSTRATIONS[
                  item.illustration as keyof typeof OUTSIDE_IMAGE_ILLUSTRATIONS
                ];
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
                  {imageIllustration && (
                    <div className="r-outside-item-illustration">
                      <div className="r-outside-image-frame">
                        <Image
                          src={imageIllustration.src}
                          alt=""
                          aria-hidden="true"
                          width={imageIllustration.width}
                          height={imageIllustration.height}
                          sizes="(max-width: 640px) 100vw, 220px"
                          className="r-outside-illustration"
                        />
                      </div>
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
              const logo = teamsWorkedWith.logos[key];
              return (
                <div key={key} className="r-team-logo-cell">
                  {logo ? (
                    <img
                      src={logo}
                      alt={name}
                      title={name}
                      data-slug={key}
                      className="r-team-logo-img"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="r-team-logo-name">{name}</span>
                  )}
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
