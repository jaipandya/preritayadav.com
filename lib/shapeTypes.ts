/** Props of every custom canvas shape, by shape type. The canvas engine (`lib/canvas`) types shapes from this map. */
export interface CustomShapePropsMap {
  "project-card": {
    w: number;
    h: number;
    number: string;
    title: string;
    description: string;
    mediaType: string;
  };
  "hand-drawn-button": {
    w: number;
    h: number;
    label: string;
  };
  annotation: {
    w: number;
    h: number;
    text: string;
    fontSize: number;
    showArrow: boolean;
    arrowDirection: string;
  };
  "team-avatars": {
    w: number;
    h: number;
    title: string;
    subtitle: string;
    count: number;
  };
  "skill-icon": {
    w: number;
    h: number;
    icon: string;
    label: string;
  };
  "image-placeholder": {
    w: number;
    h: number;
  };
  "browser-frame": {
    w: number;
    h: number;
    url: string;
    contentType: string;
    src: string;
  };
  "hand-drawn-illustration": {
    w: number;
    h: number;
    scene: string;
  };
  "company-logos": {
    w: number;
    h: number;
    companies: string;
  };
  "outside-work-card": {
    w: number;
    h: number;
    number: string;
    title: string;
    subtitle: string;
    description: string;
    illustration: string;
  };
  "contact-me": {
    w: number;
    h: number;
  };
  /** A case study screenshot. `naturalWidth` is the width of the file, used to pick an optimized size. */
  "canvas-image": {
    w: number;
    h: number;
    src: string;
    naturalWidth: number;
    altText: string;
  };
}
