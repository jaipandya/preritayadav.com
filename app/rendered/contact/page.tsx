import type { Metadata } from "next";
import {
  contactTitle,
  contactSubtitle,
  contactEmail,
  contactBackLabel,
  socials,
} from "@/lib/contactContent";
import { Content, ContentEmailRow } from "@/components/rendered/Content";
import { SocialIcon } from "@/components/rendered/SocialIcon";
import { newTabLabel } from "@/lib/renderedChrome";
import { ExtArrow } from "@/components/rendered/ExtArrow";
import { BackLink } from "@/components/rendered/BackLink";

/** "https://www.linkedin.com/in/preritayadav/" becomes "linkedin.com/in/preritayadav". */
function displayUrl(url: string) {
  const { host, pathname } = new URL(url);
  return `${host.replace(/^www\./, "")}${pathname.replace(/\/$/, "")}`;
}

export const metadata: Metadata = { title: "Contact" };

export default function RenderedContactPage() {
  return (
    <div className="r-col">
      <BackLink href="/rendered">
        <Content k="contact.backLabel" fallback={contactBackLabel} />
      </BackLink>

      <header className="r-hero">
        <h1 className="r-title">
          <Content k="contact.title" fallback={contactTitle} />
        </h1>
        <p className="r-sub" style={{ marginTop: 12 }}>
          <Content k="contact.subtitle" fallback={contactSubtitle} inline />
        </p>
      </header>

      <div className="r-section" style={{ marginTop: 40 }}>
        <div className="r-rows">
          <ContentEmailRow k="contact.email" fallback={contactEmail}>
            <span className="r-mark" aria-hidden="true">
              <SocialIcon name="Email" />
            </span>
          </ContentEmailRow>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="r-row">
              <span className="r-row-lead">
                <span className="r-mark" aria-hidden="true">
                  <SocialIcon name={s.label} />
                </span>
                <span className="r-row-main">
                  <span className="r-row-title">
                    {s.label}
                    <span className="sr-only"> ({newTabLabel})</span>
                  </span>
                  <span className="r-row-desc">{displayUrl(s.url)}</span>
                </span>
              </span>
              <span className="r-row-trail"><ExtArrow /></span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
