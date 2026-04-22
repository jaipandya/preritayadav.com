"use client";

import { PageShell } from "@/components/PageShell";
import { createWorkListingLayout } from "@/lib/createWorkListingLayout";
import { workItems, getMainWork, getArchivedWork } from "@/lib/workData";
import {
  workTitle,
  workSubtitle,
  archiveTitle,
  archiveSubtitle,
} from "@/lib/workListingContent";

const navLinks = [
  { href: "/", label: "Home" },
  ...workItems.map((item) => ({
    href: `/work/${item.slug}`,
    label: item.title,
  })),
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const mainWork = getMainWork();
const archived = getArchivedWork();

export default function WorkPage() {
  return (
    <PageShell navLinks={navLinks} pageKey="work-listing" onCreateLayout={createWorkListingLayout}>
      <h1>{workTitle}</h1>
      <p>{workSubtitle}</p>

      <section aria-label="Selected work">
        {mainWork.map((item) => (
          <article key={item.slug}>
            <h2>
              <a href={`/work/${item.slug}`}>{item.company}: {item.title}</a>
            </h2>
            <p>{item.tagline}</p>
          </article>
        ))}
      </section>

      <section aria-label="Archive">
        <h2>{archiveTitle}</h2>
        <p>{archiveSubtitle}</p>
        {archived.map((item) => (
          <article key={item.slug}>
            <h3>
              <a href={`/work/${item.slug}`}>{item.company}: {item.title}</a>
            </h3>
            <p>{item.tagline}</p>
          </article>
        ))}
      </section>

      <a href="/contact">Contact me</a>
    </PageShell>
  );
}
