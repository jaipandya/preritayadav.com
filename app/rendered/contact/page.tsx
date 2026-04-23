"use client";

import { motion } from "motion/react";
import {
  contactTitle,
  contactSubtitle,
  contactEmail,
  socials,
} from "@/lib/contactContent";
import { fadeUp, staggerContainer } from "@/lib/renderedAnimations";

function ExternalArrow() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10L10 4M10 4H5M10 4v5" />
    </svg>
  );
}

export default function RenderedContactPage() {
  return (
    <div className="r-container">
      <motion.div
        className="r-contact-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 variants={fadeUp} custom={0}>
          {contactTitle}
        </motion.h1>
        <motion.p variants={fadeUp} custom={1}>
          {contactSubtitle.replace("\n", " ")}
        </motion.p>

        <motion.a
          href={`mailto:${contactEmail}`}
          variants={fadeUp}
          custom={2}
          className="r-hero-cta"
          style={{ display: "inline-flex" }}
        >
          {contactEmail}
        </motion.a>

        <motion.div
          variants={fadeUp}
          custom={3}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 48 }}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="r-contact-pill"
            >
              {s.label}
              <ExternalArrow />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
