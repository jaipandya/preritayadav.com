"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  workTitle,
  workSubtitle,
  archiveTitle,
  archiveSubtitle,
} from "@/lib/workListingContent";
import { getMainWork, getArchivedWork } from "@/lib/workData";
import { fadeUp, staggerContainer, ease } from "@/lib/renderedAnimations";

function CompanyMark({ company }: { company: string }) {
  return (
    <span className="r-company-mark" aria-label={company} title={company}>
      {company.charAt(0)}
    </span>
  );
}

function ArrowRight() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

export default function RenderedWorkPage() {
  const main = getMainWork();
  const archived = getArchivedWork();

  return (
    <div className="r-container">
      <motion.div
        className="r-work-page-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <h1>{workTitle}</h1>
        <p>{workSubtitle}</p>
      </motion.div>

      <motion.div
        className="r-work-page-group"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={staggerContainer}
      >
        <motion.div className="r-work-page-group-label" variants={fadeUp} custom={0}>
          Featured &amp; Recent
        </motion.div>

        <div className="r-work-list">
          {main.map((item, i) => (
            <motion.div key={item.slug} variants={fadeUp} custom={i + 1}>
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
      </motion.div>

      <motion.div
        className="r-work-page-group"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={staggerContainer}
      >
        <motion.div className="r-work-page-group-label" variants={fadeUp} custom={0}>
          {archiveTitle}
        </motion.div>
        <motion.p
          variants={fadeUp}
          custom={1}
          style={{ fontSize: 15, color: "var(--r-text-secondary)", marginBottom: 32 }}
        >
          {archiveSubtitle}
        </motion.p>

        <div className="r-work-list">
          {archived.map((item, i) => (
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
      </motion.div>
    </div>
  );
}
