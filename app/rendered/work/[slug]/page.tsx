import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getWorkBySlug, workItems } from "@/lib/workData";
import { workPageLabels } from "@/lib/workPageContent";
import { caseStudySections } from "@/lib/caseStudySections";
import { renderedCaseStudyNavLabel } from "@/lib/renderedChrome";
import { Content, ContentList, ContentParagraphs } from "@/components/rendered/Content";
import { Mark } from "@/components/rendered/Mark";
import { BackLink } from "@/components/rendered/BackLink";
import { FloatingBack } from "@/components/rendered/FloatingBack";
import { CaseStudyGallery } from "@/components/ui/CaseStudyGallery";

export function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

// Titles use the defaults on purpose: overrides are not applied to metadata.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = getWorkBySlug((await params).slug);
  if (!item) return { title: "Project Not Found" };
  return { title: `${item.title}, ${item.company}`, description: item.tagline };
}

export default async function RenderedWorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return notFound();

  const k = (path: string) => `work.${slug}.${path}`;
  const sections = caseStudySections(work);
  const index = workItems.findIndex((w) => w.slug === slug);
  const neighbours = [workItems[index - 1], workItems[index + 1]].filter(Boolean);

  const meta = [
    { name: "role", value: work.role },
    { name: "duration", value: work.duration },
    { name: "tools", value: work.tools },
  ] as const;

  return (
    <div className="r-col">
      <FloatingBack href="/rendered/work" k={k("labels.back")} fallback={workPageLabels.back} />

      <BackLink href="/rendered/work">
        <Content k={k("labels.back")} fallback={workPageLabels.back} />
      </BackLink>

      <header>
        <div className="r-case-head">
          <Mark slug={slug} company={work.company} size="lg" />
          <div>
            <p className="r-small">
              <Content k={k("company")} fallback={work.company} />
            </p>
            <h1 className="r-title">
              <Content k={k("title")} fallback={work.title} />
            </h1>
          </div>
        </div>
        <p className="r-lede r-case-lede">
          <Content k={k("tagline")} fallback={work.tagline} />
        </p>
        <dl className="r-meta">
          {meta.map(({ name, value }) => (
            <div key={name} className="r-meta-item">
              <dt className="r-mono-small">
                <Content k={k(`labels.${name}`)} fallback={workPageLabels[name]} />
              </dt>
              <dd>
                <span>
                  <Content k={k(name)} fallback={value} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="r-case-body">
        {sections.map((section) => {
          if (section.kind === "text") {
            return (
              <section key={section.id} className="r-block">
                {section.heading && (
                  <h2 className="r-label">
                    <Content k={section.heading.key} fallback={section.heading.fallback} />
                  </h2>
                )}
                <ContentParagraphs k={section.body.key} fallback={section.body.fallback} />
              </section>
            );
          }
          if (section.kind === "list") {
            return (
              <section key={section.id} className="r-block">
                <h2 className="r-label">
                  <Content k={section.heading.key} fallback={section.heading.fallback} />
                </h2>
                <ContentList k={section.list.key} fallback={section.list.fallback} />
              </section>
            );
          }
          if (section.kind === "process") {
            return (
              <section key={section.id} className="r-block">
                <h2 className="r-label">
                  <Content k={section.heading.key} fallback={section.heading.fallback} />
                </h2>
                <ol className="r-steps">
                  {section.steps.map((step) => (
                    <li key={step.key}>
                      <Content k={step.key} fallback={step.fallback} />
                    </li>
                  ))}
                </ol>
              </section>
            );
          }
          return (
            <section key={section.id} className="r-block">
              <h2 className="r-label">
                <Content k={section.heading.key} fallback={section.heading.fallback} />
              </h2>
              <div className="r-tray">
                <CaseStudyGallery images={section.images} />
              </div>
            </section>
          );
        })}
      </div>

      <nav className="r-rows r-rows-pair" aria-label={renderedCaseStudyNavLabel}>
        {neighbours.map((item) => (
          <Link key={item.slug} href={`/rendered/work/${item.slug}`} className="r-row">
            <span className="r-row-lead">
              <Mark slug={item.slug} company={item.company} />
              <span className="r-row-title">
                <Content k={`work.${item.slug}.company`} fallback={item.company} />
                <span className="r-row-title-sub">
                  <Content k={`work.${item.slug}.title`} fallback={item.title} />
                </span>
              </span>
            </span>
          </Link>
        ))}
      </nav>

      <div className="r-end">
        <div className="r-btn-wrap">
          <Link href="/rendered/contact" className="r-btn">
            <Content k={k("labels.contactCta")} fallback={workPageLabels.contactCta} />
          </Link>
        </div>
      </div>
    </div>
  );
}
