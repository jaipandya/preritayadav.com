/**
 * Fixed text of the rendered site: navigation chrome, accessible names and image descriptions.
 * Not content keys: the WIP canvas has no editable text for these (docs/rendered-design.md 4.5).
 */
export const renderedNav = {
  ariaLabel: "Primary",
  links: [
    { href: "/rendered", label: "Home" },
    { href: "/rendered/work", label: "Work" },
    { href: "/rendered/about", label: "About" },
  ],
  cta: { href: "/rendered/contact", label: "Let’s talk" },
  sketchLabel: "Switch to sketch version",
};

export const renderedCaseStudyNavLabel = "More case studies";

export const aboutPortrait = {
  src: "/rendered/generated/hero-notion-avatar.png",
  width: 1448,
  height: 1086,
  alt: "Illustration of Prerita sketching wireframes at her desk",
};
