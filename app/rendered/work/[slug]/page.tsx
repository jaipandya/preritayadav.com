"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { motion } from "motion/react";
import { getWorkBySlug, workItems } from "@/lib/workData";
import { fadeUp, ease } from "@/lib/renderedAnimations";

function ArrowLeft() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9H4M8 5L4 9l4 4" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

export default function RenderedWorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const work = getWorkBySlug(slug);

  if (!work) return notFound();

  const currentIndex = workItems.findIndex((w) => w.slug === slug);
  const next = workItems[currentIndex + 1];
  const prev = workItems[currentIndex - 1];

  return (
    <div className="r-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ paddingTop: 32 }}
      >
        <Link href="/rendered/work" className="r-work-cta" style={{ gap: 8, marginTop: 0 }}>
          <ArrowLeft /> All work
        </Link>
      </motion.div>

      <motion.div
        className="r-case-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
      >
        <p className="r-case-company">{work.company}</p>
        <h1>{work.title}</h1>
        <p className="r-case-tagline">{work.tagline}</p>
      </motion.div>

      <motion.div
        className="r-case-meta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        <div className="r-case-meta-item">
          <label>Role</label>
          <span>{work.role}</span>
        </div>
        <div className="r-case-meta-item">
          <label>Duration</label>
          <span>{work.duration}</span>
        </div>
        <div className="r-case-meta-item">
          <label>Tools</label>
          <span>{work.tools}</span>
        </div>
      </motion.div>

      <motion.div
        className="r-case-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        custom={0}
      >
        <h2>Overview</h2>
        <p>{work.overview}</p>
      </motion.div>

      <motion.div
        className="r-case-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        custom={0}
      >
        <h2>The Challenge</h2>
        <p>{work.challenge}</p>
      </motion.div>

      <motion.div
        className="r-case-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        custom={0}
      >
        <h2>Process</h2>
        <div className="r-case-process">
          {work.process.map((step) => (
            <span key={step} className="r-case-process-step">{step}</span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="r-case-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        custom={0}
      >
        <h2>Approach</h2>
        <p>{work.approach}</p>
      </motion.div>

      <motion.div
        className="r-case-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        custom={0}
      >
        <h2>Key Contributions</h2>
        <ul>
          {work.keyContributions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="r-case-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        custom={0}
      >
        <h2>Outcome</h2>
        <p>{work.outcome}</p>
      </motion.div>

      <div style={{ padding: "56px 0", display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        {prev ? (
          <Link href={`/rendered/work/${prev.slug}`} className="r-work-cta" style={{ marginTop: 0 }}>
            <ArrowLeft /> {prev.company}: {prev.title}
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/rendered/work/${next.slug}`} className="r-work-cta" style={{ marginTop: 0 }}>
            {next.company}: {next.title}
            <ArrowRight />
          </Link>
        )}
      </div>
    </div>
  );
}
