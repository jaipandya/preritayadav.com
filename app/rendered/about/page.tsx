import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  aboutTitle,
  aboutParagraphs,
  aboutOutro,
  aboutFooterText,
  aboutCta,
} from "@/lib/aboutContent";
import { Content } from "@/components/rendered/Content";
import { aboutPortrait } from "@/lib/renderedChrome";


export const metadata: Metadata = { title: "About" };

export default function RenderedAboutPage() {
  return (
    <div className="r-col">
      <header>
        <h1 className="r-title">
          <Content k="about.title" fallback={aboutTitle} />
        </h1>
      </header>

      <figure className="r-portrait">
        <Image
          src={aboutPortrait.src}
          alt={aboutPortrait.alt}
          width={aboutPortrait.width}
          height={aboutPortrait.height}
          sizes="(max-width: 540px) calc(100vw - 48px), 516px"
          priority
          placeholder="blur"
          blurDataURL={aboutPortrait.blurDataURL}
        />
      </figure>

      <div className="r-prose" data-tone="dark" style={{ marginTop: 40 }}>
        {aboutParagraphs.map((p, i) => (
          <p key={i} style={{ whiteSpace: "pre-line" }}>
            <Content k={`about.paragraphs.${i}`} fallback={p} />
          </p>
        ))}
      </div>

      <p className="r-lede" style={{ marginTop: 40 }}>
        <Content k="about.outro" fallback={aboutOutro} />
      </p>

      <footer className="r-end">
        <p className="r-sub">
          <Content k="about.footerText" fallback={aboutFooterText} />
        </p>
        <div className="r-btn-wrap">
          <Link href="/rendered/contact" className="r-btn">
            <Content k="about.cta.label" fallback={aboutCta.label} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
