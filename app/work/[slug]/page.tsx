"use client";

import { use } from "react";
import type { Editor } from "@/lib/canvas";
import { PageShell } from "@/components/PageShell";
import { createWorkDetailLayout } from "@/lib/createWorkDetailLayout";
import { getWorkBySlug } from "@/lib/workData";
import Link from "next/link";
import { CaseStudyGallery } from "@/components/ui/CaseStudyGallery";
import { workPageLabels } from "@/lib/workPageContent";

function TextContent({ text }: { text: string }) {
  return text.split(/\n{2,}/).map((paragraph, index) => (
    <p key={index} style={{ whiteSpace: "pre-line" }}>{paragraph}</p>
  ));
}

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
    <PageShell
      navLinks={navLinks}
      pageKey={`work-${slug}${data?.layoutVersion ? `-v${data.layoutVersion}` : ""}`}
      onCreateLayout={handleCreateLayout}
    >
      {data && (
        <>
          <header>
            <p>{data.company}</p>
            <h1>{data.title}</h1>
            <p>{data.tagline}</p>
          </header>

          <dl>
            <dt>{workPageLabels.role}</dt>
            <dd>{data.role}</dd>
            <dt>{workPageLabels.duration}</dt>
            <dd>{data.duration}</dd>
            <dt>{workPageLabels.tools}</dt>
            <dd>{data.tools}</dd>
          </dl>

          <section aria-label={data.overviewTitle ?? workPageLabels.overview}>
            <h2>{data.overviewTitle ?? workPageLabels.overview}</h2>
            <TextContent text={data.overview} />
          </section>

          {data.previewText ? (
            <section aria-label="Project preview">
              <TextContent text={data.previewText} />
            </section>
          ) : (
            <>
              <section aria-label={data.challengeTitle ?? workPageLabels.challenge}>
                <h2>{data.challengeTitle ?? workPageLabels.challenge}</h2>
                <TextContent text={data.challenge} />
              </section>

              {data.processIntro && (
                <section aria-label={workPageLabels.designProcess}>
                  <h2>{workPageLabels.designProcess}</h2>
                  <TextContent text={data.processIntro} />
                </section>
              )}

              <section aria-label={data.processTitle ?? workPageLabels.process}>
                <h2>{data.processTitle ?? workPageLabels.process}</h2>
                <ol>
                  {data.process.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </section>

              {data.approach.trim() && (
                <section aria-label={workPageLabels.approach}>
                  <h2>{workPageLabels.approach}</h2>
                  <TextContent text={data.approach} />
                </section>
              )}

              {data.keyContributions.length > 0 && (
                <section aria-label="Key contributions">
                  <h2>{workPageLabels.keyContributions}</h2>
                  <ul>
                    {data.keyContributions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {data.additionalSections?.map((section) => (
                <section key={section.title} aria-label={section.title}>
                  <h2>{section.title}</h2>
                  <TextContent text={section.body} />
                </section>
              ))}

              <section aria-label={workPageLabels.outcome}>
                <h2>{workPageLabels.outcome}</h2>
                <TextContent text={data.outcome} />
              </section>

              {(data.showAtAGlance || data.atAGlanceImages?.length) && (
                <section aria-label={workPageLabels.atAGlance}>
                  <h2>{workPageLabels.atAGlance}</h2>
                  {data.atAGlanceImages && <CaseStudyGallery images={data.atAGlanceImages} />}
                </section>
              )}

              {(data.learnings || data.learningPoints) && (
                <section aria-label={workPageLabels.learned}>
                  <h2>{workPageLabels.learned}</h2>
                  {data.learningPoints ? (
                    <ul>
                      {data.learningPoints.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  ) : data.learnings ? <TextContent text={data.learnings} /> : null}
                </section>
              )}
            </>
          )}

          <footer>
            <Link href="/contact">{workPageLabels.contactCta}</Link>
            <Link href="/work">{workPageLabels.back}</Link>
          </footer>
        </>
      )}
    </PageShell>
  );
}
