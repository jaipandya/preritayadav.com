"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { createLandingLayout } from "@/lib/createLandingLayout";
import { workItems, getFeaturedWork } from "@/lib/workData";
import {
  hero,
  blogPosts,
  outsideWork,
  teamsWorkedWith,
  contactMe,
  footerClosing,
  footerCta,
  featuredWorkHeading,
  viewAllWorkLabel,
  blogHeading,
} from "@/lib/landingContent";

const navLinks = [
  { href: "/work", label: "Work" },
  ...workItems.map((item) => ({
    href: `/work/${item.slug}`,
    label: item.title,
  })),
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const featured = getFeaturedWork();

export default function Home() {
  return (
    <PageShell navLinks={navLinks} pageKey="landing-v5" onCreateLayout={createLandingLayout}>
      <header>
        <p>{hero.greeting}</p>
        <h1>{hero.name}</h1>
        <p>{hero.subtitle.replace("\n", ". ")}</p>
        <a href={hero.cta.href}>{hero.cta.label}</a>
      </header>

      <section aria-label={featuredWorkHeading}>
        <h2>{featuredWorkHeading}</h2>
        {featured.map((item) => (
          <article key={item.slug}>
            <h3>
              <a href={`/work/${item.slug}`}>{item.company}: {item.title}</a>
            </h3>
            <p>{item.tagline}</p>
          </article>
        ))}
        <Link href="/work">{viewAllWorkLabel}</Link>
      </section>

      <section aria-label={blogHeading}>
        <h2>{blogHeading}</h2>
        <ul>
          {blogPosts.map((post) => (
            <li key={post.href}>
              <a href={post.href}>{post.title}</a>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Outside work">
        <h2>{outsideWork.heading}</h2>
        {outsideWork.items.map((item) => (
          <article key={item.number}>
            <h3>{item.title}</h3>
            <p><strong>{item.subtitle}</strong></p>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section aria-label="Teams worked with">
        <h2>{teamsWorkedWith.heading}</h2>
        <ul>
          {teamsWorkedWith.companyNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Contact me">
        <h2>{contactMe.heading}</h2>
        <nav aria-label="Social links">
          {contactMe.links.map((link) => (
            <a key={link.icon} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </section>

      <footer>
        <p>{footerClosing}</p>
        <a href={footerCta.href}>{footerCta.label}</a>
      </footer>
    </PageShell>
  );
}
