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

/** The "not built yet" gate shown on /rendered until the fake build has run (components/rendered/BuildGate.tsx). */
export const buildGate = {
  label: "Not built yet",
  title: "This page hasn’t been built yet.",
  body: "The rendered site is generated from the sketch. Run the build to see this page.",
  build: "Build it",
  sketch: "Back to the sketch",
  building: { title: "Building the rendered site.", show: "Show build output", progressLabel: "Build progress" },
  ready: { title: "Your build is ready.", body: "The rendered site is waiting.", open: "Open the page" },
};

/** Accessible text added to links that open another site or a new tab. */
export const newTabLabel = "opens in a new tab";
export const skipToContentLabel = "Skip to content";

/** Copy button on the contact page. */
export const copyEmailLabel = "Copy email address";
export const emailCopiedLabel = "Email address copied";

export const renderedCaseStudyNavLabel = "More case studies";

export const aboutPortrait = {
  src: "/rendered/generated/about-portrait-watercolor.webp",
  width: 1000,
  height: 750,
  /** 20 by 15 preview shown while the image loads (made from the WebP with OpenCV). */
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAPABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0bxBrd7pVpcS29nJcSbQsCRruJY9yB/COufwqnoV3q17YTJql6I7i3m2iZYzEHBQHoeoBJHvitCfSb2S8eczD5m429gOgxxx689arSeHJ55fOnl8wbvljxtwvuckHqaxXNza7Gnu28zbsWujbD7UVMoJBKjAIoqOz02K1SQAZMkhkbcSeTRWivYg//9k=",
  alt: "Watercolor illustration of Prerita sketching wireframes at her desk",
};
