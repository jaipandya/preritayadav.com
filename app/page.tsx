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
  testimonial,
  footerIcons,
  footerClosing,
  footerCta,
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
    <PageShell navLinks={navLinks} pageKey="landing" onCreateLayout={createLandingLayout}>
      <header>
        <p>{hero.greeting}</p>
        <h1>{hero.name}</h1>
        <p>{hero.subtitle.replace("\n", " — ")}</p>
        <a href={hero.cta.href}>{hero.cta.label}</a>
      </header>

      <section aria-label="Featured work">
        <h2>Featured work</h2>
        {featured.map((item) => (
          <article key={item.slug}>
            <h3>
              <a href={`/work/${item.slug}`}>{item.company}: {item.title}</a>
            </h3>
            <p>{item.tagline}</p>
          </article>
        ))}
        <Link href="/work">View all work</Link>
      </section>

      <section aria-label="Writing and ideas">
        <h2>Writing &amp; ideas</h2>
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

      <section aria-label="Testimonial">
        <h2>{testimonial.heading}</h2>
        <blockquote>{testimonial.quote}</blockquote>
      </section>

      <footer>
        <p>{footerClosing}</p>
        <nav aria-label="Footer navigation">
          {footerIcons.map((item) => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a href={footerCta.href}>{footerCta.label}</a>
      </footer>
    </PageShell>
  );
}
