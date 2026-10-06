import { contentKey } from "./contentOverrides";
import type { WorkItem } from "./workData";
import { workPageLabels, type WorkPageLabel } from "./workPageContent";

/**
 * The ordered sections of a case study page, with the content key and the default text of every heading and body.
 *
 * It mirrors the WIP layout (`createWorkDetailLayout.ts`), which picks heading labels per `layoutFormat`.
 * The rendered page must use the same key for the same section, otherwise editing a heading on the canvas
 * would not change the rendered page. Pure data, no React. See docs/rendered-design.md (case study table).
 */

export type Field = { key: string; fallback: string };
export type ListField = { key: string; fallback: string[] };

export type Section =
  | { kind: "text"; id: string; heading?: Field; body: Field }
  | { kind: "list"; id: string; heading: Field; list: ListField }
  | { kind: "process"; id: string; heading: Field; steps: Field[] }
  | { kind: "gallery"; id: string; heading: Field; images: NonNullable<WorkItem["atAGlanceImages"]> };

type OwnTitle = "overviewTitle" | "challengeTitle" | "processTitle";

export function caseStudySections(work: WorkItem): Section[] {
  const k = (path: string | number) => contentKey("work", work.slug, path);
  const label = (name: WorkPageLabel): Field => ({ key: k(`labels.${name}`), fallback: workPageLabels[name] });
  /** The item's own title field when it has one, otherwise the shared label. */
  const head = (name: WorkPageLabel, own?: OwnTitle): Field => {
    const custom = own ? work[own] : undefined;
    return custom ? { key: k(own!), fallback: custom } : label(name);
  };
  const text = (id: string, heading: Field | undefined, path: string, value: string): Section[] =>
    value.trim() ? [{ kind: "text", id, heading, body: { key: k(path), fallback: value } }] : [];
  const list = (id: string, heading: Field, path: string, items: string[]): Section[] =>
    items.length ? [{ kind: "list", id, heading, list: { key: k(path), fallback: items } }] : [];
  const process = (): Section[] =>
    work.process.length
      ? [
          {
            kind: "process",
            id: "process",
            heading: head("process", "processTitle"),
            steps: work.process.map((step, i) => ({ key: k(`process.${i}`), fallback: step })),
          },
        ]
      : [];
  const gallery = (): Section[] =>
    work.atAGlanceImages?.length
      ? [{ kind: "gallery", id: "glance", heading: label("atAGlance"), images: work.atAGlanceImages }]
      : [];
  const learned = (): Section[] => text("learned", label("learned"), "learnings", work.learnings ?? "");
  const additional = (): Section[] =>
    (work.additionalSections ?? []).flatMap((extra, i) =>
      text(`extra-${i}`, { key: k(`additionalSections.${i}.title`), fallback: extra.title }, `additionalSections.${i}.body`, extra.body)
    );

  switch (work.layoutFormat) {
    case "preview":
      return [
        ...text("overview", head("overview", "overviewTitle"), "overview", work.overview),
        ...text("preview", undefined, "previewText", work.previewText ?? ""),
      ];

    case "minimal":
      return [
        ...text("overview", label("about"), "overview", work.overview),
        ...text("approach", label("whatIDid"), "approach", work.approach),
        ...list("contributions", label("highlights"), "keyContributions", work.keyContributions),
        ...text("outcome", label("outcome"), "outcome", work.outcome),
      ];

    case "process-heavy":
      return [
        ...text("overview", head("overview", "overviewTitle"), "overview", work.overview),
        ...text("challenge", head("challenge", "challengeTitle"), "challenge", work.challenge),
        ...text("process-intro", label("designProcess"), "processIntro", work.processIntro ?? ""),
        ...process(),
        ...text("approach", label("approach"), "approach", work.approach),
        ...list("contributions", label("keyContributions"), "keyContributions", work.keyContributions),
        ...text("outcome", label("outcome"), "outcome", work.outcome),
        ...(work.showAtAGlance ? gallery() : []),
        ...learned(),
      ];

    case "before-after":
      return [
        ...text("overview", head("overview", "overviewTitle"), "overview", work.overview),
        ...text("challenge", head("problem", "challengeTitle"), "challenge", work.challenge),
        ...process(),
        ...text("approach", label("approach"), "approach", work.approach),
        ...list("contributions", label("keyContributions"), "keyContributions", work.keyContributions),
        ...text("outcome", label("outcome"), "outcome", work.outcome),
        ...gallery(),
        ...learned(),
      ];

    case "narrative":
      return [
        ...text("overview", head("overview", "overviewTitle"), "overview", work.overview),
        ...text("challenge", head("challenge", "challengeTitle"), "challenge", work.challenge),
        ...process(),
        ...text("approach", label("approach"), "approach", work.approach),
        ...list("contributions", label("keyContributions"), "keyContributions", work.keyContributions),
        ...text("outcome", label("outcome"), "outcome", work.outcome),
        ...learned(),
      ];

    default:
      // standard
      return [
        ...text("overview", head("overview", "overviewTitle"), "overview", work.overview),
        ...text("challenge", head("challenge", "challengeTitle"), "challenge", work.challenge),
        ...process(),
        ...text("approach", label("approach"), "approach", work.approach),
        ...list("contributions", label("keyContributions"), "keyContributions", work.keyContributions),
        ...additional(),
        ...text("outcome", label("outcome"), "outcome", work.outcome),
        ...(work.showAtAGlance ? gallery() : []),
        ...(work.learningPoints
          ? list("learned", label("learned"), "learningPoints", work.learningPoints)
          : learned()),
      ];
  }
}
