"use client";

import { useContent, useContentList, useContentOverrides } from "@/lib/useContentOverrides";
import { HIDDEN_KEY, contentKey } from "@/lib/contentOverrides";
import { CopyButton } from "./CopyButton";

/**
 * Client leaves for every piece of content text on the rendered site. The page itself stays a server
 * component and passes the default from `lib/` as `fallback`, so the server HTML is the default text and
 * the visitor's override (WIP canvas edit saved with Build) is applied on top.
 * See docs/content-overrides.md.
 */

const NO_ITEMS: string[] = [];

/**
 * A removable item (a card, a row, an image) that the WIP canvas can delete. Renders nothing when its shapes were
 * deleted on the canvas. `id` is the id the layout creator gave the shapes with `withItem`.
 * Renders no element of its own, so it can sit anywhere in a flex or grid parent.
 */
export function ContentItem({ id, children }: { id: string; children: React.ReactNode }) {
  const hidden = useContentList(HIDDEN_KEY, NO_ITEMS);
  return hidden.includes(id) ? null : <>{children}</>;
}

/** A single text value. `inline` turns line breaks into spaces (for a field stored on two lines but shown as one). */
export function Content({ k, fallback, inline }: { k: string; fallback: string; inline?: boolean }) {
  const text = useContent(k, fallback);
  return <>{inline ? text.replace(/\s*\n\s*/g, " ") : text}</>;
}

/** Multi-paragraph field. Overrides use a blank line between paragraphs. */
export function ContentParagraphs({ k, fallback, className }: { k: string; fallback: string; className?: string }) {
  const text = useContent(k, fallback);
  if (!text.trim()) return null;
  return (
    <div className={className ?? "r-prose"}>
      {text.split(/\n{2,}/).map((paragraph, i) => (
        <p key={i} style={{ whiteSpace: "pre-line" }}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** List field (bullets). The override can have more or fewer items than the default, including none. */
export function ContentList({ k, fallback, className }: { k: string; fallback: string[]; className?: string }) {
  const items = useContentList(k, fallback);
  if (items.length === 0) return null;
  return (
    <ul className={className ?? "r-list"}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * A field made of lines: the first line is the primary text, the rest (joined with a space) is the secondary text.
 * Used by the home hero subtitle. Class names are props because a server component cannot pass a render function.
 */
export function ContentLines({
  k,
  fallback,
  primaryClass,
  secondaryClass,
}: {
  k: string;
  fallback: string;
  primaryClass?: string;
  secondaryClass?: string;
}) {
  const [first, ...rest] = useContent(k, fallback)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <>
      <p className={primaryClass}>{first}</p>
      {rest.length > 0 && <p className={secondaryClass}>{rest.join(" ")}</p>}
    </>
  );
}

/** Email as a contact row: a leading tile (passed as children), the address, a mailto link and a copy button, all from the same (possibly overridden) value. */
export function ContentEmailRow({ k, fallback, children }: { k: string; fallback: string; children?: React.ReactNode }) {
  const email = useContent(k, fallback);
  if (!email) return null;
  return (
    <div className="r-row-wrap">
      <a href={`mailto:${email}`} className="r-row">
        <span className="r-row-lead">
          {children}
          <span className="r-row-title">{email}</span>
        </span>
      </a>
      {/* A sibling of the link, not inside it: a button cannot live in an anchor. */}
      <CopyButton text={email} />
    </div>
  );
}

/**
 * Work listing card title. If `workListing.cards.<slug>` was edited, it replaces the separate company and
 * title spans with one title. Otherwise it shows the company and the title as the defaults.
 */
export function CardTitle({ slug, company, title }: { slug: string; company: string; title: string }) {
  const overrides = useContentOverrides();
  const key = contentKey("workListing", "cards", slug);
  const override = overrides[key];
  const companyText = useContent(contentKey("work", slug, "company"), company);
  const titleText = useContent(contentKey("work", slug, "title"), title);
  // An emptied title stays empty. It must not fall back to the default.
  if (typeof override === "string") {
    return <span className="r-row-title">{override}</span>;
  }
  return (
    <span className="r-row-title">
      {companyText}
      <span className="r-row-title-sub">{titleText}</span>
    </span>
  );
}
