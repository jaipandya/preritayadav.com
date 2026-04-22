"use client";

import { PageShell } from "@/components/PageShell";
import { createLandingLayout } from "@/lib/createLandingLayout";
import { workItems, getFeaturedWork } from "@/lib/workData";
import {
  hero,
  blogPosts,
  designPrinciples,
  team,
  skills,
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
        <a href="/work">View all work</a>
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

      <section aria-label="Design principles">
        <h2>My design principles</h2>
        <ul>
          {designPrinciples.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Collaboration">
        <h2>{team.title}</h2>
        <p>{team.subtitle}</p>
      </section>

      <section aria-label="Core capabilities">
        <h2>Core capabilities</h2>
        <ul>
          {skills.map((s) => (
            <li key={s.label}>{s.label}</li>
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
