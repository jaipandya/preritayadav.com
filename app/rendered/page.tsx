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
      return <svg {...s}><path d="M13 3a6.5 6.5 0 01-1.8.5A3.2 3.2 0 0012.6 2a6.4 6.4 0 01-2 .8A3.2 3.2 0 005.3 6 9.1 9.1 0 012 3.5a3.2 3.2 0 001 4.3 3.2 3.2 0 01-1.5-.4v.1a3.2 3.2 0 002.6 3.1 3.2 3.2 0 01-1.5.1 3.2 3.2 0 003 2.2A6.4 6.4 0 012 14a9.1 9.1 0 004.9 1.4c5.9 0 9.1-4.9 9.1-9.1v-.4" /></svg>;
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
  const doubled = [...companies, ...companies];

  return (
    <>
      {/* ─── HERO — asymmetric two-column ─── */}
      <section className="r-hero">
        <div className="r-hero-left">
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
          className="r-hero-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          <div className="r-hero-stats">
            <div className="r-hero-stat">
              <div className="r-hero-stat-value">6+</div>
              <div className="r-hero-stat-label">Years in design</div>
            </div>
            <div className="r-hero-stat">
              <div className="r-hero-stat-value">8</div>
              <div className="r-hero-stat-label">Teams worked with</div>
            </div>
            <div className="r-hero-stat">
              <div className="r-hero-stat-value">26</div>
              <div className="r-hero-stat-label">Countries explored</div>
            </div>
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
                  <span className="r-work-num">{item.number}</span>
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

      {/* ─── OUTSIDE WORK — horizontal scroll cards ─── */}
      <div className="r-wide">
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

          <motion.div variants={fadeUp} custom={2}>
            <div className="r-outside-scroll-wrapper">
              <div className="r-outside-track">
                {outsideWork.items.map((item) => (
                  <div key={item.number} className="r-outside-card">
                    <div className="r-outside-card-num">{item.number}</div>
                    <h3>{item.title}</h3>
                    <div className="r-outside-card-subtitle">{item.subtitle}</div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* ─── TEAMS — marquee ─── */}
      <div className="r-full-bleed">
        <div className="r-full-bleed-inner" style={{ padding: "48px 0" }}>
          <p className="r-section-label" style={{ textAlign: "center", marginBottom: 28 }}>
            {teamsWorkedWith.heading}
          </p>
          <div className="r-teams-marquee">
            <div className="r-teams-marquee-track">
              {doubled.map((name, i) => (
                <span key={`${name}-${i}`}>
                  <span className="r-team-name">{name}</span>
                  <span className="r-team-sep">&nbsp;&middot;&nbsp;</span>
                </span>
              ))}
            </div>
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
