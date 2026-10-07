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

/** Accessible text added to links that open another site or a new tab. */
export const newTabLabel = "opens in a new tab";
export const skipToContentLabel = "Skip to content";

export const renderedCaseStudyNavLabel = "More case studies";

export const aboutPortrait = {
  src: "/rendered/generated/about-portrait.webp",
  width: 1000,
  height: 750,
  /** 20 by 15 preview shown while the image loads (made from the WebP with OpenCV). */
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAPABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDt9Xv7ixtpnht3lkwBEFG7LHuQOw61X0i4vbq0lS/nCzQSbfMCGMOCoOcHrgkj8KtS2s73DSsw+Y4BXsB04NV5dIeWUSySlsNwmMcfXNYq9/I00t5mpbed5X+kEF8nkDHFFRW1sI0YkEF2LkZzjPvRVEn/2Q==",
  alt: "Illustration of Prerita sketching wireframes at her desk",
};
