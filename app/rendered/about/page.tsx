"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  aboutTitle,
  aboutParagraphs,
  aboutOutro,
  aboutFooterText,
  aboutCta,
} from "@/lib/aboutContent";
import { fadeUp, staggerContainer, ease } from "@/lib/renderedAnimations";

function ArrowRight() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

export default function RenderedAboutPage() {
  return (
    <div className="r-container">
      <motion.div
        className="r-about-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 variants={fadeUp} custom={0}>
          {aboutTitle}
        </motion.h1>

        <div className="r-about-content">
          {aboutParagraphs.map((p, i) => (
            <motion.p key={i} variants={fadeUp} custom={i + 1}>
              {p}
            </motion.p>
          ))}

          <motion.p
            variants={fadeUp}
            custom={aboutParagraphs.length + 1}
            style={{ color: "var(--r-text)", fontFamily: "var(--r-serif)", fontSize: 20, fontStyle: "italic", lineHeight: 1.6, marginTop: 16 }}
          >
            {aboutOutro}
          </motion.p>
        </div>
      </motion.div>

      <hr className="r-divider" />

      <motion.section
        className="r-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease }}
      >
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--r-text-secondary)", maxWidth: 600, marginBottom: 32 }}>
          {aboutFooterText}
        </p>
        <Link href="/rendered/contact" className="r-hero-cta">
          {aboutCta.label}
          <ArrowRight />
        </Link>
      </motion.section>
    </div>
  );
}
