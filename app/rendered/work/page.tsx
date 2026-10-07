import type { Metadata } from "next";
import Link from "next/link";
import {
  workTitle,
  workSubtitle,
  archiveTitle,
  archiveSubtitle,
  workListingBackLabel,
  workListingCtaLabel,
} from "@/lib/workListingContent";
import { getMainWork, getArchivedWork, type WorkItem } from "@/lib/workData";
import { Content, CardTitle } from "@/components/rendered/Content";
import { Mark } from "@/components/rendered/Mark";
import { BackLink } from "@/components/rendered/BackLink";

function WorkRow({ item }: { item: WorkItem }) {
  return (
    <Link href={`/rendered/work/${item.slug}`} className="r-row">
      <span className="r-row-lead">
        <Mark slug={item.slug} company={item.company} />
        <span className="r-row-main">
          <CardTitle slug={item.slug} company={item.company} title={item.title} />
          <span className="r-row-desc">
            <Content k={`work.${item.slug}.tagline`} fallback={item.tagline} />
          </span>
        </span>
      </span>
    </Link>
  );
}

export const metadata: Metadata = { title: "Work" };

export default function RenderedWorkPage() {
  const main = getMainWork();
  const archived = getArchivedWork();

  return (
    <div className="r-col">
      <BackLink href="/rendered">
        <Content k="workListing.backLabel" fallback={workListingBackLabel} />
      </BackLink>

      <header className="r-hero">
        <h1 className="r-title">
          <Content k="workListing.title" fallback={workTitle} />
        </h1>
        <p className="r-sub" style={{ marginTop: 12 }}>
          <Content k="workListing.subtitle" fallback={workSubtitle} />
        </p>
      </header>

      <section className="r-section" style={{ marginTop: 40 }} aria-label={workTitle}>
        <div className="r-rows">
          {main.map((item) => (
            <WorkRow key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="r-section" aria-labelledby="archive-heading">
        <h2 className="r-label" id="archive-heading">
          <Content k="workListing.archiveTitle" fallback={archiveTitle} />
        </h2>
        <p className="r-sub">
          <Content k="workListing.archiveSubtitle" fallback={archiveSubtitle} />
        </p>
        <div className="r-rows">
          {archived.map((item) => (
            <WorkRow key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <div className="r-end">
        <div className="r-btn-wrap">
          <Link href="/rendered/contact" className="r-btn">
            <Content k="workListing.ctaLabel" fallback={workListingCtaLabel} />
          </Link>
        </div>
      </div>
    </div>
  );
}
