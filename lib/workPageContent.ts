/**
 * Structural labels of a work case study page (headings, meta labels, buttons).
 * Shared defaults; each case study overrides them under its own key: `work.<slug>.labels.<name>`.
 * A heading that has a field on the work item (overviewTitle, challengeTitle, processTitle,
 * additionalSections.<i>.title) uses that field's key instead.
 */
export const workPageLabels = {
  back: "← Back to work",
  role: "Role",
  duration: "Duration",
  tools: "Tools",
  overview: "Overview",
  about: "About",
  challenge: "The Challenge",
  problem: "The Problem",
  designProcess: "Design Process",
  process: "Process",
  approach: "Approach",
  whatIDid: "What I Did",
  keyContributions: "Key Contributions",
  highlights: "Highlights",
  outcome: "Outcome",
  atAGlance: "At a glance",
  learned: "What I learned",
  contactCta: "Contact me",
} as const;

export type WorkPageLabel = keyof typeof workPageLabels;
