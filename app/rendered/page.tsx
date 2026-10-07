import Image from "next/image";
import Link from "next/link";
import {
  hero,
  blogPosts,
  outsideWork,
  teamsWorkedWith,
  footerClosing,
  footerCta,
  featuredWorkHeading,
  viewAllWorkLabel,
  blogHeading,
} from "@/lib/landingContent";
import { itemIds } from "@/lib/contentOverrides";
import { newTabLabel } from "@/lib/renderedChrome";
import { getFeaturedWork } from "@/lib/workData";
import { Content, ContentItem, ContentLines } from "@/components/rendered/Content";
import { ExtArrow } from "@/components/rendered/ExtArrow";
import { Mark } from "@/components/rendered/Mark";
import { TeamLogos } from "@/components/rendered/TeamLogos";

export default function RenderedHome() {
  const featured = getFeaturedWork();

  return (
    <div className="r-col">
      <header className="r-hero">
        <p className="r-label">
          <Content k="landing.hero.greeting" fallback={hero.greeting} />
        </p>
        <h1 className="r-display">
          <Content k="landing.hero.name" fallback={hero.name} />
        </h1>
        <ContentLines k="landing.hero.subtitle" fallback={hero.subtitle} primaryClass="r-intro" secondaryClass="r-small" />
      </header>

      <section className="r-section" aria-labelledby="featured-heading">
        <h2 className="r-label" id="featured-heading">
          <Content k="landing.featuredWorkHeading" fallback={featuredWorkHeading} />
        </h2>
        <div className="r-rows">
          {featured.map((item) => (
            <ContentItem key={item.slug} id={itemIds.featuredWork(item.slug)}>
              <Link href={`/rendered/work/${item.slug}`} className="r-row">
                <span className="r-row-lead">
                  <Mark slug={item.slug} company={item.company} />
                  <span className="r-row-main">
                    <span className="r-row-title">
                      <Content k={`work.${item.slug}.company`} fallback={item.company} />
                    </span>
                    <span className="r-row-desc">
                      <Content k={`work.${item.slug}.tagline`} fallback={item.tagline} />
                    </span>
                  </span>
                </span>
              </Link>
            </ContentItem>
          ))}
          <Link href="/rendered/work" className="r-row">
            <span className="r-row-plain">
              <Content k="landing.viewAllWorkLabel" fallback={viewAllWorkLabel} />
            </span>
          </Link>
        </div>
      </section>

      <section className="r-section" aria-labelledby="writing-heading">
        <h2 className="r-label" id="writing-heading">
          <Content k="landing.blogHeading" fallback={blogHeading} />
        </h2>
        <div className="r-rows">
          {blogPosts.map((post, i) => (
            <ContentItem key={post.href} id={itemIds.blogPost(i)}>
              <a href={post.href} target="_blank" rel="noopener noreferrer" className="r-row">
                <span className="r-row-main">
                  <span className="r-row-title">
                    <Content k={`landing.blogPosts.${i}.title`} fallback={post.title} />
                    <span className="r-ext"><ExtArrow /></span>
                    <span className="sr-only"> ({newTabLabel})</span>
                  </span>
                  <span className="r-row-desc">
                    <Content k={`landing.blogPosts.${i}.description`} fallback={post.description} />
                  </span>
                </span>
              </a>
            </ContentItem>
          ))}
        </div>
      </section>

      <section className="r-section" aria-labelledby="outside-heading">
        <h2 className="r-label" id="outside-heading">
          <Content k="landing.outsideWork.heading" fallback={outsideWork.heading} />
        </h2>
        <div className="r-items">
          {outsideWork.items.map((item) => (
            <ContentItem key={item.number} id={itemIds.outsideWork(item.number)}>
              <article className="r-item">
                <span className="r-item-num" aria-hidden="true">{item.number}</span>
                <div>
                  <h3 className="r-row-title">{item.title}</h3>
                  <p className="r-row-desc">{item.subtitle}</p>
                  <p className="r-item-body">{item.description}</p>
                </div>
                <Image
                  className="r-item-thumb"
                  src={`/rendered/generated/outside-${item.illustration}.webp`}
                  alt=""
                  width={384}
                  height={384}
                  sizes="(max-width: 479px) 80px, 112px"
                />
              </article>
            </ContentItem>
          ))}
        </div>
      </section>

      <section className="r-section" aria-labelledby="teams-heading">
        <h2 className="r-label" id="teams-heading" style={{ marginBottom: 16 }}>
          <Content k="landing.teamsWorkedWith.heading" fallback={teamsWorkedWith.heading} />
        </h2>
        <ContentItem id={itemIds.teamLogos}>
          <TeamLogos />
        </ContentItem>
      </section>

      <footer className="r-end">
        <p className="r-lede">
          <Content k="landing.footerClosing" fallback={footerClosing} />
        </p>
        <div className="r-btn-wrap">
          <Link href="/rendered/contact" className="r-btn">
            <Content k="landing.footerCta.label" fallback={footerCta.label} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
