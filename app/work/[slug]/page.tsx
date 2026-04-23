"use client";

import { use } from "react";
import type { Editor } from "tldraw";
import { PageShell } from "@/components/PageShell";
import { createWorkDetailLayout } from "@/lib/createWorkDetailLayout";
import { getWorkBySlug } from "@/lib/workData";
import Link from "next/link";

const navLinks = [
  { href: "/work", label: "Back to Work" },
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const data = getWorkBySlug(slug);

  const handleCreateLayout = (editor: Editor) => {
    createWorkDetailLayout(editor, slug);
  };

  return (
    <PageShell navLinks={navLinks} pageKey={`work-${slug}`} onCreateLayout={handleCreateLayout}>
      {data && (
        <>
          <header>
            <p>{data.company}</p>
            <h1>{data.title}</h1>
            <p>{data.tagline}</p>
          </header>

          <dl>
            <dt>Role</dt>
            <dd>{data.role}</dd>
            <dt>Duration</dt>
            <dd>{data.duration}</dd>
            <dt>Tools</dt>
            <dd>{data.tools}</dd>
          </dl>

          <section aria-label="Overview">
            <h2>Overview</h2>
            <p>{data.overview}</p>
          </section>

          <section aria-label="Challenge">
            <h2>The Challenge</h2>
            <p>{data.challenge}</p>
          </section>

          <section aria-label="Process">
            <h2>Process</h2>
            <ol>
              {data.process.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section aria-label="Approach">
            <h2>Approach</h2>
            <p>{data.approach}</p>
          </section>

          <section aria-label="Key contributions">
            <h2>Key Contributions</h2>
            <ul>
              {data.keyContributions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-label="Outcome">
            <h2>Outcome</h2>
            <p>{data.outcome}</p>
          </section>

          <footer>
            <Link href="/contact">Contact me</Link>
            <Link href="/work">Back to work</Link>
          </footer>
        </>
      )}
    </PageShell>
  );
}
